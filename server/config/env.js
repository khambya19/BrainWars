/**
 * Central environment configuration for BrainWars server.
 * Loads .env once, validates required variables at startup, and exports
 * a typed config object. Every other server module imports from here —
 * nothing should read process.env directly.
 */
require('dotenv').config({ quiet: true })

const REQUIRED = ['MONGO_URI', 'JWT_SECRET']
const missing  = REQUIRED.filter((k) => !process.env[k])

if (missing.length > 0) {
  console.error('\n[BrainWars] FATAL — Missing required environment variables:')
  missing.forEach((k) => console.error(`  ${k}`))
  console.error('\n  Copy server/.env.example to server/.env and fill in the required values.\n')
  process.exit(1)
}

const cfg = {
  // Runtime
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT:     Number(process.env.PORT) || 5050,

  // Database
  MONGO_URI: process.env.MONGO_URI,

  // CORS
  ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',

  // JWT
  JWT_SECRET:            process.env.JWT_SECRET,
  JWT_REFRESH_SECRET:    process.env.JWT_REFRESH_SECRET || null,  // null → falls back to JWT_SECRET + '_refresh'
  ACCESS_TOKEN_EXPIRY:   process.env.ACCESS_TOKEN_EXPIRY   || '15m',
  REFRESH_TOKEN_EXPIRY:  process.env.REFRESH_TOKEN_EXPIRY  || '7d',
  REFRESH_COOKIE_MAX_AGE_MS: Number(process.env.REFRESH_COOKIE_MAX_AGE_MS) || 7 * 24 * 60 * 60 * 1000,

  // Auth
  BCRYPT_SALT_ROUNDS:          Number(process.env.BCRYPT_SALT_ROUNDS)          || 12,
  AUTH_RATE_LIMIT_WINDOW_MS:   Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS)   || 15 * 60 * 1000,
  AUTH_RATE_LIMIT_MAX:         Number(process.env.AUTH_RATE_LIMIT_MAX)         || 20,
  RESET_TOKEN_EXPIRY_MS:       Number(process.env.RESET_TOKEN_EXPIRY_MS)       || 60 * 60 * 1000,

  // App
  APP_URL: process.env.APP_URL || 'http://localhost:5173',

  // Email (SMTP — all optional; falls back to console-log in dev)
  SMTP_HOST: process.env.SMTP_HOST || null,
  SMTP_PORT: Number(process.env.SMTP_PORT) || 587,
  SMTP_USER: process.env.SMTP_USER || null,
  SMTP_PASS: process.env.SMTP_PASS || null,
  SMTP_FROM: process.env.SMTP_FROM || 'BrainWars <noreply@brainwars.gg>',

  // Caching
  STATS_CACHE_TTL_MS: Number(process.env.STATS_CACHE_TTL_MS) || 30_000,

  // Pagination / query limits
  LEADERBOARD_LIMIT:       Number(process.env.LEADERBOARD_LIMIT)       || 10,
  RECENT_MATCHES_LIMIT:    Number(process.env.RECENT_MATCHES_LIMIT)    || 10,
  STATS_LEADERBOARD_LIMIT: Number(process.env.STATS_LEADERBOARD_LIMIT) || 5,
}

module.exports = cfg
