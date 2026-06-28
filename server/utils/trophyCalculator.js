const {
  TROPHY_TIERS,
  TROPHY_DELTAS,
  DAILY_BONUS_AMOUNT,
  NEAR_MISS_THRESHOLD,
} = require('../config/gameConfig')

function getTier(trophies = 0) {
  return TROPHY_TIERS.find((t) => trophies >= t.min) ?? TROPHY_TIERS[TROPHY_TIERS.length - 1]
}

// Returns the immediately next tier above trophies, or null if already at max.
function getNextTier(trophies = 0) {
  return [...TROPHY_TIERS].reverse().find((t) => t.min > trophies) ?? null
}

function calcTrophyDelta(rank, totalParticipants) {
  if (totalParticipants <= 1) return 0
  const pct = rank / totalParticipants
  if (rank === 1)    return TROPHY_DELTAS.RANK_1
  if (pct <= 0.10)   return TROPHY_DELTAS.TOP_10_PCT
  if (pct <= 0.25)   return TROPHY_DELTAS.TOP_25_PCT
  if (pct <= 0.50)   return TROPHY_DELTAS.TOP_50_PCT
  if (pct <= 0.75)   return TROPHY_DELTAS.TOP_75_PCT
  return TROPHY_DELTAS.BOTTOM_25_PCT
}

module.exports = { getTier, getNextTier, calcTrophyDelta, DAILY_BONUS_AMOUNT, NEAR_MISS_THRESHOLD }
