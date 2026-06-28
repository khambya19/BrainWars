import { useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext.jsx'
import { playSound } from '../../../utils/sounds.js'
import AnswerOption from '../components/AnswerOption.jsx'
import CountdownTimer from '../components/CountdownTimer.jsx'
import GameLeaderboard from '../components/GameLeaderboard.jsx'
import HPBar from '../components/HPBar.jsx'

const DIFFICULTY_STYLES = {
  easy:   { bar: 'bg-lime-400',   badge: 'border-lime-400/40 bg-lime-400/15 text-lime-400'     },
  medium: { bar: 'bg-amber-400',  badge: 'border-amber-400/40 bg-amber-400/15 text-amber-400'  },
  hard:   { bar: 'bg-danger', badge: 'border-danger/40 bg-danger/15 text-danger' },
}

const TYPE_LABEL = {
  'mcq':        'Multiple Choice',
  'true-false': 'True / False',
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D']

// Map keyboard keys to option indices
const KEY_TO_INDEX = { a: 0, b: 1, c: 2, d: 3, '1': 0, '2': 1, '3': 2, '4': 3 }

function getDifficultyKey(difficulty) {
  return difficulty?.toLowerCase() ?? 'medium'
}

export default function QuestionState({ question, myAnswer, leaderboard, onAnswer }) {
  const { player } = useAuth()
  const myEntry = leaderboard.find((p) => p.playerId === player?.id?.toString())

  const diffKey   = getDifficultyKey(question.difficulty)
  const diffStyle = DIFFICULTY_STYLES[diffKey] ?? DIFFICULTY_STYLES.medium
  const typeLabel = TYPE_LABEL[question.type] ?? question.type
  const progress  = (question.questionNumber / question.totalQuestions) * 100

  function getStatus(option) {
    if (!myAnswer)           return 'idle'
    if (option === myAnswer) return 'selected'
    return 'disabled'
  }

  function handleAnswer(option) {
    if (myAnswer) return
    playSound('click')
    onAnswer(option)
  }

  // Keyboard shortcuts: A/B/C/D or 1/2/3/4
  useEffect(() => {
    function onKeyDown(e) {
      if (myAnswer) return
      // Don't fire if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

      const key = e.key.toLowerCase()
      const idx = KEY_TO_INDEX[key]
      if (idx === undefined || idx >= question.options.length) return

      e.preventDefault()
      handleAnswer(question.options[idx])
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [myAnswer, question.options])

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div>
        {/* Progress bar */}
        <div className="animate-fade-in-up mb-4">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="font-orbitron text-xs font-bold tracking-widest text-pink-400">
              Question {question.questionNumber} of {question.totalQuestions}
            </span>
            <span className="font-data text-xs text-slate-500">
              {question.questionNumber}/{question.totalQuestions}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
            <div
              className={`h-full rounded-full transition-all duration-500 ${diffStyle.bar}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Meta row: difficulty + type + points + timer */}
        <div className="animate-fade-in-up mb-5 flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {question.category && (
              <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-sky-400">
                {question.category}
              </span>
            )}
            <span className={`rounded-full border px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest ${diffStyle.badge}`}>
              {question.difficulty}
            </span>
            <span className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-slate-300">
              {typeLabel}
            </span>
            <span className="rounded-full border border-pink-500/25 bg-pink-500/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-pink-400">
              {question.points} pts
            </span>
            <HPBar hp={myEntry?.hp ?? 100} />
          </div>

          <CountdownTimer
            startTime={question.startTime}
            timeLimit={question.timeLimit}
          />
        </div>

        {/* Question card */}
        <div className="animate-fade-in-up mb-5 rounded-2xl border border-pink-500/15 bg-panel/85 p-6 delay-80">
          <p className="text-lg leading-7 text-text">{question.text}</p>
        </div>

        {/* Answer options */}
        <div
          className={`animate-fade-in-up grid gap-3 delay-140 ${question.type === 'true-false' ? 'grid-cols-2' : 'grid-cols-1'}`}
        >
          {question.options.map((option, i) => (
            <AnswerOption
              key={option}
              label={option}
              letter={question.type !== 'true-false' ? OPTION_LETTERS[i] : null}
              status={getStatus(option)}
              disabled={Boolean(myAnswer)}
              onClick={() => handleAnswer(option)}
            />
          ))}
        </div>

        {myAnswer ? (
          <p className="mt-4 animate-fade-in text-center text-sm text-slate-400">
            Answer locked in — waiting for results…
          </p>
        ) : (
          <p className="mt-4 text-center text-[0.65rem] text-slate-600">
            Tip: press A / B / C / D or 1 / 2 / 3 / 4 to answer
          </p>
        )}
      </div>

      {/* Live leaderboard */}
      <div className="animate-fade-in-up delay-200">
        <GameLeaderboard leaderboard={leaderboard} myPlayerId={player?.id?.toString()} />
      </div>
    </div>
  )
}
