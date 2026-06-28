const crypto = require('crypto')
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Player = require('../models/Player')
const authenticate = require('../middleware/authenticate')
const { isValidEmail } = require('../utils/validators')
const { buildPlayerPayload } = require('../utils/playerUtils')
const { getTier } = require('../utils/trophyCalculator')
const { sendPasswordResetEmail } = require('../utils/emailService')
const env = require('../config/env')

const router = express.Router()

function getRefreshSecret() {
  return env.JWT_REFRESH_SECRET || env.JWT_SECRET + '_refresh'
}

function createAccessToken(player) {
  return jwt.sign({ playerId: player._id }, env.JWT_SECRET, { expiresIn: env.ACCESS_TOKEN_EXPIRY })
}

function createRefreshToken(player) {
  return jwt.sign({ playerId: player._id }, getRefreshSecret(), { expiresIn: env.REFRESH_TOKEN_EXPIRY })
}

const REFRESH_COOKIE = 'bw_refresh'
const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: 'lax',
  secure:   env.NODE_ENV === 'production',
  maxAge:   env.REFRESH_COOKIE_MAX_AGE_MS,
}

function setRefreshCookie(res, player) {
  res.cookie(REFRESH_COOKIE, createRefreshToken(player), COOKIE_OPTS)
}



function validateSignupBody({ name, email, password }) {
  if (!name || !email || !password) {
    return 'Name, email, and password are required.'
  }
  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 60) {
    return 'Name must be between 2 and 60 characters.'
  }
  if (!isValidEmail(email)) {
    return 'Enter a valid email address.'
  }
  if (typeof password !== 'string' || password.length < 8) {
    return 'Password must be at least 8 characters.'
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter.'
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number.'
  }
  return null
}

router.post('/signup', async (request, response) => {
  try {
    const { name, email, password } = request.body

    const validationError = validateSignupBody({ name, email, password })
    if (validationError) {
      return response.status(400).json({ message: validationError })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const existingPlayer = await Player.findOne({ email: normalizedEmail })

    if (existingPlayer) {
      return response.status(409).json({ message: 'An account with that email already exists.' })
    }

    const hashedPassword = await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS)

    const player = await Player.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    })

    const token = createAccessToken(player)
    setRefreshCookie(response, player)

    return response.status(201).json({ token, player: buildPlayerPayload(player) })
  } catch (error) {
    if (error.code === 11000) {
      return response.status(409).json({ message: 'An account with that email already exists.' })
    }
    return response.status(500).json({ message: 'Unable to create account right now.' })
  }
})

