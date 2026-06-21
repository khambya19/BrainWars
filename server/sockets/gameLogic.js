const Question = require('../models/Question')
const Room     = require('../models/Room')

const activeTimers    = new Map()
const questionAnswers = new Map()
const activeGames     = new Map()

function shuffle(arr) {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

function calcPoints(basePoints, timeElapsed, timePerQuestion) {
  const speed = Math.max(0.5, 1 - (timeElapsed / timePerQuestion) * 0.5)
  return Math.round(basePoints * speed)
}

function calcHpChange(isCorrect, fast) {
  if (!isCorrect) return -20
  if (fast)       return  5
  return 0
}

function buildLeaderboard(players) {
  return [...players]
    .sort((a, b) => b.score - a.score || b.hp - a.hp)
    .map((p, i) => ({
      rank:     i + 1,
      playerId: p.playerId.toString(),
      name:     p.name,
      score:    p.score,
      hp:       Math.max(0, p.hp),
      streak:   p.streak,
    }))
}

async function startGame(io, roomCode) {
  const room = await Room.findOne({ code: roomCode })
  if (!room || room.status !== 'waiting') return

  const { categories, difficulty, questionCount, timePerQuestion } = room.settings

  // Build filter: use host's question bank + category + difficulty
  const filter = {}
  if (room.questionBank) filter.bank = room.questionBank
  if (categories && categories.length > 0) filter.category = { $in: categories }
  if (difficulty && difficulty !== 'Mixed' && difficulty !== 'mixed') {
    const cap = difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase()
    filter.difficulty = { $in: [cap, difficulty.toLowerCase()] }
  }

  // Randomly select questions from the bank with filters applied
  const pool = await Question.aggregate([
    { $match: filter },
    { $sample: { size: Number(questionCount) } },
  ])

  if (pool.length === 0) {
    io.to(roomCode).emit('game:error', {
      message: 'No questions found for the selected settings. Check your question bank.',
    })
    return
  }

  room.questions            = pool.map((q) => q._id)
  room.currentQuestionIndex = 0
  room.status               = 'playing'
  room.players.forEach((p) => { p.score = 0; p.hp = 100; p.streak = 0 })
  await room.save()

  // Store game config in memory for fast access during game loop
  activeGames.set(roomCode, {
    questions:       pool,
    timePerQuestion: Number(timePerQuestion) || 10,
    questionStartTime: null,
  })

  io.to(roomCode).emit('game:starting', { totalQuestions: pool.length })

  setTimeout(() => broadcastQuestion(io, roomCode, pool, 0), 1500)
}

async function broadcastQuestion(io, roomCode, questions, index) {
  const gameConfig      = activeGames.get(roomCode)
  const timePerQuestion = gameConfig?.timePerQuestion ?? 10
  const question        = questions[index]
  const startTime = Date.now()

  // Store server-side start time so elapsed time can be computed independently
  if (gameConfig) gameConfig.questionStartTime = startTime

  questionAnswers.set(roomCode, new Map())

  // Update currentQuestionIndex in DB so answer validation stays in sync
  await Room.findOneAndUpdate({ code: roomCode }, { currentQuestionIndex: index })

  const basePayload = {
    questionId:     question._id,
    text:           question.text,
    type:           question.type,
    difficulty:     question.difficulty,
    points:         question.points,
    timeLimit:      timePerQuestion,
    startTime,
    questionNumber: index + 1,
    totalQuestions: questions.length,
  }

  // Send SAME question to all, but SHUFFLE options individually per player
  const room = io.sockets.adapter.rooms.get(roomCode)
  if (room) {
    room.forEach((socketId) => {
      io.to(socketId).emit('game:question', {
        ...basePayload,
        options: shuffle(question.options),
      })
    })
  }

  const timer = setTimeout(
    () => endQuestion(io, roomCode, questions, index),
    timePerQuestion * 1000,
  )
  activeTimers.set(roomCode, timer)
}

async function recordAnswer(io, roomCode, _qs, _idx, socketId, answer) {
  const answers = questionAnswers.get(roomCode)
  if (!answers || answers.has(socketId)) return

  // Compute elapsed time server-side — never trust the client value
  const gameConfig  = activeGames.get(roomCode)
  const startTime   = gameConfig?.questionStartTime ?? Date.now()
  const timeElapsed = (Date.now() - startTime) / 1000

  answers.set(socketId, { answer, timeElapsed })
  io.to(socketId).emit('game:answer-ack')

  const room = await Room.findOne({ code: roomCode })
  if (!room) return

  // If every player has answered, end early
  if (answers.size >= room.players.length) {
    clearTimeout(activeTimers.get(roomCode))
    activeTimers.delete(roomCode)
    const questions = activeGames.get(roomCode)?.questions
    endQuestion(io, roomCode, questions, room.currentQuestionIndex)
  }
}

async function endQuestion(io, roomCode, questions, index) {
  clearTimeout(activeTimers.get(roomCode))
  activeTimers.delete(roomCode)

  const gameConfig      = activeGames.get(roomCode)
  const timePerQuestion = gameConfig?.timePerQuestion ?? 10
  const question        = questions[index]
  const answers         = questionAnswers.get(roomCode) || new Map()
  questionAnswers.delete(roomCode)

  const room = await Room.findOne({ code: roomCode })
  if (!room) return

  const results = room.players.map((player) => {
    const entry      = answers.get(player.socketId)
    const answered   = Boolean(entry)
    const isCorrect  = answered && entry.answer === question.correctAnswer
    const elapsed    = answered ? entry.timeElapsed : timePerQuestion
    const fast       = isCorrect && elapsed < timePerQuestion / 3

    const points   = isCorrect ? calcPoints(question.points, elapsed, timePerQuestion) : 0
    const hpChange = answered  ? calcHpChange(isCorrect, fast) : -15

    player.score  = Math.max(0, player.score + points)
    player.hp     = Math.max(0, Math.min(100, player.hp + hpChange))
    player.streak = isCorrect ? player.streak + 1 : 0

    return {
      playerId:    player.playerId.toString(),
      name:        player.name,
      answer:      entry?.answer ?? null,
      isCorrect,
      points,
      hpChange,
      streak:      player.streak,
      timeElapsed: Math.round(elapsed * 10) / 10,
    }
  })

  await room.save()

  io.to(roomCode).emit('game:question-result', {
    correctAnswer: question.correctAnswer,
    results,
    leaderboard:   buildLeaderboard(room.players),
  })

  const nextIndex = index + 1

  if (nextIndex < questions.length) {
    setTimeout(() => broadcastQuestion(io, roomCode, questions, nextIndex), 4000)
  } else {
    setTimeout(() => endGame(io, roomCode, room), 4000)
  }
}

async function endGame(io, roomCode, room) {
  room.status = 'finished'
  await room.save()
  activeGames.delete(roomCode)

  io.to(roomCode).emit('game:over', {
    finalLeaderboard: buildLeaderboard(room.players),
  })
}

module.exports = { startGame, recordAnswer, endQuestion, activeGames }
