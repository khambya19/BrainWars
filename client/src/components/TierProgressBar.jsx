import { Award, Crown, Medal, Shield, Trophy } from 'lucide-react'
import { getTier, getNextTier } from '../utils/leagues.js'

// This component visualizes progress across tiers.

const ICONS = { Crown, Trophy, Medal, Award, Shield }

export default function TierProgressBar({ trophies = 0 }) {
  const currentTier = getTier(trophies)
  const nextTier    = getNextTier(trophies)
  const Icon        = ICONS[currentTier.icon] ?? Shield

  if (!nextTier) {
    // Already at Legend — max tier
    return (
      <div>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <span className={`flex items-center gap-1.5 font-data text-xs font-medium ${currentTier.color}`}>
            <Icon size={12} aria-hidden="true" />
            {currentTier.label}
          </span>
          <span className="font-data text-xs text-slate-400">
            {trophies.toLocaleString()} · Max League Reached
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
          <div className={`h-full w-full rounded-full ${currentTier.bar} animate-shimmer`} />
        </div>
      </div>
    )
  }

  const pct = Math.min(
    100,
    Math.max(0, ((trophies - currentTier.min) / (nextTier.min - currentTier.min)) * 100),
  )

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <span className={`flex items-center gap-1.5 font-data text-xs font-medium ${currentTier.color}`}>
          <Icon size={12} aria-hidden="true" />
          {currentTier.label}
        </span>
        <span className="font-data text-xs text-slate-400">
          {trophies.toLocaleString()} / {nextTier.min.toLocaleString()} to {nextTier.label}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
        <div
          className={`h-full rounded-full transition-all duration-700 ${currentTier.bar}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