router.post('/login', async (request, response) => {
  try {
    const { email, password } = request.body

    if (!email || !password) {
      return response.status(400).json({ message: 'Email and password are required.' })
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      return response.status(400).json({ message: 'Invalid input.' })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const player = await Player.findOne({ email: normalizedEmail }).select('+password')

    if (!player) {
      return response.status(401).json({ message: 'Invalid email or password.' })
    }

    const passwordMatches = await bcrypt.compare(password, player.password)

    if (!passwordMatches) {
      return response.status(401).json({ message: 'Invalid email or password.' })
    }

    setRefreshCookie(response, player)
    return response.json({ token: createAccessToken(player), player: buildPlayerPayload(player) })
  } catch (error) {
    return response.status(500).json({ message: 'Unable to log in right now.' })
  }
})

router.post('/forgot-password', async (request, response) => {
  try {
    const { email } = request.body

    if (!email || typeof email !== 'string') {
      return response.status(400).json({ message: 'Email is required.' })
    }
    if (!isValidEmail(email)) {
      return response.status(400).json({ message: 'Enter a valid email address.' })
    }

    const player = await Player.findOne({ email: email.trim().toLowerCase() })

    // Always return success to avoid email enumeration
    if (player) {
      const rawToken  = crypto.randomBytes(32).toString('hex')
      const hashed    = crypto.createHash('sha256').update(rawToken).digest('hex')
      const expiresAt = new Date(Date.now() + env.RESET_TOKEN_EXPIRY_MS)

      await Player.findByIdAndUpdate(player._id, {
        resetToken:       hashed,
        resetTokenExpiry: expiresAt,
      })

      const appUrl   = env.APP_URL
      const resetUrl = `${appUrl}/reset-password/${rawToken}`

      try {
        await sendPasswordResetEmail(player.email, resetUrl)
      } catch (emailErr) {
        console.error('[BrainWars/forgot-password] Failed to send reset email:', emailErr)
        // Don't expose the error to the client — link was still generated
      }
    }

    return response.json({ message: 'If an account with that email exists, a reset link has been sent.' })
  } catch (error) {
    console.error('[BrainWars/forgot-password] Unexpected error:', error)
    return response.status(500).json({ message: 'Unable to process request right now.' })
  }
})

// POST /api/auth/reset-password/:token
router.post('/reset-password/:token', async (request, response) => {
  try {
    const { token } = request.params
    const { password } = request.body

    if (!token || !password) {
      return response.status(400).json({ message: 'Token and new password are required.' })
    }
    if (typeof password !== 'string' || password.length < 8) {
      return response.status(400).json({ message: 'Password must be at least 8 characters.' })
    }
    if (!/[A-Z]/.test(password)) {
      return response.status(400).json({ message: 'Password must contain at least one uppercase letter.' })
    }
    if (!/[0-9]/.test(password)) {
      return response.status(400).json({ message: 'Password must contain at least one number.' })
    }

    const hashed = crypto.createHash('sha256').update(token).digest('hex')

    const player = await Player.findOne({
      resetToken:       hashed,
      resetTokenExpiry: { $gt: new Date() },
    }).select('+password +resetToken +resetTokenExpiry')

    if (!player) {
      return response.status(400).json({ message: 'Reset link is invalid or has expired.' })
    }

    player.password         = await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS)
    player.resetToken       = undefined
    player.resetTokenExpiry = undefined
    await player.save()

    return response.json({ message: 'Password reset successfully. You can now log in.' })
  } catch (error) {
    console.error('[BrainWars/reset-password] Unexpected error:', error)
    return response.status(500).json({ message: 'Unable to reset password right now.' })
  }
})

router.get('/me', authenticate, async (request, response) => {
  try {
    const player = await Player.findById(request.playerId)

    if (!player) {
      return response.status(404).json({ message: 'Player not found.' })
    }

    const trophies = player.trophies ?? 0
    return response.json({
      id:                 player._id,
      name:               player.name,
      email:              player.email,
      stats:              player.stats,
      trophies,
      league:             getTier(trophies).label,
      lastDailyBonusDate: player.lastDailyBonusDate ?? null,
      customTitle:        player.customTitle ?? null,
    })
  } catch (error) {
    return response.status(500).json({ message: 'Unable to fetch player.' })
  }
})

// PATCH /api/auth/title — set or clear custom title
router.patch('/title', authenticate, async (request, response) => {
  try {
    const raw = request.body?.customTitle
    // Treat missing, null, or whitespace-only as "clear the title"
    const trimmed = typeof raw === 'string' ? raw.trim() : ''
    const value   = trimmed.length === 0 ? null : trimmed

    if (value !== null && value.length > 24) {
      return response.status(400).json({ message: 'Title must be 24 characters or fewer.' })
    }

    const player = await Player.findByIdAndUpdate(
      request.playerId,
      { customTitle: value },
      { new: true, select: 'customTitle' },
    )
    if (!player) return response.status(404).json({ message: 'Player not found.' })

    return response.json({ customTitle: player.customTitle ?? null })
  } catch (error) {
    console.error('[BrainWars/authRoutes] Failed to update custom title:', error)
    return response.status(500).json({ message: 'Unable to update title.' })
  }
})

// POST /api/auth/refresh — exchange refresh cookie for new access token
router.post('/refresh', async (request, response) => {
  try {
    const token = request.cookies?.[REFRESH_COOKIE]
    if (!token) {
      return response.status(401).json({ message: 'No refresh token.' })
    }

    let decoded
    try {
      decoded = jwt.verify(token, getRefreshSecret())
    } catch {
      return response.status(401).json({ message: 'Refresh token invalid or expired.' })
    }

    const player = await Player.findById(decoded.playerId).select('_id name email trophies')
    if (!player) {
      return response.status(401).json({ message: 'Player not found.' })
    }

    // Issue new access token and rotate the refresh cookie
    setRefreshCookie(response, player)
    return response.json({ token: createAccessToken(player) })
  } catch (error) {
    console.error('[BrainWars/refresh] Unexpected error:', error)
    return response.status(500).json({ message: 'Unable to refresh session.' })
  }
})

