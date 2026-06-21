import { Trophy } from 'lucide-react'
import { useAuth } from '../../../context/AuthContext.jsx'
import { rankColors, rankLabels } from '../../../utils/rankStyles.js'

export default function FinishedState({ finalLeaderboard, onPlayAgain, onLeave }) {
  const { player } = useAuth()
  const myRank     = finalLeaderboard.findIndex((p) => p.name === player?.name) + 1
  const winner     = finalLeaderboard[0]

  return (
    <div className="mx-auto max-w-xl">
      {/* Winner */}
      {winner && (
        <div className="animate-fade-in-up mb-6 rounded-2xl border border-amber-400/25 bg-amber-400/8 p-6 text-center">
          <Trophy size={32} className="mx-auto mb-2 text-amber-400" />
          <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Winner</p>
          <p className="mt-1 font-['Orbitron'] text-2xl text-[#EDEFF5]">{winner.name}</p>
          <p className="mt-1 font-['JetBrains_Mono'] text-lg text-amber-400">{winner.score} pts</p>
        </div>
      )}

      {/* Your rank */}
      {myRank > 0 && (
        <div className="animate-fade-in-up mb-6 rounded-2xl border border-pink-500/15 bg-[#141B2E]/85 p-5 text-center" style={{ animationDelay: '100ms' }}>
          <p className="text-xs uppercase tracking-widest text-slate-400">Your rank</p>
          <p className="mt-1 font-['Orbitron'] text-4xl text-[#EDEFF5]">#{myRank}</p>
          <p className="mt-1 text-sm text-slate-400">
            {myRank === 1 ? 'You won! 🎉' : myRank <= 3 ? 'Great game! 🔥' : 'Better luck next time!'}
          </p>
        </div>
      )}

      {/* Final leaderboard */}
      <div className="animate-fade-in-up mb-6 overflow-hidden rounded-2xl border border-pink-500/15 bg-[#141B2E]/85" style={{ animationDelay: '150ms' }}>
        <div className="border-b border-pink-500/10 px-5 py-3">
          <h2 className="font-['Orbitron'] text-[0.85rem] tracking-[-0.02em] text-[#EDEFF5]">Final standings</h2>
        </div>
        <ul className="divide-y divide-pink-500/8">
          {finalLeaderboard.map((p, i) => (
            <li key={p.playerId} className={`flex items-center gap-3 px-5 py-3 ${p.name === player?.name ? 'bg-pink-500/8' : ''}`}>
              <span className={`w-6 text-lg ${rankColors[i] ?? 'text-slate-500'}`}>
                {rankLabels[i] ?? `${i + 1}.`}
              </span>
              <span className="flex-1 text-sm text-[#EDEFF5]">
                {p.name}{p.name === player?.name ? ' (you)' : ''}
              </span>
              <span className="font-['JetBrains_Mono'] text-sm text-[#EDEFF5]">{p.score}</span>
              <span className="text-xs text-slate-500">HP {p.hp}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="animate-fade-in-up flex gap-3" style={{ animationDelay: '200ms' }}>
        <button
          type="button"
          onClick={onPlayAgain}
          className="flex-1 min-h-12 rounded-2xl border border-pink-500/40 bg-pink-500 font-bold text-white transition hover:-translate-y-0.5 hover:bg-pink-400"
        >
          Play again
        </button>
        <button
          type="button"
          onClick={onLeave}
          className="min-h-12 rounded-2xl border border-pink-500/20 px-6 text-sm text-slate-400 transition hover:text-pink-400"
        >
          Dashboard
        </button>
      </div>
    </div>
  )
}
