import { Medal, Trophy } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { rankColors } from '../../utils/rankStyles.js'

export default function LeaderboardPage() {
  const { player } = useAuth()

  return (
    <div>
      <div className="animate-fade-in-up mb-8">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-pink-400">Rankings</p>
        <h1 className="font-['Orbitron'] text-[clamp(1.8rem,4vw,2.8rem)] leading-none tracking-[-0.04em] text-[#EDEFF5]">
          Leaderboard
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Top players ranked by total score across all tournaments.
        </p>
      </div>

      {/* Your rank */}
      <div className="animate-fade-in-up mb-6 flex items-center gap-4 rounded-2xl border border-pink-500/20 bg-pink-500/8 p-5" style={{ animationDelay: '80ms' }}>
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-pink-500/20 text-pink-400">
          <Medal size={20} aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">Your rank</p>
          <p className="font-['JetBrains_Mono'] text-xl text-[#EDEFF5]">—</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs uppercase tracking-widest text-slate-400">Total score</p>
          <p className="font-['JetBrains_Mono'] text-xl text-[#EDEFF5]">0</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-slate-400">Player</p>
          <p className="text-sm text-[#EDEFF5]">{player?.name ?? '—'}</p>
        </div>
      </div>

      {/* Table */}
      <div className="animate-fade-in-up rounded-2xl border border-pink-500/15 bg-[#141B2E]/85 overflow-hidden" style={{ animationDelay: '150ms' }}>
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 border-b border-pink-500/10 px-5 py-3">
          <span className="text-[0.7rem] font-bold uppercase tracking-widest text-slate-500">#</span>
          <span className="text-[0.7rem] font-bold uppercase tracking-widest text-slate-500">Player</span>
          <span className="text-[0.7rem] font-bold uppercase tracking-widest text-slate-500">W / L</span>
          <span className="text-[0.7rem] font-bold uppercase tracking-widest text-slate-500">Score</span>
        </div>

        <div className="flex min-h-52 items-center justify-center">
          <div className="text-center">
            <Trophy size={28} className="mx-auto mb-3 text-slate-600" aria-hidden="true" />
            <p className="text-sm text-slate-500">No players ranked yet.</p>
            <p className="mt-1 text-xs text-slate-600">Play a game to claim your spot.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
