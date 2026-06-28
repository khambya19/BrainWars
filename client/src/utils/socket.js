import { io } from 'socket.io-client'
import clientEnv from '../config/env.js'
import { getToken } from './auth.js'

export function createGameSocket() {
  return io(clientEnv.API_URL, {
    auth:        { token: getToken() },
    autoConnect: false,
  })
}
