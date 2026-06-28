import { Copy, Users } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../../context/AuthContext.jsx'
import { playSound } from '../../../utils/sounds.js'

export default function LobbyState({ room, isHost, onStart, onLeave }) {
  const { player } = useAuth()
  const [copied, setCopied] = useState(false)
  const prevCount = useRef(room.players.length)

  useEffect(() => {
    if (room.players.length > prevCount.current) playSound('join')
    prevCount.current = room.players.length
  }, [room.players.length])

  function copyCode() {
    navigator.clipboard.writeText(room.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="animate-fade-in-up mb-6 text-center">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-pink-400">Waiting room</p>
        <div
          className="mx-auto mb-2 cursor-pointer font-orbitron text-[4rem] leading-none tracking-[0.12em] text-text transition hover:text-pink-400"
          onClick={copyCode}
          title="Click to copy"
        >
          {room.code}
        </div>
        <button
          type="button"
          onClick={copyCode}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 transition hover:text-pink-400"
        >
          <Copy size={12} />
          {copied ? 'Copied!' : 'Copy code'}
        </button>
        <p className="mt-2 text-sm text-slate-400">Share this code with players to join the room.</p>
      </div>

      <div className="animate-fade-in-up mb-6 rounded-2xl border border-pink-500/15 bg-panel/85 p-5 delay-100">
        <div className="mb-3 flex items-center gap-2 text-slate-400">
          <Users size={14} />
          <span className="text-xs font-bold uppercase tracking-widest">
            Players ({room.players.length})
          </span>
        </div>
        <ul className="grid gap-2">
          {room.players.map((p) => (
            <li key={p.playerId} className="flex items-center gap-3">
              <div className="grid h-7 w-7 place-items-center rounded-full bg-pink-500/15 font-orbitron text-xs text-pink-400">
                {p.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-text">
                {p.name}
                {p.playerId === room.host && (
                  <span className="ml-2 text-[0.65rem] uppercase tracking-widest text-pink-400">host</span>
                )}
                {p.playerId === player?.id?.toString() && (
                  <span className="ml-2 text-[0.65rem] text-slate-500">(you)</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="animate-fade-in-up flex gap-3 delay-200">
        {isHost && (
          <button
            type="button"
            onClick={onStart}
            disabled={room.players.length < 1}
            className="flex-1 min-h-12 rounded-2xl border border-pink-500/40 bg-pink-500 font-bold text-white transition hover:-translate-y-0.5 hover:bg-pink-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Start game
          </button>
        )}
        <button
          type="button"
          onClick={onLeave}
          className="min-h-12 rounded-2xl border border-pink-500/20 bg-transparent px-6 text-sm text-slate-400 transition hover:text-pink-400"
        >
          Leave
        </button>
      </div>
    </div>
  )
}
