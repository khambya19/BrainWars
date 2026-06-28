/**
 * TIER DATA SYNC — this file must stay in sync with server/config/gameConfig.js.
 * TIER_DATA_VERSION encodes the sorted tier minimums and must match the server value.
 * If you change any tier threshold:
 *   1. Update TIERS below
 *   2. Update TROPHY_TIERS in server/config/gameConfig.js
 *   3. Update TIER_DATA_VERSION in BOTH files to a new value
 * The server validates at startup that its TIER_DATA_VERSION matches its TROPHY_TIERS —
 * it will refuse to start if they disagree, making drift visible immediately.
 */
export const TIER_DATA_VERSION = 'v1:0,400,800,1200,1600,2000'

export const TIERS = [
  {
    id:      'legend',
    label:   'Legend',
    min:     2000,
    icon:    'Crown',
    color:   'text-success',
    bg:      'bg-success/10',
    border:  'border-success/30',
    bar:     'bg-success',
    glow:    true,
    shimmer: true,
  },
  {
    id:      'champion',
    label:   'Champion',
    min:     1600,
    icon:    'Trophy',
    color:   'text-signal',
    bg:      'bg-signal/10',
    border:  'border-signal/30',
    bar:     'bg-signal',
    glow:    true,
    shimmer: false,
  },
  {
    id:      'elite',
    label:   'Elite',
    min:     1200,
    icon:    'Medal',
    color:   'text-elite',
    bg:      'bg-elite/10',
    border:  'border-elite/30',
    bar:     'bg-elite',
    glow:    false,
    shimmer: false,
  },
  {
    id:      'contender',
    label:   'Contender',
    min:     800,
    icon:    'Award',
    color:   'text-contender',
    bg:      'bg-contender/10',
    border:  'border-contender/25',
    bar:     'bg-contender',
    glow:    false,
    shimmer: false,
  },
  {
    id:      'challenger',
    label:   'Challenger',
    min:     400,
    icon:    'Shield',
    color:   'text-challenger',
    bg:      'bg-challenger/10',
    border:  'border-challenger/25',
    bar:     'bg-challenger',
    glow:    false,
    shimmer: false,
  },
  {
    id:      'rookie',
    label:   'Rookie',
    min:     0,
    icon:    'Shield',
    color:   'text-muted',
    bg:      'bg-muted/10',
    border:  'border-muted/25',
    bar:     'bg-muted',
    glow:    false,
    shimmer: false,
  },
]

export function getTier(trophies = 0) {
  return TIERS.find((t) => trophies >= t.min) ?? TIERS[TIERS.length - 1]
}

// Returns the immediately next tier above trophies, or null if already at max.
export function getNextTier(trophies = 0) {
  return [...TIERS].reverse().find((t) => t.min > trophies) ?? null
}
