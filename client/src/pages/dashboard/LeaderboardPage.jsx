import { useEffect, useState } from 'react'
import { Medal, Trophy } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { apiFetch } from '../../api/client.js'
import { rankColors } from '../../utils/rankStyles.js'
import LeagueBadge from '../../components/LeagueBadge.jsx'

export default function LeaderboardPage() {
  const { player } = useAuth()
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    apiFetch('/api/players/leaderboard')
      .then((r) => r.json())
      .then((data) => setPlayers(data.players ?? []))
      .catch((err) => {
        console.error('[BrainWars/LeaderboardPage] Failed to fetch leaderboard:', err)
        setError('Could not load leaderboard.')
      })
      .finally(() => setLoading(false))
  }, [])

  const myEntry = players.find((p) => p.id?.toString() === player?.id?.toString())

  return (
    <div>
      <div className="animate-fade-in-up mb-8">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-pink-400">Rankings</p>
        <h1 className="font-orbitron text-[clamp(1.8rem,4vw,2.8rem)] leading-none tracking-[-0.04em] text-text">
          Leaderboard
        </h1>
        <p className="mt-2 text-sm text-slate-400">Top players ranked by total score across all games.</p>
      </div>

      {/* Your rank banner — flex-wrap handles any width */}
      <div className="animate-fade-in-up mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-pink-500/20 bg-pink-500/8 p-5 delay-80">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-pink-500/20 text-pink-400">
          <Medal size={20} aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">Your rank</p>
          <p className="font-data text-xl text-text">{myEntry ? `#${myEntry.rank}` : '—'}</p>
        </div>
        <div>
          <p className="mb-1 text-xs uppercase tracking-widest text-slate-400">League</p>
          <LeagueBadge trophies={myEntry?.trophies ?? player?.trophies ?? 0} size="sm" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">Trophies</p>
          <div className="flex items-center gap-1.5 font-data text-xl">
            {(myEntry?.trophies ?? player?.trophies ?? 0) > 0
              ? <><Trophy size={18} className="text-amber-400" /><span className="text-amber-400">{myEntry?.trophies ?? player?.trophies}</span></>
              : <span className="text-slate-500">—</span>
            }
          </div>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs uppercase tracking-widest text-slate-400">Total score</p>
          <p className="font-data text-xl text-text">{(myEntry?.totalScore ?? 0).toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-slate-400">Player</p>
          <p className="text-sm text-text">{player?.name ?? '—'}</p>
          {player?.customTitle && (
            <p className="text-xs text-muted">{player.customTitle}</p>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="animate-fade-in-up overflow-hidden rounded-2xl border border-pink-500/15 bg-panel/85 delay-150">

        {/* Header — 4 cols mobile, 5 cols sm+ (League column added at sm) */}
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-3 border-b border-pink-500/10 px-4 py-3 sm:grid-cols-[auto_1fr_auto_auto_auto] sm:gap-4 sm:px-5">
          <span className="text-[0.7rem] font-bold uppercase tracking-widest text-slate-500">#</span>
          <span className="text-[0.7rem] font-bold uppercase tracking-widest text-slate-500">Player</span>
          <span className="hidden text-[0.7rem] font-bold uppercase tracking-widest text-slate-500 sm:block">League</span>
          <span className="flex items-center gap-1 text-[0.7rem] font-bold uppercase tracking-widest text-slate-500">
            <Trophy size={11} aria-hidden="true" />Trophies
          </span>
          <span className="text-[0.7rem] font-bold uppercase tracking-widest text-slate-500">Score</span>
        </div>

        {loading ? (
          <div className="flex min-h-52 items-center justify-center">
            <p className="text-sm text-slate-500">Loading…</p>
          </div>
        ) : error ? (
          <div className="flex min-h-52 items-center justify-center">
            <p className="text-sm text-danger">{error}</p>
          </div>
        ) : players.length === 0 ? (
          <div className="flex min-h-52 items-center justify-center">
            <div className="text-center">
              <Trophy size={28} className="mx-auto mb-3 text-slate-600" aria-hidden="true" />
              <p className="text-sm text-slate-500">No players ranked yet.</p>
              <p className="mt-1 text-xs text-slate-600">Play a game to claim your spot.</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-pink-500/8">
            {players.map((p) => {
              const isMe = p.id?.toString() === player?.id?.toString()
              return (
                <div
                  key={p.rank}
                  className={`grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 px-4 py-3 transition sm:grid-cols-[auto_1fr_auto_auto_auto] sm:gap-4 sm:px-5 ${isMe ? 'bg-pink-500/8' : 'hover:bg-white/4'}`}
                >
                  <span className={`w-6 text-center font-data text-sm font-bold ${rankColors[p.rank - 1] ?? 'text-slate-500'}`}>
                    {p.rank}
                  </span>
                  <div className="min-w-0">
                    <div className={`truncate text-sm ${isMe ? 'font-semibold text-pink-300' : 'text-text'}`}>
                      {p.name}{isMe && ' (you)'}
                    </div>
                    {p.customTitle && (
                      <div className="truncate text-xs text-muted">{p.customTitle}</div>
                    )}
                  </div>
                  {/* League badge: hidden on mobile (no column), visible on sm+ */}
                  <span className="hidden sm:block">
                    <LeagueBadge trophies={p.trophies ?? 0} size="sm" />
                  </span>
                  <span className="flex items-center gap-1 font-data text-xs">
                    {p.trophies > 0
                      ? <><Trophy size={11} className="text-amber-400" /><span className="text-amber-400">{p.trophies}</span></>
                      : <span className="text-slate-600">—</span>
                    }
                  </span>
                  <span className="font-data text-sm text-text">{p.totalScore.toLocaleString()}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
