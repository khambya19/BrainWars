const jwt = require('jsonwebtoken')
const Player = require('../models/Player')
const { createRoom, joinRoom, removePlayer, getRoom } = require('./roomManager')
const { startGame, recordAnswer, activeGames } = require('./gameLogic')
const env        = require('../config/env')
const {
  SOCKET_CREATE_ROOM_COOLDOWN_MS: ROOM_CREATE_COOLDOWN_MS,
  SOCKET_JOIN_ROOM_COOLDOWN_MS:   ROOM_JOIN_COOLDOWN_MS,
} = require('../config/gameConfig')

// In-memory per-socket rate limiters
const createRoomThrottle = new Map() // socketId → last create timestamp
const joinRoomThrottle   = new Map() // socketId → last join timestamp

const socketRooms = new Map() // socketId → roomCode

function socketHandler(io) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token
      if (!token) throw new Error('No token')

      const decoded = jwt.verify(token, env.JWT_SECRET)
      const player  = await Player.findById(decoded.playerId).select('name')
      if (!player) throw new Error('Player not found')

      socket.playerId   = decoded.playerId.toString()
      socket.playerName = player.name
      next()
    } catch (err) {
      next(new Error('Authentication failed.'))
    }
  })

  io.on('connection', (socket) => {

    socket.on('room:create', async (settings, callback) => {
      // Rate limit: one create per 5 seconds per socket
      const lastCreate = createRoomThrottle.get(socket.id) ?? 0
      if (Date.now() - lastCreate < ROOM_CREATE_COOLDOWN_MS) {
        return callback({ ok: false, message: 'Please wait before creating another room.' })
      }
      createRoomThrottle.set(socket.id, Date.now())

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
      // Rate limit: 1 join per 2 seconds per socket (prevents join-spam)
      const lastJoin = joinRoomThrottle.get(socket.id) ?? 0
      if (Date.now() - lastJoin < ROOM_JOIN_COOLDOWN_MS) {
        return callback({ ok: false, message: 'Please wait before joining another room.' })
      }
      joinRoomThrottle.set(socket.id, Date.now())

      try {
        const { room, reconnected } = await joinRoom(code, socket.playerId, socket.playerName, socket.id)
        socket.join(room.code)
        socketRooms.set(socket.id, room.code)

        const roomData = sanitizeRoom(room)

        if (reconnected && room.status === 'playing') {
          // Reconnect path: restore game state for this socket
          const game = activeGames.get(room.code)
          callback({ ok: true, room: roomData, reconnected: true })
          socket.emit('room:joined', { room: roomData, isHost: room.host.toString() === socket.playerId })
          if (game) {
            const currentQ = game.questions[room.currentQuestionIndex]
            socket.emit('game:resync', {
              question: currentQ ? {
                questionId:     currentQ._id,
                text:           currentQ.text,
                type:           currentQ.type,
                category:       currentQ.category,
                difficulty:     currentQ.difficulty,
                points:         currentQ.points,
                timeLimit:      currentQ.timeLimit ?? game.timePerQuestion,
                startTime:      game.questionStartTime,
                questionNumber: room.currentQuestionIndex + 1,
                totalQuestions: game.questions.length,
                options:        currentQ.options,
              } : null,
              leaderboard: room.players.map((p, i) => ({
                rank:       i + 1,
                playerId:   p.playerId.toString(),
                name:       p.name,
                score:      p.score,
                hp:         p.hp,
                streak:     p.streak,
                eliminated: p.eliminated ?? false,
              })),
            })
          }
        } else if (reconnected && room.status === 'finished') {
          // Game ended while they were offline — send final result
          callback({ ok: true, room: roomData, reconnected: true })
          const leaderboard = [...room.players]
            .sort((a, b) => b.score - a.score || b.hp - a.hp)
            .map((p, i) => ({
              rank: i + 1, playerId: p.playerId.toString(), name: p.name,
              score: p.score, hp: p.hp, streak: p.streak, eliminated: p.eliminated ?? false,
            }))
          socket.emit('room:joined', { room: roomData, isHost: false })
          socket.emit('game:over', { finalLeaderboard: leaderboard })
        } else {
          // Normal join
          callback({ ok: true, room: roomData })
          // room:player-joined is reserved for future per-event UI (e.g. toast notifications).
          // The client currently uses room:updated for all lobby state.
          socket.to(room.code).emit('room:player-joined', {
            player: { name: socket.playerName, playerId: socket.playerId },
          })
          io.to(room.code).emit('room:updated', { room: roomData })
        }
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

      getRoom(roomCode).then((roomDoc) => {
        if (!roomDoc || roomDoc.status !== 'playing') return

        const currentQ = roomDoc.questions[roomDoc.currentQuestionIndex]
        if (!currentQ || currentQ.toString() !== questionId.toString()) return

        // Pass playerId so recordAnswer can check eliminated status
        recordAnswer(io, roomCode, null, roomDoc.currentQuestionIndex, socket.id, answer, socket.playerId)
      }).catch((err) => {
        console.error('[BrainWars/socketHandler] Error processing game:answer:', err)
      })
    })

    socket.on('room:leave', async () => {
      await handleDisconnect(socket, io, true)
    })

    socket.on('disconnect', async () => {
      await handleDisconnect(socket, io, false)
    })
  })
}

// intentionalLeave = true means player explicitly left; false = dropped connection
async function handleDisconnect(socket, io, intentionalLeave) {
  const roomCode = socketRooms.get(socket.id)
  createRoomThrottle.delete(socket.id)
  joinRoomThrottle.delete(socket.id)
  if (!roomCode) return
  socketRooms.delete(socket.id)

  try {
    const room = await getRoom(roomCode)
    if (!room) return

    if (room.status === 'playing' && !intentionalLeave) {
      // Mid-game disconnect: keep player in room but clear socketId so they can reconnect
      const slot = room.players.find((p) => p.socketId === socket.id)
      if (slot) {
        slot.socketId = ''
        await room.save()
      }
      // room:player-disconnected is reserved for future per-event UI (e.g. toast "Ankit disconnected").
      // The client currently uses room:updated for all lobby state.
      socket.to(roomCode).emit('room:player-disconnected', {
        playerId: socket.playerId,
        name:     socket.playerName,
      })
      return
    }

    // Lobby disconnect or intentional leave: remove player
    const updatedRoom = await removePlayer(roomCode, socket.id)
    if (!updatedRoom) return

    // room:player-left is reserved for future per-event UI. Client uses room:updated for lobby state.
    socket.to(roomCode).emit('room:player-left', { playerId: socket.playerId, name: socket.playerName })
    if (updatedRoom.players.length > 0) {
      io.to(roomCode).emit('room:updated', { room: sanitizeRoom(updatedRoom) })
    }
  } catch (err) {
    console.error('[BrainWars/socketHandler] Error in handleDisconnect:', err)
  }
}

function sanitizeRoom(room) {
  return {
    code:     room.code,
    host:     room.host.toString(),
    status:   room.status,
    settings: room.settings,
    players:  room.players.map((p) => ({
      playerId:   p.playerId.toString(),
      name:       p.name,
      score:      p.score,
      hp:         p.hp,
      streak:     p.streak,
      eliminated: p.eliminated ?? false,
    })),
  }
}

module.exports = socketHandler
