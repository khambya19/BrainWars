const Player = require('../models/Player')
const Room   = require('../models/Room')
const env    = require('../config/env')

let cache     = null
let cacheTime = 0

// getAvgResponseTime is injected from gameLogic to avoid circular require
let _getAvgResponseTime = () => null

function setAvgResponseTimeFn(fn) {
  _getAvgResponseTime = fn
}

async function computeStats(io) {
  // playersLive: count sockets connected to active game rooms
  let playersLive = 0
  for (const [roomCode] of io.sockets.adapter.rooms) {
    if (/^[A-Z0-9]{4}$/.test(roomCode)) {
      const sockets = io.sockets.adapter.rooms.get(roomCode)
      if (sockets) playersLive += sockets.size
    }
  }

  // avgResponse: rolling average from in-game answer times
  const avg = _getAvgResponseTime()

  // topStreak: highest bestStreak across all players
  const topPlayer = await Player.findOne({})
    .sort({ 'stats.bestStreak': -1 })
    .select('stats.bestStreak')
    .lean()
  const topStreak = topPlayer?.stats?.bestStreak ?? 0

  // matchesPlayed: total finished rooms
  const matchesPlayed = await Room.countDocuments({ status: 'finished' })

  // leaderboard: top N by totalScore
  const topPlayers = await Player.find({})
    .sort({ 'stats.totalScore': -1 })
    .limit(env.STATS_LEADERBOARD_LIMIT)
    .select('name stats trophies')
    .lean()

  const leaderboard = topPlayers.map((p, i) => ({
    rank:       i + 1,
    name:       p.name,
    totalScore: p.stats?.totalScore ?? 0,
    trophies:   p.trophies ?? 0,
  }))

  // liveRoom: first public room currently playing
  const liveRoom = await Room.findOne({ status: 'playing', isPublic: true })
    .select('code name players')
    .lean()

  return {
    playersLive,
    avgResponse: avg !== null ? `${avg}s` : '—',
    topStreak,
    matchesPlayed,
    leaderboard,
    liveRoom: liveRoom
      ? { code: liveRoom.code, name: liveRoom.name, playerCount: liveRoom.players.length }
      : null,
  }
}

async function getStats(io) {
  const now = Date.now()
  if (cache && now - cacheTime < env.STATS_CACHE_TTL_MS) return cache

  try {
    cache     = await computeStats(io)
    cacheTime = now
  } catch (err) {
    console.error('[BrainWars/statsCache] Failed to compute stats:', err)
    if (!cache) {
      cache = { playersLive: 0, avgResponse: '—', topStreak: 0, matchesPlayed: 0, leaderboard: [], liveRoom: null }
    }
  }

  return cache
}

module.exports = { getStats, setAvgResponseTimeFn }
