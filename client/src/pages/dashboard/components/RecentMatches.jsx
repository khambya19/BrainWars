import { BarChart3 } from 'lucide-react'

export default function RecentMatches() {
  return (
    <div className="animate-fade-in-up rounded-2xl border border-pink-500/15 bg-[#141B2E]/85 p-6" style={{ animationDelay: '360ms' }}>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-['Orbitron'] text-[0.95rem] tracking-[-0.03em] text-[#EDEFF5]">
          Recent matches
        </h2>
        <BarChart3 size={16} className="text-slate-500" aria-hidden="true" />
      </div>

      <div className="hidden grid-cols-4 gap-4 border-b border-pink-500/10 pb-3 text-[0.7rem] font-bold uppercase tracking-widest text-slate-500 sm:grid">
        <span>Room</span>
        <span>Score</span>
        <span>Rank</span>
        <span>Date</span>
      </div>

      <div className="flex min-h-28 items-center justify-center">
        <p className="text-sm text-slate-500">No matches yet — join a room to get started.</p>
      </div>
    </div>
  )
}
