import { useEffect } from 'react'
import { Heart, Mail, Shield, User, Zap } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import LeagueBadge from '../../components/LeagueBadge.jsx'
import TierProgressBar from '../../components/TierProgressBar.jsx'

// This page shows the player profile details.

function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-white/6 ${className}`} />
}

export default function ProfilePage() {
  const { player, loading, refreshPlayer } = useAuth()

  useEffect(() => { refreshPlayer() }, [refreshPlayer])

  const initials = player?.name
    ?.split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? 'P'

  const s        = player?.stats
  const games    = s?.gamesPlayed ?? 0
  const streak   = s?.bestStreak  ?? 0
  const score    = s?.totalScore  ?? 0
  const trophies = player?.trophies ?? 0

  if (loading && !player) {
    return (
      <div>
        <div className="animate-fade-in-up mb-8">
          <Skeleton className="mb-2 h-3 w-20" />
          <Skeleton className="h-9 w-40" />
        </div>
        <div className="mb-4 rounded-2xl border border-pink-500/15 bg-panel/85 p-6">
          <div className="flex items-start gap-5">
            <Skeleton className="h-16 w-16 shrink-0 rounded-2xl" />
            <div className="flex-1 space-y-2 pt-1">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="mt-2 h-6 w-24" />
            </div>
          </div>
        </div>
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="animate-fade-in-up mb-8">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-pink-400">Account</p>
        <h1 className="font-orbitron text-[clamp(1.8rem,4vw,2.8rem)] leading-none tracking-[-0.04em] text-text">
          Profile
        </h1>
      </div>

      {/* Avatar + league badge */}
      <div className="animate-fade-in-up mb-4 rounded-2xl border border-pink-500/15 bg-panel/85 p-6">
        <div className="flex items-start gap-5">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-pink-500/20 bg-pink-500/15 font-orbitron text-xl font-bold text-pink-400">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-orbitron text-[1.15rem] leading-none tracking-[-0.03em] text-text">
              {player?.name ?? '—'}
            </h2>
            {player?.customTitle && (
              <p className="mt-0.5 text-xs text-muted">{player.customTitle}</p>
            )}
            <p className="mt-1 text-sm text-slate-400">{player?.email ?? '—'}</p>
            <div className="mt-3">
              <LeagueBadge trophies={trophies} showCount size="md" />
            </div>
            <div className="mt-4">
              <TierProgressBar trophies={trophies} />
            </div>
          </div>
        </div>
      </div>

      {/* Info fields */}
      <div className="animate-fade-in-up mb-4 grid gap-3 sm:grid-cols-2 delay-80">
        <div className="rounded-2xl border border-pink-500/15 bg-panel/85 p-5">
          <div className="mb-2 flex items-center gap-2 text-slate-400">
            <User size={13} aria-hidden="true" />
            <span className="text-[0.65rem] font-bold uppercase tracking-widest">Display name</span>
          </div>
          <p className="text-sm text-text">{player?.name ?? '—'}</p>
        </div>
        <div className="rounded-2xl border border-pink-500/15 bg-panel/85 p-5">
          <div className="mb-2 flex items-center gap-2 text-slate-400">
            <Mail size={13} aria-hidden="true" />
            <span className="text-[0.65rem] font-bold uppercase tracking-widest">Email</span>
          </div>
          <p className="text-sm text-text">{player?.email ?? '—'}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="animate-fade-in-up grid gap-3 sm:grid-cols-3 delay-140">
        {[
          { label: 'Games played', value: games,                  icon: Shield, color: 'text-pink-400'  },
          { label: 'Best streak',  value: streak,                 icon: Zap,    color: 'text-amber-400' },
          { label: 'Total score',  value: score.toLocaleString(), icon: Heart,  color: 'text-lime-400'  },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-pink-500/15 bg-panel/85 p-5">
            <div className={`mb-2 ${color}`}><Icon size={16} aria-hidden="true" /></div>
            <p className="font-data text-2xl text-text">{value}</p>
            <p className="mt-1 text-xs text-slate-400">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
