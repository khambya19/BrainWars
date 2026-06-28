import { useCallback, useEffect, useReducer, useRef } from 'react'

import { createGameSocket } from '../utils/socket.js'
import { getToken } from '../utils/auth.js'

const INITIAL = {
  state:            'idle',
  room:             null,
  roomCode:         null,   // retained for reconnection
  isHost:           false,
  question:         null,
  myAnswer:         null,
  result:           null,
  leaderboard:      [],
  finalLeaderboard: [],
  error:            null,
  reconnecting:     false,
}

function reducer(s, action) {
  switch (action.type) {
    case 'JOINED':
      return {
        ...s,
        state:        'lobby',
        room:         action.room,
        roomCode:     action.room?.code ?? s.roomCode,
        isHost:       action.isHost,
        error:        null,
        reconnecting: false,
      }
    case 'ROOM_UPDATED':
      return { ...s, room: action.room }
    case 'GAME_STARTING': {
      // Seed the leaderboard with all current players at their starting state
      // so the live leaderboard sidebar is populated from question 1 onward.
      const seed = (s.room?.players ?? []).map((p, i) => ({
        rank:       i + 1,
        playerId:   p.playerId,
        name:       p.name,
        score:      0,
        hp:         p.hp ?? 100,
        streak:     0,
        eliminated: false,
      }))
      return { ...s, state: 'starting', leaderboard: seed.length ? seed : s.leaderboard }
    }
    case 'QUESTION':
      return { ...s, state: 'question', question: action.question, myAnswer: null, result: null }
    case 'SET_ANSWER':
      return { ...s, myAnswer: action.answer }
    case 'RESULT':
      return { ...s, state: 'reveal', result: action.result, leaderboard: action.leaderboard }
    case 'GAME_OVER':
      return { ...s, state: 'finished', finalLeaderboard: action.leaderboard, reconnecting: false }
    case 'LEFT':
      return { ...INITIAL }
    case 'ERROR':
      return { ...s, error: action.message }
    case 'RECONNECTING':
      return { ...s, reconnecting: true, error: null }
    case 'RESYNC':
      return {
        ...s,
        state:        action.question ? 'question' : s.state,
        question:     action.question ?? s.question,
        leaderboard:  action.leaderboard ?? s.leaderboard,
        myAnswer:     null,
        reconnecting: false,
        error:        null,
      }
    default:
      return s
  }
}

export function useGameSocket() {
  const [game, dispatch] = useReducer(reducer, INITIAL)
  const socketRef        = useRef(null)
  const questionRef      = useRef(null)
  const gameRef          = useRef(game)
  gameRef.current        = game

  useEffect(() => {
    const socket = createGameSocket()
    socketRef.current = socket
    socket.connect()

    socket.on('room:joined',   ({ room, isHost }) =>
      dispatch({ type: 'JOINED', room, isHost: isHost ?? false }))

    socket.on('room:updated',  ({ room }) => dispatch({ type: 'ROOM_UPDATED', room }))
    socket.on('game:starting', () => dispatch({ type: 'GAME_STARTING' }))

    socket.on('game:question', (q) => {
      questionRef.current = q
      dispatch({ type: 'QUESTION', question: q })
    })

    socket.on('game:answer-ack', () => {})

    socket.on('game:question-result', ({ correctAnswer, results, leaderboard }) =>
      dispatch({ type: 'RESULT', result: { correctAnswer, results }, leaderboard }))

    socket.on('game:over', ({ finalLeaderboard }) =>
      dispatch({ type: 'GAME_OVER', leaderboard: finalLeaderboard }))

    socket.on('game:error', ({ message }) => dispatch({ type: 'ERROR', message }))

    socket.on('game:resync', ({ question, leaderboard }) => {
      if (question) questionRef.current = question
      dispatch({ type: 'RESYNC', question, leaderboard })
    })

    socket.on('connect_error', (err) =>
      dispatch({ type: 'ERROR', message: err.message ?? 'Connection failed.' }))

    // Refresh socket auth token before every reconnect attempt so a
    // refreshed 15-min access token is always used, not the stale one
    // captured at hook mount time.
    socket.on('reconnect_attempt', () => {
      socket.auth = { token: getToken() }
    })

    // Auto-rejoin on reconnect if we were in a room
    socket.on('connect', () => {
      const current = gameRef.current
      if (current.roomCode && current.state !== 'idle' && !current.reconnecting) {
        dispatch({ type: 'RECONNECTING' })
        socket.emit('room:join', { code: current.roomCode }, (res) => {
          if (!res.ok) {
            dispatch({ type: 'ERROR', message: res.message ?? 'Failed to rejoin room.' })
          }
        })
      }
    })

    socket.on('disconnect', (reason) => {
      // Only show reconnecting if it's not an intentional disconnect
      if (reason !== 'io client disconnect') {
        const current = gameRef.current
        if (current.roomCode && current.state !== 'idle') {
          dispatch({ type: 'RECONNECTING' })
        }
      }
    })

    return () => { socket.disconnect(); socketRef.current = null }
  }, [])

  const createRoom = useCallback((settings) => {
    socketRef.current?.emit('room:create', settings, (res) => {
      if (!res.ok) dispatch({ type: 'ERROR', message: res.message })
    })
  }, [])

  const joinRoom = useCallback((code, onError) => {
    socketRef.current?.emit('room:join', { code }, (res) => {
      if (!res.ok) {
        dispatch({ type: 'ERROR', message: res.message })
        onError?.(res.message)
      } else {
        dispatch({ type: 'JOINED', room: res.room, isHost: false })
      }
    })
  }, [])

  const startGame = useCallback(() => {
    socketRef.current?.emit('game:start', {}, (res) => {
      if (!res.ok) dispatch({ type: 'ERROR', message: res.message })
    })
  }, [])

  const submitAnswer = useCallback((answer) => {
    const q = questionRef.current
    if (!q) return
    dispatch({ type: 'SET_ANSWER', answer })
    socketRef.current?.emit('game:answer', { questionId: q.questionId, answer })
  }, [])

  const leaveRoom = useCallback(() => {
    socketRef.current?.emit('room:leave')
    dispatch({ type: 'LEFT' })
  }, [])

  return { game, createRoom, joinRoom, startGame, submitAnswer, leaveRoom }
}
