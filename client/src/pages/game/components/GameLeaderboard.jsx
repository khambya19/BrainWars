import { useEffect, useRef, useState } from 'react'
import { Heart, Skull, Zap } from 'lucide-react'

// This component displays the in-game leaderboard.

export default function GameLeaderboard({ leaderboard = [], myPlayerId }) {
  const [movers, setMovers]   = useState({})
  const prevBoardRef          = useRef([])

  useEffect(() => {
    const prev = {}
    prevBoardRef.current.forEach((p, i) => { prev[p.playerId] = i + 1 })

    const moved = {}
    leaderboard.forEach((p, i) => {
      const prevRank = prev[p.playerId]
      if (prevRank && prevRank !== i + 1) {
        moved[p.playerId] = prevRank > i + 1 ? 'up' : 'down'
        setTimeout(() => setMovers((m) => { const n = { ...m }; delete n[p.playerId]; return n }), 1200)
      }
    })

    setMovers(moved)
    prevBoardRef.current = leaderboard
  }, [leaderboard])

  return (
    <div className="overflow-hidden rounded-2xl border border-pink-500/15 bg-panel/85">
      <div className="border-b border-pink-500/10 px-4 py-3">
        <h3 className="font-orbitron text-[0.8rem] tracking-[-0.02em] text-text">
          Live Leaderboard
        </h3>
      </div>

      <ul className="divide-y divide-pink-500/8">
        {leaderboard.map((player, i) => {
          const isMe       = player.playerId === myPlayerId
          const mover      = movers[player.playerId]
          const eliminated = player.eliminated ?? false

          return (
            <li
              key={player.playerId}
              className={`flex items-center gap-3 px-4 py-3 transition-all duration-500 ${
                eliminated ? 'opacity-40' : isMe ? 'bg-pink-500/8' : ''
              }`}
            >
              <span className={`w-5 text-center font-data text-sm ${
                eliminated
                  ? 'text-slate-600'
                  : i === 0 ? 'text-amber-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-600' : 'text-slate-500'
              }`}>
                {eliminated ? <Skull size={12} className="mx-auto" aria-label="Eliminated" /> : i + 1}
              </span>

              <span className={`flex-1 truncate text-sm ${eliminated ? 'text-slate-500 line-through' : 'text-text'}`}>
                {player.name}{isMe ? ' (you)' : ''}
              </span>

              {!eliminated && mover === 'up' && (
                <span className="animate-fade-in text-xs text-lime-400">↑</span>
              )}
              {!eliminated && mover === 'down' && (
                <span className="animate-fade-in text-xs text-red-400">↓</span>
              )}

              {eliminated ? (
                <span className="text-[0.6rem] uppercase tracking-widest text-danger/60">out</span>
              ) : (
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Heart size={11} className="text-pink-400" />
                  <span>{player.hp}</span>
                </div>
              )}

              <div className="flex items-center gap-1">
                <Zap size={11} className="text-amber-400" />
                <span className={`font-data text-sm ${eliminated ? 'text-slate-600' : 'text-text'}`}>
                  {player.score}
                </span>
              </div>
            </li>
          )
        })}

        {leaderboard.length === 0 && (
          <li className="px-4 py-6 text-center text-sm text-slate-500">
            Waiting for players…
          </li>
        )}
      </ul>
    </div>
  )
}
