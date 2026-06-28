import { useEffect, useState } from 'react'
import { AlertCircle, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../../../api/client.js'
import LeagueBadge from '../../../components/LeagueBadge.jsx'

export default function MiniLeaderboard() {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    apiFetch('/api/players/leaderboard')
      .then((r) => r.json())
      .then((data) => setPlayers(data.players?.slice(0, 5) ?? []))
      .catch((err) => {
        console.error('[BrainWars/MiniLeaderboard] Failed to fetch leaderboard:', err)
        setError('Could not load top players.')
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="animate-fade-in-up rounded-2xl border border-pink-500/15 bg-panel/85 p-5 delay-420">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-amber-400">
          <Trophy size={15} aria-hidden="true" />
          <h2 className="font-orbitron text-[0.9rem] tracking-[-0.03em] text-text">
            Top players
          </h2>
        </div>
        <Link
          to="/dashboard/leaderboard"
          className="text-[0.7rem] uppercase tracking-widest text-slate-500 transition hover:text-pink-400"
        >
          See all
        </Link>
      </div>

      {loading ? (
        <div className="flex min-h-24 items-center justify-center rounded-xl border border-pink-500/8 bg-void/40">
          <p className="text-xs text-slate-500">Loading…</p>
        </div>
      ) : error ? (
        <div className="flex min-h-24 items-center justify-center gap-2 rounded-xl border border-danger/20 bg-danger/5">
          <AlertCircle size={14} className="shrink-0 text-danger" />
          <p className="text-xs text-danger">{error}</p>
        </div>
      ) : players.length === 0 ? (
        <div className="flex min-h-24 items-center justify-center rounded-xl border border-pink-500/8 bg-void/40">
          <p className="text-xs text-slate-500">No data yet — play a game to appear here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {players.map((p) => (
            <div key={p.rank} className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-white/4">
              <span className={`w-5 text-center font-data text-xs ${p.rank === 1 ? 'text-amber-400' : p.rank === 2 ? 'text-slate-300' : p.rank === 3 ? 'text-amber-700' : 'text-slate-500'}`}>
                {p.rank}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-text">{p.name}</span>
              <LeagueBadge trophies={p.trophies ?? 0} size="sm" />
              <span className="font-data text-xs text-slate-400">{p.totalScore.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
