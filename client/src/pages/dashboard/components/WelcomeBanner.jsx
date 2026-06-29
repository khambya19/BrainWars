import { Gift } from 'lucide-react'
import { useAuth } from '../../../context/AuthContext.jsx'
import clientEnv from '../../../config/env.js'
import LeagueBadge from '../../../components/LeagueBadge.jsx'
import TierProgressBar from '../../../components/TierProgressBar.jsx'

// This component renders the dashboard welcome banner.

function isBonusClaimedToday(lastDailyBonusDate) {
  if (!lastDailyBonusDate) return false
  return new Date(lastDailyBonusDate).toDateString() === new Date().toDateString()
}

export default function WelcomeBanner() {
  const { player } = useAuth()

  const trophies    = player?.trophies ?? 0
  const bonusClaimed = isBonusClaimedToday(player?.lastDailyBonusDate)

  return (
    <div className="animate-fade-in-up mb-6">
      <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-pink-400">
        Dashboard
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="font-orbitron text-[clamp(1.8rem,4vw,2.8rem)] leading-none tracking-[-0.04em] text-text">
            Welcome back, {player?.name ?? 'Player'}.
          </h1>
          {player?.customTitle && (
            <p className="mt-0.5 text-sm text-muted">{player.customTitle}</p>
          )}
        </div>
        <LeagueBadge trophies={trophies} showCount size="md" />
      </div>

      {/* Daily bonus indicator */}
      {!bonusClaimed ? (
        <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-amber-400/25 bg-amber-400/8 px-4 py-2.5">
          <Gift size={15} className="shrink-0 text-amber-400" aria-hidden="true" />
          <p className="text-sm text-amber-400">
            Play a match today for a{' '}
            <span className="font-data font-bold">+{clientEnv.DAILY_BONUS_AMOUNT} trophy</span> daily bonus!
          </p>
        </div>
      ) : (
        <p className="mt-2 text-sm text-slate-400">
          Daily bonus claimed ✓ — Create a room, share your code, and battle live.
        </p>
      )}

      {/* Tier progress bar */}
      <div className="mt-4 rounded-2xl border border-pink-500/15 bg-panel/85 px-5 py-4">
        <TierProgressBar trophies={trophies} />
      </div>
    </div>
  )
}
