require('dotenv').config()

const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const bankRoutes = require('./routes/bankRoutes')
const roomRoutes = require('./routes/roomRoutes')

const app = express()

app.use(helmet())

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN,
  credentials: true,
}))

app.use(express.json({ limit: '20kb' }))

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Please try again in 15 minutes.' },
})

connectDB()

app.use('/api/auth',  authLimiter, authRoutes)
app.use('/api/banks', bankRoutes)
app.use('/api/rooms', roomRoutes)

app.get('/', (_req, res) => {
  res.json({ status: 'ok' })
})

app.get('/api/health', (_req, res) => {
  const mongoose = require('mongoose')
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' }
  const dbState = states[mongoose.connection.readyState] ?? 'unknown'
  const ok = mongoose.connection.readyState === 1
  res.status(ok ? 200 : 503).json({ status: ok ? 'ok' : 'degraded', db: dbState })
})

app.get('/api/stats', (_req, res) => {
  res.json({
    playersLive: 0,
    avgResponse: '–',
    topStreak: '–',
    leaderboard: [],
    liveRoom: null,
  })
})

const server = http.createServer(app)

const io = new Server(server, {
  cors: { origin: process.env.ALLOWED_ORIGIN, credentials: true },
})

const socketHandler = require('./sockets/socketHandler')
socketHandler(io)

const PORT = process.env.PORT || 5001
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
