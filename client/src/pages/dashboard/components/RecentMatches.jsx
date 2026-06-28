import { useEffect, useState } from 'react'
import { AlertCircle, BarChart3 } from 'lucide-react'
import { apiFetch } from '../../../api/client.js'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function RecentMatches() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    apiFetch('/api/players/me/matches')
      .then((r) => r.json())
      .then((data) => setMatches(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error('[BrainWars/RecentMatches] Failed to fetch match history:', err)
        setError('Could not load match history.')
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="animate-fade-in-up rounded-2xl border border-pink-500/15 bg-panel/85 p-6 delay-360">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-orbitron text-[0.95rem] tracking-[-0.03em] text-text">
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

      {loading ? (
        <div className="flex min-h-28 items-center justify-center">
          <p className="text-sm text-slate-500">Loading…</p>
        </div>
      ) : error ? (
        <div className="flex min-h-28 items-center justify-center gap-2">
          <AlertCircle size={15} className="shrink-0 text-danger" />
          <p className="text-sm text-danger">{error}</p>
        </div>
      ) : matches.length === 0 ? (
        <div className="flex min-h-28 items-center justify-center">
          <p className="text-sm text-slate-500">No matches yet — join a room to get started.</p>
        </div>
      ) : (
        <div className="divide-y divide-pink-500/8">
          {matches.map((m) => (
            <div key={m.code + m.date} className="grid grid-cols-4 gap-4 py-3 text-sm">
              <span className="font-data text-xs uppercase tracking-widest text-slate-300">{m.code}</span>
              <span className="text-text">{m.score.toLocaleString()}</span>
              <span className="text-slate-400">#{m.rank} / {m.total}</span>
              <span className="text-slate-500">{formatDate(m.date)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
