import { useEffect, useState } from 'react'
import { Heart, Shield, Users, Zap } from 'lucide-react'
import { useAuth } from '../../../context/AuthContext.jsx'
import { apiFetch } from '../../../api/client.js'
import StatCard from './StatCard.jsx'

export default function StatsGrid() {
  const { player } = useAuth()
  const [totalPlayers, setTotalPlayers] = useState('—')

  useEffect(() => {
    apiFetch('/api/players/leaderboard')
      .then((r) => r.json())
      .then((data) => setTotalPlayers(data.totalPlayers ?? '—'))
      .catch((err) => {
        console.error('[BrainWars/StatsGrid] Failed to fetch player count:', err)
      })
  }, [])

  const s    = player?.stats
  const games  = s?.gamesPlayed ?? 0
  const streak = s?.bestStreak ?? 0
  const score  = s?.totalScore ?? 0

  const stats = [
    { label: 'Games played',  value: String(games),              icon: Shield, color: 'text-pink-400',  delay: 100 },
    { label: 'Best streak',   value: String(streak),             icon: Zap,    color: 'text-amber-400', delay: 180 },
    { label: 'Total score',   value: score.toLocaleString(),     icon: Heart,  color: 'text-lime-400',  delay: 260 },
    { label: 'Total players', value: String(totalPlayers),       icon: Users,  color: 'text-sky-400',   delay: 340 },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  )
}
