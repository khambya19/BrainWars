import { Skull } from 'lucide-react'
import { useAuth } from '../../../context/AuthContext.jsx'
import GameLeaderboard from '../components/GameLeaderboard.jsx'

export default function EliminatedState({ question, leaderboard }) {
  const { player } = useAuth()

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 rounded-2xl border border-danger/20 bg-danger/5 p-8 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full border border-danger/30 bg-danger/10">
          <Skull size={32} className="text-danger" aria-hidden="true" />
        </div>
        <div>
          <p className="font-orbitron text-xl font-bold tracking-[-0.02em] text-danger">
            ELIMINATED
          </p>
          <p className="mt-1 text-sm text-slate-400">
            You're spectating — watch the battle unfold.
          </p>
        </div>
        {question && (
          <div className="mt-2 w-full rounded-xl border border-pink-500/15 bg-panel/85 p-4 text-left">
            <p className="mb-1 text-[0.65rem] font-bold uppercase tracking-widest text-slate-500">
              Current question ({question.questionNumber} / {question.totalQuestions})
            </p>
            <p className="text-sm text-text">{question.text}</p>
          </div>
        )}
      </div>

      <div>
        <GameLeaderboard leaderboard={leaderboard} myPlayerId={player?.id?.toString()} />
      </div>
    </div>
  )
}
