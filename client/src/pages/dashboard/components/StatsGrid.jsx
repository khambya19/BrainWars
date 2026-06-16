import { Heart, Trophy, Users, Zap } from 'lucide-react'

import StatCard from './StatCard.jsx'

const stats = [
  { label: 'Games played', value: '0',  icon: Trophy, color: 'text-pink-400',  delay: 100 },
  { label: 'Win rate',     value: '0%', icon: Zap,    color: 'text-amber-400', delay: 180 },
  { label: 'Best streak',  value: '0',  icon: Heart,  color: 'text-lime-400',  delay: 260 },
  { label: 'Total players',value: '—',  icon: Users,  color: 'text-sky-400',   delay: 340 },
]

export default function StatsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  )
}
