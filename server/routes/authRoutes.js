const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Player = require('../models/Player')
const authenticate = require('../middleware/authenticate')

const router = express.Router()

function getJwtSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not set')
  return secret
}

function createToken(player) {
  return jwt.sign({ playerId: player._id }, getJwtSecret(), { expiresIn: '7d' })
}

function buildPlayerPayload(player) {
  return { id: player._id, name: player.name, email: player.email }
}


function validateSignupBody({ name, email, password }) {
  if (!name || !email || !password) {
    return 'Name, email, and password are required.'
  }
  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 60) {
    return 'Name must be between 2 and 60 characters.'
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
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

    const hashedPassword = await bcrypt.hash(password, 12)

    const player = await Player.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    })

    const token = createToken(player)

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

    return response.json({ token: createToken(player), player: buildPlayerPayload(player) })
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return response.status(400).json({ message: 'Enter a valid email address.' })
    }

    await Player.findOne({ email: email.trim().toLowerCase() })

    return response.json({ message: 'If an account with that email exists, a reset link has been sent.' })
  } catch (error) {
    return response.status(500).json({ message: 'Unable to process request right now.' })
  }
})

router.get('/me', authenticate, async (request, response) => {
  try {
    const player = await Player.findById(request.playerId)

    if (!player) {
      return response.status(404).json({ message: 'Player not found.' })
    }

    return response.json({ id: player._id, name: player.name, email: player.email })
  } catch (error) {
    return response.status(500).json({ message: 'Unable to fetch player.' })
  }
})

module.exports = router
