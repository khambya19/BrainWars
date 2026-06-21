const express = require('express')
const authenticate = require('../middleware/authenticate')
const Room = require('../models/Room')

const router = express.Router()

router.get('/public', authenticate, async (req, res) => {
  try {
    const rooms = await Room.find({ isPublic: true, status: 'waiting' })
      .select('name code host players settings createdAt')
      .populate('host', 'name')
      .sort({ createdAt: -1 })
      .limit(20)

    res.json(rooms.map((r) => ({
      name:          r.name,
      code:          r.code,
      host:          r.host?.name ?? 'Unknown',
      playerCount:   r.players.length,
      settings:      r.settings,
      createdAt:     r.createdAt,
    })))
  } catch {
    res.status(500).json({ message: 'Could not fetch public rooms.' })
  }
})

module.exports = router
