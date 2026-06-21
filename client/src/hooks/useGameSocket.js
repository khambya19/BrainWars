import { useCallback, useEffect, useReducer, useRef } from 'react'

import { createGameSocket } from '../utils/socket.js'

const INITIAL = {
  state:            'idle',
  room:             null,
  isHost:           false,
  question:         null,
  myAnswer:         null,
  result:           null,
  leaderboard:      [],
  finalLeaderboard: [],
  error:            null,
}

function reducer(s, action) {
  switch (action.type) {
    case 'JOINED':       return { ...s, state: 'lobby', room: action.room, isHost: action.isHost, error: null }
    case 'ROOM_UPDATED': return { ...s, room: action.room }
    case 'GAME_STARTING':return { ...s, state: 'starting' }
    case 'QUESTION':     return { ...s, state: 'question', question: action.question, myAnswer: null, result: null }
    case 'SET_ANSWER':   return { ...s, myAnswer: action.answer }
    case 'RESULT':       return { ...s, state: 'reveal', result: action.result, leaderboard: action.leaderboard }
    case 'GAME_OVER':    return { ...s, state: 'finished', finalLeaderboard: action.leaderboard }
    case 'LEFT':         return { ...INITIAL }
    case 'ERROR':        return { ...s, error: action.message }
    default:             return s
  }
}

export function useGameSocket() {
  const [game, dispatch] = useReducer(reducer, INITIAL)
  const socketRef        = useRef(null)
  const questionRef      = useRef(null)

  useEffect(() => {
    const socket = createGameSocket()
    socketRef.current = socket
    socket.connect()

    socket.on('room:joined',   ({ room, isHost }) => dispatch({ type: 'JOINED', room, isHost: isHost ?? false }))
    socket.on('room:updated',  ({ room }) => dispatch({ type: 'ROOM_UPDATED', room }))
    socket.on('game:starting', () => dispatch({ type: 'GAME_STARTING' }))
    socket.on('game:question', (q) => { questionRef.current = q; dispatch({ type: 'QUESTION', question: q }) })
    socket.on('game:answer-ack', () => {})
    socket.on('game:question-result', ({ correctAnswer, results, leaderboard }) =>
      dispatch({ type: 'RESULT', result: { correctAnswer, results }, leaderboard }))
    socket.on('game:over',     ({ finalLeaderboard }) => dispatch({ type: 'GAME_OVER', leaderboard: finalLeaderboard }))
    socket.on('game:error',    ({ message }) => dispatch({ type: 'ERROR', message }))
    socket.on('connect_error', (err) => dispatch({ type: 'ERROR', message: err.message ?? 'Connection failed.' }))

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
