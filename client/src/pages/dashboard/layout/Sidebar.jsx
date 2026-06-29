import { BookOpen, LayoutDashboard, LogOut, Settings, Swords, Trophy, User, Volume2, VolumeX } from 'lucide-react'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import { useAuth } from '../../../context/AuthContext.jsx'
import { useMute } from '../../../hooks/useMute.js'

// This component renders the main dashboard sidebar.

const navItems = [
  { label: 'Home',         to: '/dashboard',            icon: LayoutDashboard, end: true },
  { label: 'Play',         to: '/dashboard/play',        icon: Swords                     },
  { label: 'My Banks',     to: '/dashboard/banks',       icon: BookOpen                   },
  { label: 'Leaderboard',  to: '/dashboard/leaderboard', icon: Trophy                     },
  { label: 'Profile',      to: '/dashboard/profile',     icon: User                       },
  { label: 'Settings',     to: '/dashboard/settings',    icon: Settings                   },
]

export default function Sidebar() {
  const { player, logout } = useAuth()
  const navigate = useNavigate()
  const { muted, toggle } = useMute()
  const MuteIcon = muted ? VolumeX : Volume2

  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const initials = player?.name
    ?.split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? 'P'

  function handleLogoutConfirm() {
    setShowLogoutModal(false)
    logout()
    navigate('/login')
  }

  return (
    <>
      {/* Logout confirmation modal */}
      {showLogoutModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-void/80 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />

          {/* Modal card */}
          <div className="relative w-full max-w-sm animate-fade-in-up rounded-2xl border border-pink-500/20 bg-panel p-6 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
            <div className="mb-1 flex items-center gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-pink-500/25 bg-pink-500/10">
                <LogOut size={16} className="text-pink-400" aria-hidden="true" />
              </div>
              <h2 id="logout-title" className="font-orbitron text-[0.95rem] tracking-[-0.02em] text-text">
                Log out?
              </h2>
            </div>

            <p className="mb-5 mt-3 text-sm text-slate-400">
              You'll need to log back in to access your dashboard and play games.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 min-h-10 rounded-xl border border-pink-500/15 bg-white/4 text-sm text-slate-400 transition hover:bg-white/8 hover:text-text"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogoutConfirm}
                className="flex-1 min-h-10 rounded-xl border border-pink-500/40 bg-pink-500 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-pink-400"
              >
                Yes, log out
              </button>
            </div>
          </div>
        </div>
      )}

      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col border-r border-pink-500/12 bg-sidebar lg:flex">
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-pink-500/12 px-5 py-5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-pink-500/35 bg-pink-500/10 font-orbitron text-sm tracking-[0.06em] text-text">
            BW
          </span>
          <strong className="font-orbitron text-[0.9rem] leading-none tracking-[-0.04em] text-text">
            BrainWars
          </strong>
        </div>

        {/* Player chip */}
        <div className="border-b border-pink-500/12 px-4 py-4">
          <div className="flex items-center gap-3 rounded-xl border border-pink-500/12 bg-void/60 px-3 py-2.5">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-pink-500/20 font-orbitron text-xs font-bold text-pink-400">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-text">{player?.name ?? 'Player'}</p>
              <p className="truncate text-xs text-slate-500">{player?.email ?? ''}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Dashboard navigation">
          <ul className="grid gap-1">
            {navItems.map(({ label, to, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition duration-150 ease-out ${
                      isActive
                        ? 'border border-pink-500/20 bg-pink-500/12 font-medium text-text'
                        : 'text-slate-400 hover:bg-white/4 hover:text-text'
                    }`
                  }
                >
                  <Icon size={17} aria-hidden="true" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mute + Logout */}
        <div className="border-t border-pink-500/12 px-3 py-4 grid gap-1">
          <button
            type="button"
            onClick={toggle}
            aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition duration-150 ease-out hover:bg-white/4 hover:text-pink-400"
          >
            <MuteIcon size={17} aria-hidden="true" />
            {muted ? 'Sounds off' : 'Sounds on'}
          </button>
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition duration-150 ease-out hover:bg-white/4 hover:text-pink-400"
          >
            <LogOut size={17} aria-hidden="true" />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
