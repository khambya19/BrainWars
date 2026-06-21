import { Heart, Mail, Trophy, User, Zap } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

const profileStats = [
  { label: 'Games played', value: '0',  icon: Trophy, color: 'text-pink-400'  },
  { label: 'Win rate',     value: '0%', icon: Zap,    color: 'text-amber-400' },
  { label: 'Best streak',  value: '0',  icon: Heart,  color: 'text-lime-400'  },
]

export default function ProfilePage() {
  const { player } = useAuth()

  const initials = player?.name
    ?.split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? 'P'

  return (
    <div>
      <div className="animate-fade-in-up mb-8">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-pink-400">Account</p>
        <h1 className="font-['Orbitron'] text-[clamp(1.8rem,4vw,2.8rem)] leading-none tracking-[-0.04em] text-[#EDEFF5]">
          Profile
        </h1>
      </div>

      {/* Avatar card */}
      <div className="animate-fade-in-up mb-4 flex items-center gap-5 rounded-2xl border border-pink-500/15 bg-[#141B2E]/85 p-6">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-pink-500/20 bg-pink-500/15 font-['Orbitron'] text-xl font-bold text-pink-400">
          {initials}
        </div>
        <div>
          <h2 className="font-['Orbitron'] text-[1.15rem] leading-none tracking-[-0.03em] text-[#EDEFF5]">
            {player?.name ?? '—'}
          </h2>
          <p className="mt-1 text-sm text-slate-400">{player?.email ?? '—'}</p>
        </div>
      </div>

      {/* Info fields */}
      <div className="animate-fade-in-up mb-4 grid gap-3 sm:grid-cols-2" style={{ animationDelay: '100ms' }}>
        <div className="rounded-2xl border border-pink-500/15 bg-[#141B2E]/85 p-5">
          <div className="mb-2 flex items-center gap-2 text-slate-400">
            <User size={13} aria-hidden="true" />
            <span className="text-[0.65rem] font-bold uppercase tracking-widest">Display name</span>
          </div>
          <p className="text-sm text-[#EDEFF5]">{player?.name ?? '—'}</p>
          <button
            disabled
            className="mt-3 cursor-not-allowed text-xs text-slate-600 underline underline-offset-4"
          >
            Change name — coming soon
          </button>
        </div>

        <div className="rounded-2xl border border-pink-500/15 bg-[#141B2E]/85 p-5">
          <div className="mb-2 flex items-center gap-2 text-slate-400">
            <Mail size={13} aria-hidden="true" />
            <span className="text-[0.65rem] font-bold uppercase tracking-widest">Email</span>
          </div>
          <p className="text-sm text-[#EDEFF5]">{player?.email ?? '—'}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="animate-fade-in-up grid gap-3 sm:grid-cols-3" style={{ animationDelay: '180ms' }}>
        {profileStats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-pink-500/15 bg-[#141B2E]/85 p-5">
            <div className={`mb-2 ${color}`}>
              <Icon size={16} aria-hidden="true" />
            </div>
            <p className="font-['JetBrains_Mono'] text-2xl text-[#EDEFF5]">{value}</p>
            <p className="mt-1 text-xs text-slate-400">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
