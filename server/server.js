require('dotenv').config()

const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')

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

app.use('/api/auth', authLimiter, authRoutes)

app.get('/', (_req, res) => {
  res.json({ status: 'ok' })
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
  cors: { origin: process.env.ALLOWED_ORIGIN },
})

io.on('connection', (socket) => {
  socket.on('disconnect', () => {})
})

const PORT = process.env.PORT || 5001
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
