import { CheckCircle, XCircle } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useAuth } from '../../../context/AuthContext.jsx'
import { playSound } from '../../../utils/sounds.js'
import StreakPopup from '../../../components/StreakPopup.jsx'
import GameLeaderboard from '../components/GameLeaderboard.jsx'

export default function RevealState({ result, leaderboard }) {
  const { player }   = useAuth()
  const myResult     = result.results.find((r) => r.name === player?.name)
  const isCorrect    = myResult?.isCorrect
  const points       = myResult?.points ?? 0
  const hpChange     = myResult?.hpChange ?? 0

  // Ref guard ensures sounds fire exactly once per reveal, even if deps change.
  // RevealState is unmounted between questions so the ref resets naturally.
  const soundPlayed = useRef(false)
  useEffect(() => {
    if (soundPlayed.current) return
    soundPlayed.current = true
    if (!myResult) return
    if (isCorrect) {
      playSound('correct')
      if (myResult.streak > 1) playSound('streak')
    } else {
      playSound('wrong')
    }
  }, [myResult, isCorrect])

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      {/* Streak milestone popup — overlays briefly, doesn't affect layout */}
      {myResult && isCorrect && <StreakPopup streak={myResult.streak} />}
      <div>
        {/* Correct answer */}
        <div className="animate-fade-in-up mb-6 rounded-2xl border border-pink-500/15 bg-panel/85 p-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">Correct answer</p>
          <p className="font-medium text-lime-400 text-lg">{result.correctAnswer}</p>
        </div>

        {/* Your result */}
        {myResult && (
          <div
            className={`animate-fade-in-up mb-6 flex items-center gap-4 rounded-2xl border p-5 delay-100 ${
              isCorrect
                ? 'border-lime-400/30 bg-lime-400/8'
                : 'border-danger/30 bg-danger/8'
            }`}
          >
            {isCorrect
              ? <CheckCircle size={24} className="shrink-0 text-lime-400" />
              : <XCircle    size={24} className="shrink-0 text-danger" />}
            <div>
              <p className={`font-bold ${isCorrect ? 'text-lime-400' : 'text-danger'}`}>
                {isCorrect ? 'Correct!' : 'Wrong'}
              </p>
              <p className="text-sm text-slate-400">
                {isCorrect ? `+${points} pts` : '0 pts'} &nbsp;
                {hpChange > 0 && <span className="text-lime-400">+{hpChange} HP</span>}
                {hpChange < 0 && <span className="text-danger">{hpChange} HP</span>}
                {myResult.streak > 1 && <span className="ml-2 text-amber-400">🔥 {myResult.streak} streak</span>}
              </p>
            </div>
            <p className="ml-auto text-xs text-slate-500">{myResult.timeElapsed}s</p>
          </div>
        )}

        {/* All player results */}
        <div className="animate-fade-in-up grid gap-2 delay-150">
          {result.results.map((r) => (
            <div key={r.playerId} className="flex items-center gap-3 rounded-xl border border-pink-500/10 bg-panel/60 px-4 py-2.5">
              {r.isCorrect
                ? <CheckCircle size={14} className="shrink-0 text-lime-400" />
                : <XCircle    size={14} className="shrink-0 text-danger" />}
              <span className="flex-1 text-sm text-text">{r.name}</span>
              <span className="font-data text-xs text-slate-400">{r.timeElapsed}s</span>
              <span className={`font-data text-sm ${r.isCorrect ? 'text-lime-400' : 'text-slate-500'}`}>
                {r.isCorrect ? `+${r.points}` : '0'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="animate-fade-in-up delay-100">
        <GameLeaderboard leaderboard={leaderboard} myPlayerId={player?.id?.toString()} />
      </div>
    </div>
  )
}
