import { Hash, Zap } from 'lucide-react'

export default function QuickJoin() {
  return (
    <div className="animate-fade-in-up rounded-2xl border border-pink-500/15 bg-[#141B2E]/85 p-5" style={{ animationDelay: '350ms' }}>
      <div className="mb-1 flex items-center gap-2 text-pink-400">
        <Zap size={15} aria-hidden="true" />
        <h2 className="font-['Orbitron'] text-[0.9rem] tracking-[-0.03em] text-[#EDEFF5]">
          Quick join
        </h2>
      </div>
      <p className="mb-4 text-xs text-slate-400">Enter a 4-character room code to jump in instantly.</p>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Hash size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" />
          <input
            disabled
            placeholder="AB12"
            maxLength={4}
            className="min-h-10 w-full cursor-not-allowed rounded-xl border border-pink-500/12 bg-[#0B0F1A]/60 pl-8 pr-3 font-['JetBrains_Mono'] text-sm uppercase tracking-widest text-slate-500 placeholder:text-slate-600 outline-none"
          />
        </div>
        <button
          disabled
          className="min-h-10 cursor-not-allowed rounded-xl border border-pink-500/12 bg-pink-500/8 px-4 text-sm text-slate-500"
        >
          Join
        </button>
      </div>
      <p className="mt-2 text-[0.65rem] uppercase tracking-widest text-slate-600">Live rooms coming soon</p>
    </div>
  )
}
