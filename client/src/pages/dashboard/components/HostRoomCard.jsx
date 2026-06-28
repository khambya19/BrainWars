import { Plus, Settings } from 'lucide-react'

const options = [
  { label: 'Categories', value: 'All' },
  { label: 'Difficulty', value: 'Mixed' },
  { label: 'Time limit', value: '30 s' },
  { label: 'Max players', value: '50' },
]

export default function HostRoomCard() {
  return (
    <div className="animate-fade-in-up rounded-2xl border border-pink-500/15 bg-panel/85 p-6 delay-280">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2 text-pink-400">
            <Settings size={16} aria-hidden="true" />
            <h2 className="font-orbitron text-[0.95rem] tracking-[-0.03em] text-text">
              Host a tournament
            </h2>
          </div>
          <p className="text-xs text-slate-400">Create a room and share the code with players.</p>
        </div>
        <span className="shrink-0 rounded-full border border-pink-500/25 bg-pink-500/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-pink-400">
          Soon
        </span>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2">
        {options.map((opt) => (
          <div key={opt.label} className="rounded-xl border border-pink-500/10 bg-void/50 px-3 py-2.5">
            <p className="text-[0.65rem] uppercase tracking-widest text-slate-500">{opt.label}</p>
            <p className="mt-0.5 text-sm text-slate-400">{opt.value}</p>
          </div>
        ))}
      </div>

      <button
        disabled
        className="inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-pink-500/12 bg-pink-500/8 text-sm text-slate-500"
      >
        <Plus size={16} aria-hidden="true" />
        Create room
      </button>
    </div>
  )
}
