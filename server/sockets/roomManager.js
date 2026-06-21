const Room = require('../models/Room')
const { ROOM_CODE, DEFAULTS } = require('../config/gameConfig')

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
        playerId: hostId,
        name:     hostName,
        socketId: hostSocketId,
        score:    0,
        hp:       100,
        streak:   0,
        answered: false,
      },
    ],
    questions: [],
    status:    'waiting',
    settings:  {
      categories:      settings.categories      ?? [],
      difficulty:      settings.difficulty      ?? 'Mixed',
      questionCount:   settings.questionCount   ?? 10,
      timePerQuestion: settings.timePerQuestion ?? 10,
    },
  })

  return room
}

async function joinRoom(code, playerId, playerName, socketId) {
  const room = await Room.findOne({ code: code.toUpperCase() })

  if (!room)                           throw new Error('Room not found.')
  if (room.status !== 'waiting')       throw new Error('Game has already started.')
  if (room.players.length >= 50)       throw new Error('Room is full.')

  const alreadyIn = room.players.find((p) => p.playerId.toString() === playerId.toString())
  if (alreadyIn) {
    alreadyIn.socketId = socketId
    await room.save()
    return room
  }

  room.players.push({ playerId, name: playerName, socketId, score: 0, hp: 100, streak: 0, answered: false })
  await room.save()
  return room
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
