import { Hash } from 'lucide-react'

// This component displays controls for joining a room.

export default function JoinRoomCard() {
  return (
    <div className="animate-fade-in-up rounded-2xl border border-pink-500/15 bg-panel/85 p-6 delay-200">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2 text-pink-400">
            <Hash size={16} aria-hidden="true" />
            <h2 className="font-orbitron text-[0.95rem] tracking-[-0.03em] text-text">
              Join a room
            </h2>
          </div>
          <p className="text-xs text-slate-400">Enter a 4-character room code to jump in.</p>
        </div>
        <span className="shrink-0 rounded-full border border-pink-500/25 bg-pink-500/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-pink-400">
          Soon
        </span>
      </div>

      <div className="flex gap-2">
        <input
          disabled
          placeholder="e.g. AB12"
          maxLength={4}
          className="min-h-11 flex-1 cursor-not-allowed rounded-xl border border-pink-500/12 bg-void/60 px-4 font-data text-sm uppercase tracking-widest text-slate-500 placeholder:text-slate-600 outline-none"
        />
        <button
          disabled
          className="min-h-11 cursor-not-allowed rounded-xl border border-pink-500/12 bg-pink-500/8 px-5 text-sm text-slate-500"
        >
          Join
        </button>
      </div>
    </div>
  )
}
