import { useState } from 'react'
import { Link } from 'react-router-dom'

import Button from './Button.jsx'

const navItems = [
  { label: 'Home',         id: 'home'         },
  { label: 'How it works', id: 'how-it-works'  },
  { label: 'Features',     id: 'features'      },
  { label: 'About',        id: 'about'         },
]

function scrollTo(id, onDone) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  onDone?.()
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-3 z-20 mb-6 animate-fade-in-down">
      <div className="flex items-center justify-between gap-4 rounded-[20px] border border-pink-500/18 bg-[#141B2E]/90 px-4 py-4 shadow-[0_0_0_1px_rgba(255,61,129,0.1)] backdrop-blur-md md:px-5">

        <button
          type="button"
          className="inline-flex min-w-0 items-center gap-3"
          onClick={() => scrollTo('home', () => setMenuOpen(false))}
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] border border-pink-500/35 bg-pink-500/10 font-['Orbitron'] tracking-[0.08em] text-[#EDEFF5]" aria-hidden="true">
            BW
          </span>
          <span className="grid min-w-0 gap-0.5 text-left">
            <strong className="font-['Orbitron'] text-[1.05rem] leading-none tracking-[-0.04em]">BrainWars</strong>
            <span className="text-sm text-slate-400">Live quiz tournament arena</span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className="rounded-full px-4 py-2.5 text-sm text-[#EDEFF5] transition duration-150 ease-out hover:-translate-y-px hover:text-pink-400"
              onClick={() => scrollTo(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/register">
            <Button variant="secondary">Signup</Button>
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 flex-col items-center justify-center gap-1 rounded-full border border-pink-500/22 bg-[#141B2E]/90 md:hidden"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className="h-0.5 w-4 rounded-full bg-[#EDEFF5]" />
          <span className="h-0.5 w-4 rounded-full bg-[#EDEFF5]" />
          <span className="h-0.5 w-4 rounded-full bg-[#EDEFF5]" />
        </button>
      </div>

      {menuOpen ? (
        <div className="mt-3 rounded-[20px] border border-pink-500/18 bg-[#141B2E]/90 p-4 shadow-[0_0_0_1px_rgba(255,61,129,0.1)] md:hidden">
          <nav className="grid gap-1" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className="border-b border-pink-500/10 py-3 text-left text-sm text-[#EDEFF5] transition duration-150 ease-out hover:text-pink-400"
                onClick={() => scrollTo(item.id, () => setMenuOpen(false))}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-4 grid gap-2">
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              <Button variant="ghost" className="w-full">Login</Button>
            </Link>
            <Link to="/register" onClick={() => setMenuOpen(false)}>
              <Button variant="primary" className="w-full">Signup</Button>
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  )
}
