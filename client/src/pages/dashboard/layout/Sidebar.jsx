import { BookOpen, LayoutDashboard, LogOut, Settings, Swords, Trophy, User } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'

import { useAuth } from '../../../context/AuthContext.jsx'

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

  const initials = player?.name
    ?.split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? 'P'

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col border-r border-pink-500/12 bg-[#0d1220] lg:flex">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-pink-500/12 px-5 py-5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-pink-500/35 bg-pink-500/10 font-['Orbitron'] text-sm tracking-[0.06em] text-[#EDEFF5]">
          BW
        </span>
        <strong className="font-['Orbitron'] text-[0.9rem] leading-none tracking-[-0.04em] text-[#EDEFF5]">
          BrainWars
        </strong>
      </div>

      {/* Player chip */}
      <div className="border-b border-pink-500/12 px-4 py-4">
        <div className="flex items-center gap-3 rounded-xl border border-pink-500/12 bg-[#0B0F1A]/60 px-3 py-2.5">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-pink-500/20 font-['Orbitron'] text-xs font-bold text-pink-400">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[#EDEFF5]">{player?.name ?? 'Player'}</p>
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
                      ? 'border border-pink-500/20 bg-pink-500/12 font-medium text-[#EDEFF5]'
                      : 'text-slate-400 hover:bg-white/4 hover:text-[#EDEFF5]'
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

      {/* Logout */}
      <div className="border-t border-pink-500/12 px-3 py-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition duration-150 ease-out hover:bg-white/4 hover:text-pink-400"
        >
          <LogOut size={17} aria-hidden="true" />
          Logout
        </button>
      </div>
    </aside>
  )
}
