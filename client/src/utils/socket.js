import { io } from 'socket.io-client'

import { getToken } from './auth.js'

export function createGameSocket() {
  return io(import.meta.env.VITE_API_URL ?? 'http://localhost:5050', {
    auth: { token: getToken() },
    autoConnect: false,
  })
}
