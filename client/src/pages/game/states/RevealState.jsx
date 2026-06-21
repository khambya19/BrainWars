import { CheckCircle, XCircle } from 'lucide-react'
import { useAuth } from '../../../context/AuthContext.jsx'
import GameLeaderboard from '../components/GameLeaderboard.jsx'

export default function RevealState({ result, leaderboard }) {
  const { player }   = useAuth()
  const myResult     = result.results.find((r) => r.name === player?.name)
  const isCorrect    = myResult?.isCorrect
  const points       = myResult?.points ?? 0
  const hpChange     = myResult?.hpChange ?? 0

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div>
        {/* Correct answer */}
        <div className="animate-fade-in-up mb-6 rounded-2xl border border-pink-500/15 bg-[#141B2E]/85 p-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">Correct answer</p>
          <p className="font-medium text-lime-400 text-lg">{result.correctAnswer}</p>
        </div>

        {/* Your result */}
        {myResult && (
          <div
            className={`animate-fade-in-up mb-6 flex items-center gap-4 rounded-2xl border p-5 ${
              isCorrect
                ? 'border-lime-400/30 bg-lime-400/8'
                : 'border-[#FF5A4E]/30 bg-[#FF5A4E]/8'
            }`}
            style={{ animationDelay: '100ms' }}
          >
            {isCorrect
              ? <CheckCircle size={24} className="shrink-0 text-lime-400" />
              : <XCircle    size={24} className="shrink-0 text-[#FF5A4E]" />}
            <div>
              <p className={`font-bold ${isCorrect ? 'text-lime-400' : 'text-[#FF5A4E]'}`}>
                {isCorrect ? 'Correct!' : 'Wrong'}
              </p>
              <p className="text-sm text-slate-400">
                {isCorrect ? `+${points} pts` : '0 pts'} &nbsp;
                {hpChange > 0 && <span className="text-lime-400">+{hpChange} HP</span>}
                {hpChange < 0 && <span className="text-[#FF5A4E]">{hpChange} HP</span>}
                {myResult.streak > 1 && <span className="ml-2 text-amber-400">🔥 {myResult.streak} streak</span>}
              </p>
            </div>
            <p className="ml-auto text-xs text-slate-500">{myResult.timeElapsed}s</p>
          </div>
        )}

        {/* All player results */}
        <div className="animate-fade-in-up grid gap-2" style={{ animationDelay: '150ms' }}>
          {result.results.map((r) => (
            <div key={r.playerId} className="flex items-center gap-3 rounded-xl border border-pink-500/10 bg-[#141B2E]/60 px-4 py-2.5">
              {r.isCorrect
                ? <CheckCircle size={14} className="shrink-0 text-lime-400" />
                : <XCircle    size={14} className="shrink-0 text-[#FF5A4E]" />}
              <span className="flex-1 text-sm text-[#EDEFF5]">{r.name}</span>
              <span className="font-['JetBrains_Mono'] text-xs text-slate-400">{r.timeElapsed}s</span>
              <span className={`font-['JetBrains_Mono'] text-sm ${r.isCorrect ? 'text-lime-400' : 'text-slate-500'}`}>
                {r.isCorrect ? `+${r.points}` : '0'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <GameLeaderboard leaderboard={leaderboard} myPlayerId={player?.id?.toString()} />
      </div>
    </div>
  )
}
