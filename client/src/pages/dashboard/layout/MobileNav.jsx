import { BookOpen, LayoutDashboard, Swords, Trophy, User, Volume2, VolumeX } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useMute } from '../../../hooks/useMute.js'

const navItems = [
  { label: 'Home',    to: '/dashboard',            icon: LayoutDashboard, end: true },
  { label: 'Play',    to: '/dashboard/play',        icon: Swords                     },
  { label: 'Banks',   to: '/dashboard/banks',       icon: BookOpen                   },
  { label: 'Board',   to: '/dashboard/leaderboard', icon: Trophy                     },
  { label: 'Profile', to: '/dashboard/profile',     icon: User                       },
]

export default function MobileNav() {
  const { muted, toggle } = useMute()
  const MuteIcon = muted ? VolumeX : Volume2

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-pink-500/12 bg-sidebar/95 backdrop-blur-md lg:hidden"
      aria-label="Mobile navigation"
    >
      <ul className="flex">
        {navItems.map(({ label, to, icon: Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-3 text-[0.6rem] font-medium uppercase tracking-wider transition duration-150 ${
                  isActive ? 'text-pink-400' : 'text-slate-500 hover:text-slate-300'
                }`
              }
            >
              <Icon size={20} aria-hidden="true" />
              {label}
            </NavLink>
          </li>
        ))}

        {/* Mute toggle */}
        <li className="flex-1">
          <button
            type="button"
            onClick={toggle}
            aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
            className="flex w-full flex-col items-center gap-1 py-3 text-[0.6rem] font-medium uppercase tracking-wider text-slate-500 transition duration-150 hover:text-slate-300"
          >
            <MuteIcon size={20} aria-hidden="true" />
            {muted ? 'Muted' : 'Sound'}
          </button>
        </li>
      </ul>
    </nav>
  )
}
