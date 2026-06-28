const Room = require('../models/Room')
const { ROOM_CODE, DEFAULTS, MAX_PLAYERS } = require('../config/gameConfig')

function generateCode() {
  return Array.from(
    { length: ROOM_CODE.LENGTH },
    () => ROOM_CODE.CHARS[Math.floor(Math.random() * ROOM_CODE.CHARS.length)],
  ).join('')
}

async function getUniqueCode() {
  let code
  let attempts = 0
  do {
    code = generateCode()
    attempts++
    if (attempts > 20) throw new Error('Could not generate a unique room code.')
  } while (await Room.exists({ code }))
  return code
}

async function createRoom(hostId, hostName, hostSocketId, settings = {}) {
  const code = await getUniqueCode()

  const room = await Room.create({
    name:         settings.name         ?? 'Quiz Battle',
    code,
    host:         hostId,
    questionBank: settings.questionBank ?? null,
    isPublic:     settings.isPublic     ?? false,
    players: [
      {
        playerId:   hostId,
        name:       hostName,
        socketId:   hostSocketId,
        score:      0,
        hp:         DEFAULTS.HP,
        streak:     0,
        answered:   false,
        eliminated: false,
      },
    ],
    questions: [],
    status:    'waiting',
    settings:  {
      categories:      settings.categories      ?? [],
      difficulty:      settings.difficulty      ?? DEFAULTS.DIFFICULTY,
      questionCount:   settings.questionCount   ?? DEFAULTS.QUESTION_COUNT,
      timePerQuestion: settings.timePerQuestion ?? DEFAULTS.TIME_PER_QUESTION,
    },
  })

  return room
}

// Returns { room, reconnected: boolean }
async function joinRoom(code, playerId, playerName, socketId) {
  const room = await Room.findOne({ code: code.toUpperCase() })

  if (!room) throw new Error('Room not found.')

  const alreadyIn = room.players.find((p) => p.playerId.toString() === playerId.toString())

  if (alreadyIn) {
    // Reconnect: update socketId regardless of room status
    alreadyIn.socketId = socketId
    await room.save()
    return { room, reconnected: true }
  }

  // New player — only allowed in waiting rooms
  if (room.status !== 'waiting') throw new Error('Game has already started.')
  if (room.players.length >= MAX_PLAYERS) throw new Error('Room is full.')

  room.players.push({
    playerId,
    name:       playerName,
    socketId,
    score:      0,
    hp:         DEFAULTS.HP,
    streak:     0,
    answered:   false,
    eliminated: false,
  })
  await room.save()
  return { room, reconnected: false }
}

async function removePlayer(roomCode, socketId) {
  const room = await Room.findOne({ code: roomCode })
  if (!room) return null

  room.players = room.players.filter((p) => p.socketId !== socketId)
  await room.save()
  return room
}

async function getRoom(code) {
  return Room.findOne({ code: code.toUpperCase() })
}

module.exports = { createRoom, joinRoom, removePlayer, getRoom }
