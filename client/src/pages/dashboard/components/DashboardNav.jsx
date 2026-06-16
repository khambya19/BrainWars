import { LogOut, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../../../context/AuthContext.jsx'

export default function DashboardNav() {
  const { player, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="shrink-0 border-b border-pink-500/12 bg-[#0B0F1A]/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-295 items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-3 transition duration-150 ease-out hover:opacity-80"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-pink-500/35 bg-pink-500/10 font-['Orbitron'] text-sm tracking-[0.06em] text-[#EDEFF5]">
            BW
          </span>
          <strong className="hidden font-['Orbitron'] text-[0.95rem] leading-none tracking-[-0.04em] sm:block">
            BrainWars
          </strong>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-pink-500/15 bg-[#141B2E]/80 px-4 py-2 sm:flex">
            <User size={14} className="text-slate-400" aria-hidden="true" />
            <span className="text-sm text-[#EDEFF5]">{player?.name ?? 'Player'}</span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-[#141B2E] px-4 py-2 text-sm text-slate-400 transition duration-150 hover:-translate-y-px hover:border-pink-500/40 hover:text-pink-400"
          >
            <LogOut size={14} aria-hidden="true" />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}
