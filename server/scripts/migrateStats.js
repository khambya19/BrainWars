require('dotenv').config()

const mongoose = require('mongoose')
const Player   = require('../models/Player')
const Room     = require('../models/Room')
const { calcTrophyDelta } = require('../utils/trophyCalculator')

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to MongoDB')

  const rooms = await Room.find({ status: 'finished' }).sort({ createdAt: 1 })
  console.log(`Found ${rooms.length} finished rooms`)

  // Accumulate per-player stats from ALL finished rooms in chronological order
  const playerMap = new Map()

  for (const room of rooms) {
    const sorted = [...room.players].sort((a, b) => b.score - a.score || b.hp - a.hp)
    const total  = room.players.length

    for (const slot of room.players) {
      const pid = slot.playerId.toString()
      if (!playerMap.has(pid)) {
        playerMap.set(pid, { gamesPlayed: 0, totalScore: 0, bestStreak: 0, trophies: 0 })
      }
      const acc  = playerMap.get(pid)
      const rank = sorted.findIndex((p) => p.playerId.toString() === pid) + 1

      acc.gamesPlayed += 1
      acc.totalScore  += slot.score
      acc.bestStreak   = Math.max(acc.bestStreak, slot.maxStreak ?? slot.streak)
      acc.trophies     = Math.max(0, acc.trophies + calcTrophyDelta(rank, total))
    }
  }

  let updated = 0

  for (const [pid, acc] of playerMap.entries()) {
    await Player.findByIdAndUpdate(pid, {
      $set: {
        'stats.gamesPlayed': acc.gamesPlayed,
        'stats.totalScore':  acc.totalScore,
        'stats.bestStreak':  acc.bestStreak,
        trophies:            acc.trophies,
      },
    })
    console.log(`  Player ${pid}: ${acc.gamesPlayed} games, ${acc.totalScore} score, ${acc.trophies} trophies`)
    updated++
  }

  console.log(`\nDone — updated ${updated} player(s)`)
  await mongoose.disconnect()
}

migrate().catch((err) => { console.error(err); process.exit(1) })
