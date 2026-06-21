import { Heart } from 'lucide-react'

export default function HPBar({ hp = 100 }) {
  const pct    = Math.max(0, Math.min(100, hp))
  const color  = pct > 60 ? '#c6ff3d' : pct > 30 ? '#f59e0b' : '#FF5A4E'

  return (
    <div className="flex items-center gap-2">
      <Heart size={14} style={{ color }} aria-hidden="true" />
      <div className="h-2 w-24 overflow-hidden rounded-full bg-white/8">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="font-['JetBrains_Mono'] text-xs" style={{ color }}>{hp}</span>
    </div>
  )
}
