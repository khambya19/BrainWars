const { getTier } = require('./trophyCalculator')

function buildPlayerPayload(player) {
  const trophies = player.trophies ?? 0
  return {
    id:                 player._id,
    name:               player.name,
    email:              player.email,
    stats: {
      gamesPlayed: player.stats?.gamesPlayed ?? 0,
      bestStreak:  player.stats?.bestStreak  ?? 0,
      totalScore:  player.stats?.totalScore  ?? 0,
    },
    trophies,
    league:             getTier(trophies).label, // reserved — no client component reads this; tier is derived client-side from trophies
    lastDailyBonusDate: player.lastDailyBonusDate ?? null,
    customTitle:        player.customTitle ?? null,
  }
}

module.exports = { buildPlayerPayload }
