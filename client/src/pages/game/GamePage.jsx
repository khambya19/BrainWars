import { Volume2, VolumeX } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext.jsx'
import { useGameSocketContext } from '../../context/GameSocketContext.jsx'
import { useMute } from '../../hooks/useMute.js'
import { playSound } from '../../utils/sounds.js'
import EliminatedState from './states/EliminatedState.jsx'
import FinishedState from './states/FinishedState.jsx'
import LobbyState from './states/LobbyState.jsx'
import QuestionState from './states/QuestionState.jsx'
import RevealState from './states/RevealState.jsx'

// This page coordinates the live game experience.

export default function GamePage() {
  const navigate = useNavigate()
  const { player } = useAuth()
  const { game, startGame, submitAnswer, leaveRoom } = useGameSocketContext()
  const { muted, toggle } = useMute()
  const MuteIcon = muted ? VolumeX : Volume2

  const [countdown, setCountdown] = useState(null)
  const countdownRef = useRef(null)

  useEffect(() => {
    if (game.state === 'starting') {
      setCountdown(5)
      playSound('countdown')
      countdownRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownRef.current)
            return null
          }
          playSound('tick')
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(countdownRef.current)
      setCountdown(null)
    }
    return () => clearInterval(countdownRef.current)
  }, [game.state])

  function handleLeave() {
    leaveRoom()
    navigate('/dashboard')
  }

  function handlePlayAgain() {
    leaveRoom()
    navigate('/dashboard/play')
  }

  // Determine if the current player is eliminated from leaderboard data
  const myLeaderboardEntry = game.leaderboard.find(
    (p) => p.playerId === player?.id?.toString()
  )
  const isEliminated = myLeaderboardEntry?.eliminated ?? false

  return (
    <div
      className="relative min-h-screen bg-void bg-gradient-game text-text"
    >
      <div
        aria-hidden="true"
        className="bg-grid pointer-events-none fixed inset-0 opacity-[0.10]"
      />

      <button
        type="button"
        onClick={toggle}
        aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
        className="absolute right-4 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-pink-500/22 text-slate-400 transition hover:border-pink-500/40 hover:text-pink-400"
      >
        <MuteIcon size={16} />
      </button>

      {/* Reconnecting overlay */}
      {game.reconnecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 backdrop-blur-sm">
          <div className="rounded-2xl border border-pink-500/20 bg-panel/95 px-8 py-6 text-center">
            <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
            <p className="font-orbitron text-sm text-text">Reconnecting…</p>
            <p className="mt-1 text-xs text-slate-500">Restoring your game state</p>
          </div>
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-295 px-4 py-8 sm:px-6">
        {game.error && (
          <div className="mb-4 rounded-xl border border-danger/30 bg-danger/8 px-4 py-3 text-sm text-danger">
            {game.error}
          </div>
        )}

        {game.state === 'idle' && !game.reconnecting && (
          <div className="text-center text-slate-400 py-20">
            <p>Connecting…</p>
          </div>
        )}

        {game.state === 'lobby' && game.room && (
          <LobbyState
            room={game.room}
            isHost={game.isHost}
            onStart={startGame}
            onLeave={handleLeave}
          />
        )}

        {game.state === 'starting' && countdown !== null && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-pink-400">Get ready!</p>
            <div
              key={countdown}
              className="font-orbitron text-[8rem] leading-none font-bold text-text animate-ping-once"
              className="text-shadow-signal"
            >
              {countdown}
            </div>
            <p className="text-slate-400 text-sm">Game is starting…</p>
          </div>
        )}

        {game.state === 'question' && game.question && (
          isEliminated ? (
            <EliminatedState question={game.question} leaderboard={game.leaderboard} />
          ) : (
            <QuestionState
              question={game.question}
              myAnswer={game.myAnswer}
              leaderboard={game.leaderboard}
              onAnswer={submitAnswer}
            />
          )
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