// PATCH /api/auth/name — update display name
router.patch('/name', authenticate, async (request, response) => {
  try {
    const { name } = request.body
    if (!name || typeof name !== 'string') {
      return response.status(400).json({ message: 'Name is required.' })
    }
    const trimmed = name.trim()
    if (trimmed.length < 2 || trimmed.length > 60) {
      return response.status(400).json({ message: 'Name must be between 2 and 60 characters.' })
    }

    const player = await Player.findByIdAndUpdate(
      request.playerId,
      { name: trimmed },
      { new: true, select: 'name email stats trophies' },
    )
    if (!player) return response.status(404).json({ message: 'Player not found.' })

    const trophies = player.trophies ?? 0
    return response.json({
      id:       player._id,
      name:     player.name,
      email:    player.email,
      stats:    player.stats,
      trophies,
      league:   getTier(trophies).label,
    })
  } catch (error) {
    return response.status(500).json({ message: 'Unable to update name.' })
  }
})

// POST /api/auth/change-password
router.post('/change-password', authenticate, async (request, response) => {
  try {
    const { currentPassword, newPassword } = request.body
    if (!currentPassword || !newPassword) {
      return response.status(400).json({ message: 'Current and new password are required.' })
    }

    // Same strength rules as signup
    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return response.status(400).json({ message: 'New password must be at least 8 characters.' })
    }
    if (!/[A-Z]/.test(newPassword)) {
      return response.status(400).json({ message: 'New password must contain at least one uppercase letter.' })
    }
    if (!/[0-9]/.test(newPassword)) {
      return response.status(400).json({ message: 'New password must contain at least one number.' })
    }

    const player = await Player.findById(request.playerId).select('+password')
    if (!player) return response.status(404).json({ message: 'Player not found.' })

    const matches = await bcrypt.compare(currentPassword, player.password)
    if (!matches) {
      return response.status(401).json({ message: 'Current password is incorrect.' })
    }

    player.password = await bcrypt.hash(newPassword, env.BCRYPT_SALT_ROUNDS)
    await player.save()

    return response.json({ message: 'Password updated successfully.' })
  } catch (error) {
    return response.status(500).json({ message: 'Unable to change password.' })
  }
})

// DELETE /api/auth/me — delete account (requires password confirmation)
router.delete('/me', authenticate, async (request, response) => {
  try {
    const { password } = request.body
    if (!password) {
      return response.status(400).json({ message: 'Password confirmation is required.' })
    }

    const player = await Player.findById(request.playerId).select('+password')
    if (!player) return response.status(404).json({ message: 'Player not found.' })

    const matches = await bcrypt.compare(password, player.password)
    if (!matches) {
      return response.status(401).json({ message: 'Incorrect password.' })
    }

    const mongoose = require('mongoose')
    const Room = require('../models/Room')
    const pid  = new mongoose.Types.ObjectId(request.playerId)

    // Anonymize player slot in finished rooms so match history stays intact
    await Room.updateMany(
      { status: 'finished', 'players.playerId': pid },
      { $set: { 'players.$[slot].name': 'Deleted Player' } },
      { arrayFilters: [{ 'slot.playerId': pid }] },
    )

    // Remove player from waiting rooms they were in (not as host)
    await Room.updateMany(
      { status: 'waiting', host: { $ne: pid }, 'players.playerId': pid },
      { $pull: { players: { playerId: pid } } },
    )

    // Delete waiting rooms they hosted
    await Room.deleteMany({ status: 'waiting', host: pid })

    // Delete the player
    await Player.findByIdAndDelete(request.playerId)

    return response.json({ message: 'Account deleted.' })
  } catch (error) {
    return response.status(500).json({ message: 'Unable to delete account.' })
  }
})

module.exports = router
