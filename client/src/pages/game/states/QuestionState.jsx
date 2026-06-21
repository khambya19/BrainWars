import { useAuth } from '../../../context/AuthContext.jsx'
import AnswerOption from '../components/AnswerOption.jsx'
import CountdownTimer from '../components/CountdownTimer.jsx'
import GameLeaderboard from '../components/GameLeaderboard.jsx'
import HPBar from '../components/HPBar.jsx'

const DIFFICULTY_STYLES = {
  Easy:   'border-lime-400/30 bg-lime-400/10 text-lime-400',
  Medium: 'border-amber-400/30 bg-amber-400/10 text-amber-400',
  Hard:   'border-[#FF5A4E]/30 bg-[#FF5A4E]/10 text-[#FF5A4E]',
  easy:   'border-lime-400/30 bg-lime-400/10 text-lime-400',
  medium: 'border-amber-400/30 bg-amber-400/10 text-amber-400',
  hard:   'border-[#FF5A4E]/30 bg-[#FF5A4E]/10 text-[#FF5A4E]',
}

const TYPE_LABEL = {
  'mcq':        'MCQ',
  'true-false': 'True / False',
}

export default function QuestionState({ question, myAnswer, leaderboard, onAnswer }) {
  const { player } = useAuth()
  const myEntry     = leaderboard.find((p) => p.name === player?.name)

  const diffStyle   = DIFFICULTY_STYLES[question.difficulty] ?? 'border-pink-500/20 bg-pink-500/10 text-pink-400'
  const typeLabel   = TYPE_LABEL[question.type] ?? question.type

  function getStatus(option) {
    if (!myAnswer)           return 'idle'
    if (option === myAnswer) return 'selected'
    return 'disabled'
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div>
        {/* Header row */}
        <div className="animate-fade-in-up mb-5 flex items-start justify-between gap-4">
          <div className="grid gap-2">
            {/* Question number + meta badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-pink-400">
                Q{question.questionNumber} / {question.totalQuestions}
              </span>
              <span className={`rounded-full border px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-widest ${diffStyle}`}>
                {question.difficulty}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-widest text-slate-400">
                {typeLabel}
              </span>
              <span className="rounded-full border border-pink-500/20 bg-pink-500/8 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-widest text-pink-400">
                {question.points} pts
              </span>
            </div>

            {/* HP bar */}
            <HPBar hp={myEntry?.hp ?? 100} />
          </div>

          <CountdownTimer
            startTime={question.startTime}
            timeLimit={question.timeLimit}
          />
        </div>

        {/* Question card */}
        <div className="animate-fade-in-up mb-5 rounded-2xl border border-pink-500/15 bg-[#141B2E]/85 p-6" style={{ animationDelay: '80ms' }}>
          <p className="text-lg leading-7 text-[#EDEFF5]">{question.text}</p>
        </div>

        {/* Answer options */}
        <div
          className={`animate-fade-in-up grid gap-3 ${question.type === 'true-false' ? 'grid-cols-2' : 'grid-cols-1'}`}
          style={{ animationDelay: '140ms' }}
        >
          {question.options.map((option) => (
            <AnswerOption
              key={option}
              label={option}
              status={getStatus(option)}
              disabled={Boolean(myAnswer)}
              onClick={() => onAnswer(option)}
            />
          ))}
        </div>

        {myAnswer && (
          <p className="mt-4 animate-fade-in text-center text-sm text-slate-400">
            Answer locked in — waiting for results…
          </p>
        )}
      </div>

      {/* Live leaderboard */}
      <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <GameLeaderboard leaderboard={leaderboard} myPlayerId={player?.id?.toString()} />
      </div>
    </div>
  )
}
