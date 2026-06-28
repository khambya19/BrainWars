/**
 * Canonical game-balance and tuning constants for BrainWars server.
 * Import from here — do not hardcode these values in application logic.
 *
 * TIER DATA SYNC: TROPHY_TIERS and TIER_DATA_VERSION must be kept in sync with
 * client/src/utils/leagues.js (TIERS array and TIER_DATA_VERSION export).
 * If you change any tier threshold:
 *   1. Update TROPHY_TIERS below
 *   2. Update TIERS in client/src/utils/leagues.js
 *   3. Update TIER_DATA_VERSION in BOTH files to a new value
 *   The server validates at startup that TIER_DATA_VERSION encodes the actual
 *   tier minimums — it will refuse to start if they disagree.
 */

// Version string encoding sorted tier minimums.
// Server validates this matches TROPHY_TIERS at startup.
const TIER_DATA_VERSION = 'v1:0,400,800,1200,1600,2000'

const TROPHY_TIERS = [
  { id: 'legend',     label: 'Legend',     min: 2000 },
  { id: 'champion',   label: 'Champion',   min: 1600 },
  { id: 'elite',      label: 'Elite',      min: 1200 },
  { id: 'contender',  label: 'Contender',  min: 800  },
  { id: 'challenger', label: 'Challenger', min: 400  },
  { id: 'rookie',     label: 'Rookie',     min: 0    },
]

// Self-check: verify TIER_DATA_VERSION actually encodes TROPHY_TIERS minimums.
// This catches edits to TROPHY_TIERS that forget to update TIER_DATA_VERSION.
;(function validateTierVersion() {
  const computed = 'v1:' + TROPHY_TIERS.map((t) => t.min).sort((a, b) => a - b).join(',')
  if (computed !== TIER_DATA_VERSION) {
    console.error('[BrainWars] FATAL — TIER_DATA_VERSION is out of sync with TROPHY_TIERS.')
    console.error(`  TROPHY_TIERS encodes: "${computed}"`)
    console.error(`  TIER_DATA_VERSION is: "${TIER_DATA_VERSION}"`)
    console.error('  Update TIER_DATA_VERSION in server/config/gameConfig.js and client/src/utils/leagues.js.')
    process.exit(1)
  }
})()

module.exports = {
  TIER_DATA_VERSION,

  // Room codes
  ROOM_CODE: {
    LENGTH: 4,
    CHARS:  'ABCDEFGHJKLMNPQRSTUVWXYZ23456789',
  },

  // Room limits
  MAX_PLAYERS: 50,

  // Game defaults (used when host doesn't specify)
  DEFAULTS: {
    QUESTION_COUNT:    10,
    TIME_PER_QUESTION: 10,
    DIFFICULTY:        'Mixed',
    HP:                100,
  },

  // HP scoring constants
  SCORING: {
    HP_WRONG:        -20,
    HP_NO_ANSWER:    -15,
    HP_FAST:          +5,
    MIN_SPEED_RATIO:  0.5,
  },

  // League tiers (server source of truth — see sync note above)
  TROPHY_TIERS,

  // Trophy delta per game rank
  TROPHY_DELTAS: {
    RANK_1:        30,
    TOP_10_PCT:    25,
    TOP_25_PCT:    15,
    TOP_50_PCT:     5,
    TOP_75_PCT:     0,
    BOTTOM_25_PCT: -10,
  },

  // Retention gamification
  DAILY_BONUS_AMOUNT:  20,
  NEAR_MISS_THRESHOLD: 30,

  // Timing (milliseconds)
  GAME_START_DELAY_MS: 5000,
  REVEAL_DELAY_MS:     4000,

  // Socket event rate limits (per socket)
  SOCKET_CREATE_ROOM_COOLDOWN_MS: 5000,
  SOCKET_JOIN_ROOM_COOLDOWN_MS:   2000,

  // Stats
  MAX_RESPONSE_SAMPLES: 500,
}
