const jwt = require('jsonwebtoken')
const Player = require('../models/Player')
const { createRoom, joinRoom, removePlayer, getRoom } = require('./roomManager')
const { startGame, recordAnswer, activeGames } = require('./gameLogic')

const socketRooms = new Map()

function socketHandler(io) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token
      if (!token) throw new Error('No token')

      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const player  = await Player.findById(decoded.playerId).select('name')
      if (!player) throw new Error('Player not found')

      socket.playerId   = decoded.playerId.toString()
      socket.playerName = player.name
      next()
    } catch {
      next(new Error('Authentication failed.'))
    }
  })

  io.on('connection', (socket) => {

    socket.on('room:create', async (settings, callback) => {
      try {
        const room = await createRoom(socket.playerId, socket.playerName, socket.id, settings)
        socket.join(room.code)
        socketRooms.set(socket.id, room.code)

        callback({ ok: true, code: room.code, room: sanitizeRoom(room) })
        socket.emit('room:joined', { room: sanitizeRoom(room), isHost: true })
      } catch (err) {
        callback({ ok: false, message: err.message })
      }
    })

    socket.on('room:join', async ({ code }, callback) => {
      try {
        const room = await joinRoom(code, socket.playerId, socket.playerName, socket.id)
        socket.join(room.code)
        socketRooms.set(socket.id, room.code)

        const roomData = sanitizeRoom(room)
        callback({ ok: true, room: roomData })
        socket.to(room.code).emit('room:player-joined', { player: { name: socket.playerName, playerId: socket.playerId } })
        io.to(room.code).emit('room:updated', { room: roomData })
      } catch (err) {
        callback({ ok: false, message: err.message })
      }
    })

    socket.on('game:start', async (_, callback) => {
      try {
        const roomCode = socketRooms.get(socket.id)
        if (!roomCode) throw new Error('Not in a room.')

        const room = await getRoom(roomCode)
        if (!room) throw new Error('Room not found.')
        if (room.host.toString() !== socket.playerId) throw new Error('Only the host can start the game.')
        if (room.players.length < 1) throw new Error('Need at least 1 player.')

        callback({ ok: true })
        await startGame(io, roomCode)
      } catch (err) {
        callback({ ok: false, message: err.message })
      }
    })

    socket.on('game:answer', ({ questionId, answer }) => {
      const roomCode = socketRooms.get(socket.id)
      if (!roomCode) return

      const room = io.sockets.adapter.rooms.get(roomCode)
      if (!room) return

      getRoom(roomCode).then((roomDoc) => {
        if (!roomDoc || roomDoc.status !== 'playing') return
        const currentQ = roomDoc.questions[roomDoc.currentQuestionIndex]
        if (!currentQ || currentQ.toString() !== questionId.toString()) return

        recordAnswer(io, roomCode, null, roomDoc.currentQuestionIndex, socket.id, answer)
      })
    })

    socket.on('room:leave', async () => {
      await handleDisconnect(socket, io)
    })

    socket.on('disconnect', async () => {
      await handleDisconnect(socket, io)
    })
  })
}

async function handleDisconnect(socket, io) {
  const roomCode = socketRooms.get(socket.id)
  if (!roomCode) return
  socketRooms.delete(socket.id)

  const room = await removePlayer(roomCode, socket.id)
  if (!room) return

  socket.to(roomCode).emit('room:player-left', { playerId: socket.playerId, name: socket.playerName })
  if (room.players.length > 0) {
    io.to(roomCode).emit('room:updated', { room: sanitizeRoom(room) })
  }
}

function sanitizeRoom(room) {
  return {
    code:     room.code,
    host:     room.host.toString(),
    status:   room.status,
    settings: room.settings,
    players:  room.players.map((p) => ({
      playerId: p.playerId.toString(),
      name:     p.name,
      score:    p.score,
      hp:       p.hp,
      streak:   p.streak,
    })),
  }
}

module.exports = socketHandler
