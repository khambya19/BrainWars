import { useNavigate } from 'react-router-dom'

import { useGameSocketContext } from '../../context/GameSocketContext.jsx'
import FinishedState from './states/FinishedState.jsx'
import LobbyState from './states/LobbyState.jsx'
import QuestionState from './states/QuestionState.jsx'
import RevealState from './states/RevealState.jsx'

export default function GamePage() {
  const navigate = useNavigate()
  const { game, createRoom, joinRoom, startGame, submitAnswer, leaveRoom } = useGameSocketContext()

  function handleLeave() {
    leaveRoom()
    navigate('/dashboard')
  }

  function handlePlayAgain() {
    leaveRoom()
    navigate('/dashboard/play')
  }

  return (
    <div
      className="relative min-h-screen bg-[#0B0F1A] text-[#EDEFF5]"
      style={{
        backgroundImage:
          'radial-gradient(circle at top, rgba(255,61,129,0.10), transparent 35%)',
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-295 px-4 py-8 sm:px-6">
        {game.error && (
          <div className="mb-4 rounded-xl border border-[#FF5A4E]/30 bg-[#FF5A4E]/8 px-4 py-3 text-sm text-[#FF5A4E]">
            {game.error}
          </div>
        )}

        {game.state === 'idle' && (
          <div className="text-center text-slate-400 py-20">
            <p>Connecting…</p>
          </div>
        )}

        {(game.state === 'lobby' || game.state === 'starting') && game.room && (
          <LobbyState
            room={game.room}
            isHost={game.isHost}
            onStart={startGame}
            onLeave={handleLeave}
          />
        )}

        {game.state === 'question' && game.question && (
          <QuestionState
            question={game.question}
            myAnswer={game.myAnswer}
            leaderboard={game.leaderboard}
            onAnswer={submitAnswer}
          />
        )}

        {game.state === 'reveal' && game.result && (
          <RevealState
            result={game.result}
            leaderboard={game.leaderboard}
          />
        )}

        {game.state === 'finished' && (
          <FinishedState
            finalLeaderboard={game.finalLeaderboard}
            onPlayAgain={handlePlayAgain}
            onLeave={handleLeave}
          />
        )}
      </div>
    </div>
  )
}
