import { useEffect, useState } from 'react'
import { Hash, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useGameSocketContext } from '../../../context/GameSocketContext.jsx'

export default function QuickJoin() {
  const { game, joinRoom } = useGameSocketContext()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [joining, setJoining] = useState(false)

  useEffect(() => {
    if (game.state === 'lobby' || game.state === 'starting' || game.state === 'question') {
      navigate('/game')
    }
  }, [game.state, navigate])

  function attemptJoin(roomCode) {
    setJoining(true)
    setError('')
    joinRoom(roomCode, (errMsg) => {
      setError(errMsg)
      setJoining(false)
    })
  }

  function handleCodeChange(e) {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    setCode(val)
    setError('')
    if (val.length === 4) attemptJoin(val)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = code.trim()
    if (trimmed.length !== 4) { setError('Enter a 4-character code.'); return }
    attemptJoin(trimmed)
  }

  return (
    <div className="animate-fade-in-up rounded-2xl border border-pink-500/15 bg-panel/85 p-5 delay-350">
      <div className="mb-1 flex items-center gap-2 text-pink-400">
        <Zap size={15} aria-hidden="true" />
        <h2 className="font-orbitron text-[0.9rem] tracking-[-0.03em] text-text">
          Quick join
        </h2>
      </div>
      <p className="mb-4 text-xs text-slate-400">Enter a 4-character room code to jump in instantly.</p>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Hash size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" />
          <input
            value={code}
            onChange={handleCodeChange}
            placeholder="AB12"
            maxLength={4}
            disabled={joining}
            className="min-h-10 w-full rounded-xl border border-pink-500/20 bg-void/60 pl-8 pr-3 font-data text-sm uppercase tracking-widest text-text placeholder:text-slate-600 outline-none focus:border-pink-500/50 disabled:opacity-60"
          />
        </div>
        <button
          type="submit"
          disabled={joining}
          className="min-h-10 rounded-xl border border-pink-500/30 bg-pink-500/10 px-4 text-sm font-medium text-text transition hover:bg-pink-500/20 disabled:opacity-60"
        >
          {joining ? '…' : 'Join'}
        </button>
      </form>
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
    </div>
  )
}
