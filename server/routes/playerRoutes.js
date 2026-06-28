const express = require('express')
const mongoose = require('mongoose')
const authenticate = require('../middleware/authenticate')
const Player = require('../models/Player')
const Room = require('../models/Room')
const { LEADERBOARD_LIMIT, RECENT_MATCHES_LIMIT } = require('../config/env')

const router = express.Router()

router.get('/leaderboard', authenticate, async (req, res) => {
  try {
    const [players, totalPlayers] = await Promise.all([
      Player.find({})
        .sort({ 'stats.totalScore': -1 })
        .limit(LEADERBOARD_LIMIT)
        .select('name stats trophies customTitle'),
      Player.countDocuments(),
    ])

    res.json({
      totalPlayers,
      players: players.map((p, i) => ({
        rank:        i + 1,
        id:          p._id,
        name:        p.name,
        customTitle: p.customTitle ?? null,
        gamesPlayed: p.stats.gamesPlayed,
        totalScore:  p.stats.totalScore,
        trophies:    p.trophies ?? 0,
      })),
    })
  } catch {
    res.status(500).json({ message: 'Could not fetch leaderboard.' })
  }
})

router.get('/me/matches', authenticate, async (req, res) => {
  try {
    const pid = new mongoose.Types.ObjectId(req.playerId)
    const rooms = await Room.find({
      status: 'finished',
      'players.playerId': pid,
    })
      .sort({ updatedAt: -1 })
      .limit(RECENT_MATCHES_LIMIT)
      .select('code name players updatedAt')

    const matches = rooms.map((room) => {
      const me = room.players.find((p) => p.playerId.toString() === req.playerId)
      const sorted = [...room.players].sort((a, b) => b.score - a.score || b.hp - a.hp)
      const rank = sorted.findIndex((p) => p.playerId.toString() === req.playerId) + 1
      return {
        code:  room.code,
        name:  room.name,
        score: me?.score ?? 0,
        rank,
        total: room.players.length,
        date:  room.updatedAt,
      }
    })

    res.json(matches)
  } catch {
    res.status(500).json({ message: 'Could not fetch match history.' })
  }
})

module.exports = router
