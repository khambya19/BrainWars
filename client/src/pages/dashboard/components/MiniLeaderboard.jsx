import { Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function MiniLeaderboard() {
  return (
    <div className="animate-fade-in-up rounded-2xl border border-pink-500/15 bg-[#141B2E]/85 p-5" style={{ animationDelay: '420ms' }}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-amber-400">
          <Trophy size={15} aria-hidden="true" />
          <h2 className="font-['Orbitron'] text-[0.9rem] tracking-[-0.03em] text-[#EDEFF5]">
            Top players
          </h2>
        </div>
        <Link
          to="/dashboard/leaderboard"
          className="text-[0.7rem] uppercase tracking-widest text-slate-500 transition hover:text-pink-400"
        >
          See all
        </Link>
      </div>

      <div className="flex min-h-24 items-center justify-center rounded-xl border border-pink-500/8 bg-[#0B0F1A]/40">
        <p className="text-xs text-slate-500">No data yet — play a game to appear here.</p>
      </div>
    </div>
  )
}
