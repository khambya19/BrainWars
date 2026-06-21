import { BookOpen, LayoutDashboard, Settings, Swords, Trophy, User } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Home',    to: '/dashboard',            icon: LayoutDashboard, end: true },
  { label: 'Play',    to: '/dashboard/play',        icon: Swords                     },
  { label: 'Banks',   to: '/dashboard/banks',       icon: BookOpen                   },
  { label: 'Board',   to: '/dashboard/leaderboard', icon: Trophy                     },
  { label: 'Profile', to: '/dashboard/profile',     icon: User                       },
]

export default function MobileNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-pink-500/12 bg-[#0d1220]/95 backdrop-blur-md lg:hidden"
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
      </ul>
    </nav>
  )
}
