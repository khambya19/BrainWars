import { Award, Crown, Medal, Shield, Trophy } from 'lucide-react'
import { getTier } from '../utils/leagues.js'

// This component displays a player league badge.

const ICONS = { Crown, Trophy, Medal, Award, Shield }

export default function LeagueBadge({ trophies = 0, showCount = false, size = 'sm' }) {
  const tier = getTier(trophies)
  const Icon = ICONS[tier.icon] ?? Shield

  const sizes = {
    sm:  { icon: 12, text: 'text-[0.6rem]',  px: 'px-2 py-0.5',  gap: 'gap-1'   },
    md:  { icon: 14, text: 'text-xs',         px: 'px-2.5 py-1',  gap: 'gap-1.5' },
    lg:  { icon: 18, text: 'text-sm',         px: 'px-3 py-1.5',  gap: 'gap-2'   },
  }
  const s = sizes[size] ?? sizes.sm

  return (
    <span
      className={`inline-flex items-center ${s.gap} ${s.px} rounded-full border font-data font-medium uppercase tracking-wider
        ${tier.color} ${tier.bg} ${tier.border}
        ${tier.glow ? 'shadow-[0_0_8px_currentColor] shadow-current/30' : ''}
        ${tier.shimmer ? 'animate-shimmer' : ''}
      `}
    >
      <Icon size={s.icon} aria-hidden="true" className={tier.shimmer ? 'animate-shimmer' : ''} />
      <span className={s.text}>{tier.label}</span>
      {showCount && (
        <span className={`${s.text} opacity-70`}>· {trophies}</span>
      )}
    </span>
  )
}
