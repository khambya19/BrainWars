import { useEffect, useRef, useState } from 'react'
import { Heart, Zap } from 'lucide-react'

export default function GameLeaderboard({ leaderboard = [], myPlayerId }) {
  const [prevRanks, setPrevRanks]     = useState({})
  const [movers, setMovers]           = useState({})
  const prevBoardRef                  = useRef([])

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

    setPrevRanks(prev)
    setMovers(moved)
    prevBoardRef.current = leaderboard
  }, [leaderboard])

  return (
    <div className="rounded-2xl border border-pink-500/15 bg-[#141B2E]/85 overflow-hidden">
      <div className="border-b border-pink-500/10 px-4 py-3">
        <h3 className="font-['Orbitron'] text-[0.8rem] tracking-[-0.02em] text-[#EDEFF5]">
          Live Leaderboard
        </h3>
      </div>

      <ul className="divide-y divide-pink-500/8">
        {leaderboard.map((player, i) => {
          const isMe   = player.playerId === myPlayerId
          const mover  = movers[player.playerId]

          return (
            <li
              key={player.playerId}
              className={`flex items-center gap-3 px-4 py-3 transition-all duration-500 ${
                isMe ? 'bg-pink-500/8' : ''
              }`}
            >
              <span className={`w-5 text-center font-['JetBrains_Mono'] text-sm ${
                i === 0 ? 'text-amber-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-600' : 'text-slate-500'
              }`}>
                {i + 1}
              </span>

              <span className="flex-1 truncate text-sm text-[#EDEFF5]">
                {player.name}{isMe ? ' (you)' : ''}
              </span>

              {mover === 'up' && (
                <span className="animate-fade-in text-xs text-lime-400">↑</span>
              )}
              {mover === 'down' && (
                <span className="animate-fade-in text-xs text-red-400">↓</span>
              )}

              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Heart size={11} className="text-pink-400" />
                <span>{player.hp}</span>
              </div>

              <div className="flex items-center gap-1">
                <Zap size={11} className="text-amber-400" />
                <span className="font-['JetBrains_Mono'] text-sm text-[#EDEFF5]">
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
