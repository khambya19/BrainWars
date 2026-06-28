const Question    = require('../models/Question')
const Room        = require('../models/Room')
const Player      = require('../models/Player')
const {
  SCORING,
  DEFAULTS,
  GAME_START_DELAY_MS,
  REVEAL_DELAY_MS,
  MAX_RESPONSE_SAMPLES,
  DAILY_BONUS_AMOUNT,
  NEAR_MISS_THRESHOLD,
} = require('../config/gameConfig')
const { getTier, getNextTier, calcTrophyDelta } = require('../utils/trophyCalculator')

const activeTimers    = new Map()
const questionAnswers = new Map()
const activeGames     = new Map()

// Rolling average of answer response times for /api/stats
const recentResponseTimes = []

function recordResponseTime(elapsed) {
  recentResponseTimes.push(elapsed)
  if (recentResponseTimes.length > MAX_RESPONSE_SAMPLES) recentResponseTimes.shift()
}

function getAvgResponseTime() {
  if (recentResponseTimes.length === 0) return null
  const avg = recentResponseTimes.reduce((a, b) => a + b, 0) / recentResponseTimes.length
  return Math.round(avg * 10) / 10
}

function shuffle(arr) {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

function calcPoints(basePoints, timeElapsed, timePerQuestion) {
  const speed = Math.max(SCORING.MIN_SPEED_RATIO, 1 - (timeElapsed / timePerQuestion) * 0.5)
  return Math.round(basePoints * speed)
}

function calcHpChange(isCorrect, fast) {
  if (!isCorrect) return SCORING.HP_WRONG
  if (fast)       return SCORING.HP_FAST
  return 0
}

function buildLeaderboard(players) {
  return [...players]
    .sort((a, b) => b.score - a.score || b.hp - a.hp)
    .map((p, i) => ({
      rank:       i + 1,
      playerId:   p.playerId.toString(),
      name:       p.name,
      score:      p.score,
      hp:         Math.max(0, p.hp),
      streak:     p.streak,
      eliminated: p.eliminated ?? false,
    }))
}

async function startGame(io, roomCode) {
  const room = await Room.findOne({ code: roomCode })
  if (!room || room.status !== 'waiting') return

  const { categories, difficulty, questionCount, timePerQuestion } = room.settings

  const filter = {}
  if (room.questionBank) filter.bank = room.questionBank
  if (categories && categories.length > 0) filter.category = { $in: categories }
  if (difficulty && difficulty !== 'Mixed' && difficulty !== 'mixed') {
    const cap = difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase()
    filter.difficulty = { $in: [cap, difficulty.toLowerCase()] }
  }

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
  room.players.forEach((p) => { p.score = 0; p.hp = DEFAULTS.HP; p.streak = 0; p.eliminated = false })
  await room.save()

  activeGames.set(roomCode, {
    questions:         pool,
    timePerQuestion:   Number(timePerQuestion) || 10,
    questionStartTime: null,
  })

  io.to(roomCode).emit('game:starting', { totalQuestions: pool.length })

  setTimeout(() => {
    broadcastQuestion(io, roomCode, pool, 0).catch((err) =>
      console.error('[BrainWars/gameLogic] broadcastQuestion failed:', err))
  }, GAME_START_DELAY_MS)
}

async function broadcastQuestion(io, roomCode, questions, index) {
  const gameConfig      = activeGames.get(roomCode)
  const question        = questions[index]
  // Use per-question timeLimit as override of room default (Section 9)
  const timePerQuestion = question.timeLimit ?? gameConfig?.timePerQuestion ?? DEFAULTS.TIME_PER_QUESTION
  const startTime       = Date.now()

  if (gameConfig) gameConfig.questionStartTime = startTime

  questionAnswers.set(roomCode, new Map())

  await Room.findOneAndUpdate({ code: roomCode }, { currentQuestionIndex: index })

  const basePayload = {
    questionId:     question._id,
    text:           question.text,
    type:           question.type,
    category:       question.category,
    difficulty:     question.difficulty,
    points:         question.points,
    timeLimit:      timePerQuestion,
    startTime,
    questionNumber: index + 1,
    totalQuestions: questions.length,
  }

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

async function recordAnswer(io, roomCode, _qs, _idx, socketId, answer, playerId) {
  const answers = questionAnswers.get(roomCode)
  if (!answers || answers.has(socketId)) return

  // Reject answers from eliminated players
  const room = await Room.findOne({ code: roomCode })
  if (!room) return

  const playerSlot = room.players.find((p) => p.playerId.toString() === playerId)
  if (playerSlot?.eliminated) {
    io.to(socketId).emit('game:error', { message: 'You have been eliminated and cannot submit answers.' })
    return
  }

  const gameConfig  = activeGames.get(roomCode)
  const startTime   = gameConfig?.questionStartTime ?? Date.now()
  const timeElapsed = (Date.now() - startTime) / 1000

  answers.set(socketId, { answer, timeElapsed })
  io.to(socketId).emit('game:answer-ack')

  // Only count non-eliminated active players toward "all answered" early-end check
  const activePlayers = room.players.filter((p) => !p.eliminated)
  if (answers.size >= activePlayers.length) {
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
  const question        = questions[index]
  const timePerQuestion = question.timeLimit ?? gameConfig?.timePerQuestion ?? DEFAULTS.TIME_PER_QUESTION
  const answers         = questionAnswers.get(roomCode) || new Map()
  questionAnswers.delete(roomCode)

  const room = await Room.findOne({ code: roomCode })
  if (!room) return

  const results = room.players.map((player) => {
    // Eliminated players don't participate — no HP change, no score
    if (player.eliminated) {
      return {
        playerId:    player.playerId.toString(),
        name:        player.name,
        answer:      null,
        isCorrect:   false,
        points:      0,
        hpChange:    0,
        streak:      player.streak,
        timeElapsed: null,
        eliminated:  true,
      }
    }

    const entry      = answers.get(player.socketId)
    const answered   = Boolean(entry)
    const isCorrect  = answered && entry.answer === question.correctAnswer
    const elapsed    = answered ? entry.timeElapsed : timePerQuestion
    const fast       = isCorrect && elapsed < timePerQuestion / 3

    const points   = isCorrect ? calcPoints(question.points, elapsed, timePerQuestion) : 0
    const hpChange = answered  ? calcHpChange(isCorrect, fast) : SCORING.HP_NO_ANSWER

    player.score     = Math.max(0, player.score + points)
    player.hp        = Math.max(0, Math.min(100, player.hp + hpChange))
    player.streak    = isCorrect ? player.streak + 1 : 0
    player.maxStreak = Math.max(player.maxStreak ?? 0, player.streak)

    // Eliminate player if HP hits 0
    if (player.hp === 0) {
      player.eliminated = true
    }

    if (answered) recordResponseTime(elapsed)

    return {
      playerId:    player.playerId.toString(),
      name:        player.name,
      answer:      entry?.answer ?? null,
      isCorrect,
      points,
      hpChange,
      streak:      player.streak,
      timeElapsed: Math.round(elapsed * 10) / 10,
      eliminated:  player.eliminated,
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
    setTimeout(() => {
      broadcastQuestion(io, roomCode, questions, nextIndex).catch((err) =>
        console.error('[BrainWars/gameLogic] broadcastQuestion failed:', err))
    }, REVEAL_DELAY_MS)
  } else {
    setTimeout(() => {
      endGame(io, roomCode, room).catch((err) =>
        console.error('[BrainWars/gameLogic] endGame failed for room', roomCode, ':', err))
    }, REVEAL_DELAY_MS)
  }
}

async function endGame(io, roomCode, room) {
  room.status     = 'finished'
  room.finishedAt = new Date()
  await room.save()
  activeGames.delete(roomCode)

  const leaderboard = buildLeaderboard(room.players)
  const total       = room.players.length

  await Promise.all(room.players.map(async (rp) => {
    try {
    const entry = leaderboard.find((l) => l.playerId === rp.playerId.toString())
    if (!entry) return

    const before = await Player.findByIdAndUpdate(
      rp.playerId,
      {
        $inc: { 'stats.gamesPlayed': 1, 'stats.totalScore': rp.score },
        $max: { 'stats.bestStreak': rp.maxStreak ?? rp.streak },
      },
      { new: false, select: 'trophies lastDailyBonusDate' },
    )

    if (!before) return

    const delta    = calcTrophyDelta(entry.rank, total)
    const oldCount = before.trophies ?? 0

    // Daily bonus: first finished game of each calendar day (server local date)
    const todayStr  = new Date().toDateString()
    const lastBonus = before.lastDailyBonusDate
    const isBonusDay = !lastBonus || new Date(lastBonus).toDateString() !== todayStr
    const dailyBonus = isBonusDay ? DAILY_BONUS_AMOUNT : 0

    const newCount = Math.max(0, oldCount + delta + dailyBonus)
    const oldTier  = getTier(oldCount)
    const newTier  = getTier(newCount)

    const dbUpdate = { trophies: newCount }
    if (isBonusDay) dbUpdate.lastDailyBonusDate = new Date()
    await Player.findByIdAndUpdate(rp.playerId, dbUpdate)

    entry.trophyDelta = delta
    entry.trophies    = newCount

    if (dailyBonus > 0) {
      entry.dailyBonusAwarded = true
      entry.dailyBonusAmount  = dailyBonus
    }

    if (newTier.min > oldTier.min) {
      entry.promoted = true
      entry.newTier  = newTier.label
    }

    // Near-miss: within threshold of next tier, not promoted this game
    if (!entry.promoted) {
      const nextTier = getNextTier(newCount)
      if (nextTier) {
        const gap = nextTier.min - newCount
        if (gap <= NEAR_MISS_THRESHOLD) {
          entry.nearMiss           = true
          entry.trophiesToNextTier = gap
          entry.nextTierName       = nextTier.label
        }
      }
    }
    } catch (err) {
      console.error('[BrainWars/gameLogic] Trophy update failed for player', rp.playerId, ':', err)
    }
  }))

  io.to(roomCode).emit('game:over', { finalLeaderboard: leaderboard })
}

module.exports = { startGame, recordAnswer, endQuestion, activeGames, getAvgResponseTime }
