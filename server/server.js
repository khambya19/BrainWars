// env.js must be required first — it loads dotenv and validates required vars.
const env = require('./config/env')

const express      = require('express')
const http         = require('http')
const cookieParser = require('cookie-parser')
const { Server }   = require('socket.io')
const cors         = require('cors')
const helmet       = require('helmet')
const rateLimit    = require('express-rate-limit')
const connectDB    = require('./config/db')
const gameConfig   = require('./config/gameConfig')
const authRoutes   = require('./routes/authRoutes')
const bankRoutes   = require('./routes/bankRoutes')
const roomRoutes   = require('./routes/roomRoutes')
const playerRoutes = require('./routes/playerRoutes')
const { getStats, setAvgResponseTimeFn } = require('./utils/statsCache')
const { getAvgResponseTime } = require('./sockets/gameLogic')

setAvgResponseTimeFn(getAvgResponseTime)

const app = express()

app.use(helmet())
app.use(cors({ origin: env.ALLOWED_ORIGIN, credentials: true }))
app.use(cookieParser())
app.use(express.json({ limit: '20kb' }))

const authLimiter = rateLimit({
  windowMs:       env.AUTH_RATE_LIMIT_WINDOW_MS,
  max:            env.AUTH_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders:   false,
  message: {
    message: `Too many attempts. Please try again in ${Math.round(env.AUTH_RATE_LIMIT_WINDOW_MS / 60_000)} minutes.`,
  },
})

app.use('/api/auth',    authLimiter, authRoutes)
app.use('/api/banks',   bankRoutes)
app.use('/api/rooms',   roomRoutes)
app.use('/api/players', playerRoutes)

app.get('/', (_req, res) => res.json({ status: 'ok' }))

app.get('/api/health', (_req, res) => {
  const mongoose = require('mongoose')
  const states   = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' }
  const dbState  = states[mongoose.connection.readyState] ?? 'unknown'
  const ok       = mongoose.connection.readyState === 1
  res.status(ok ? 200 : 503).json({ status: ok ? 'ok' : 'degraded', db: dbState })
})

app.get('/api/config', (_req, res) => {
  res.json({
    tierDataVersion:   gameConfig.TIER_DATA_VERSION,
    tiers:             gameConfig.TROPHY_TIERS,
    dailyBonusAmount:  gameConfig.DAILY_BONUS_AMOUNT,
    nearMissThreshold: gameConfig.NEAR_MISS_THRESHOLD,
  })
})

const server = http.createServer(app)
const io     = new Server(server, { cors: { origin: env.ALLOWED_ORIGIN, credentials: true } })

app.get('/api/stats', async (_req, res) => {
  try {
    const stats = await getStats(io)
    res.json(stats)
  } catch (err) {
    console.error('[BrainWars/server] Failed to serve /api/stats:', err)
    res.status(500).json({ message: 'Could not fetch stats.' })
  }
})

const socketHandler = require('./sockets/socketHandler')
socketHandler(io)

async function start() {
  await connectDB()
  server.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`)
  })
}

start()
