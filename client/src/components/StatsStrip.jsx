import { useEffect, useState } from 'react'

const INITIAL = [
  { value: '—', label: 'Players live'    },
  { value: '—', label: 'Matches played'  },
  { value: '—', label: 'Avg response'    },
  { value: '—', label: 'Top streak'      },
]

export default function StatsStrip() {
  const [stats, setStats] = useState(INITIAL)

  useEffect(() => {
    const controller = new AbortController()

    fetch('/api/stats', { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        setStats([
          {
            value: data.playersLive != null ? String(data.playersLive) : '—',
            label: 'Players live',
          },
          {
            value: data.matchesPlayed != null ? data.matchesPlayed.toLocaleString() : '—',
            label: 'Matches played',
          },
          {
            value: data.avgResponse ?? '—',
            label: 'Avg response',
          },
          {
            value: data.topStreak != null ? String(data.topStreak) : '—',
            label: 'Top streak',
          },
        ])
      })
      .catch((err) => {
        if (err?.name !== 'AbortError') {
          console.error('[BrainWars/StatsStrip] Failed to fetch live stats:', err)
        }
        // Keep initial placeholder values — not a crash-worthy error
      })

    return () => controller.abort()
  }, [])

  return (
    <div className="animate-fade-in-up my-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-pink-500/15 bg-pink-500/8 sm:grid-cols-4">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="grid gap-1 bg-void px-5 py-7 text-center"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <span className="font-orbitron text-[clamp(1.5rem,4vw,2rem)] leading-none tracking-[-0.04em] text-text">
            {stat.value}
          </span>
          <span className="text-sm text-slate-400">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}
