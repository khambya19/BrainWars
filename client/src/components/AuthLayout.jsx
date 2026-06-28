import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'

import Button from './Button.jsx'

const highlights = [
  'HP system — wrong answers drain your health bar',
  'Speed scoring — fastest answer earns bonus points',
  'Live leaderboard — real-time rank updates for the room',
]

const navAction = {
  login:    { label: "Don't have an account?", buttonLabel: 'Register', to: '/register' },
  register: { label: 'Already have an account?', buttonLabel: 'Login',    to: '/login'    },
}

export default function AuthLayout({ children, mode }) {
  const action = navAction[mode]

  return (
    <div
      className="relative min-h-screen bg-void bg-gradient-auth text-text"
    >
      <div
        aria-hidden="true"
        className="bg-grid pointer-events-none fixed inset-0 opacity-[0.15]"
        style={{
          maskImage: 'linear-gradient(180deg,rgba(0,0,0,0.9),transparent 100%)',
          WebkitMaskImage: 'linear-gradient(180deg,rgba(0,0,0,0.9),transparent 100%)',
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col">

        <header className="shrink-0 border-b border-pink-500/12 bg-void/80 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-295 items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <Link
              to="/"
              className="inline-flex items-center gap-3 transition duration-150 ease-out hover:opacity-80"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-pink-500/35 bg-pink-500/10 font-orbitron text-sm tracking-[0.06em]">
                BW
              </span>
              <span className="grid gap-0.5">
                <strong className="font-orbitron text-[0.95rem] leading-none tracking-[-0.04em]">
                  BrainWars
                </strong>
                <span className="hidden text-xs text-slate-400 sm:block">Live quiz arena</span>
              </span>
            </Link>

            <nav className="flex items-center gap-3" aria-label="Auth navigation">
              {action ? (
                <>
                  <span className="hidden text-sm text-slate-500 md:block">{action.label}</span>
                  <Link to={action.to}>
                    <Button variant="secondary" className="text-sm">
                      {action.buttonLabel}
                    </Button>
                  </Link>
                </>
              ) : null}
            </nav>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-295 flex-1 flex-col lg:flex-row">

          {/* Left branding panel */}
          <aside className="hidden shrink-0 lg:flex lg:w-96 xl:w-110 flex-col border-r border-pink-500/12 bg-sidebar/60">
            <div className="sticky top-0 flex h-screen flex-col px-6 py-12 xl:px-8">
              <div className="flex flex-1 flex-col justify-center gap-8">
                <div className="grid gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-pink-400">
                    Live quiz battles
                  </p>
                  <h2 className="font-orbitron text-[1.9rem] leading-[1.05] tracking-[-0.04em] text-text xl:text-[2.2rem]">
                    Quiz faster.<br />Score higher.<br />Win live.
                  </h2>
                  <p className="max-w-[32ch] text-sm leading-7 text-slate-400">
                    Join thousands of players competing in real-time quiz tournaments with HP,
                    speed scoring, and live leaderboards.
                  </p>
                </div>

                <ul className="grid gap-3">
                  {highlights.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-400">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-400">
                        <Check size={11} aria-hidden="true" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-xs text-slate-600">
                © {new Date().getFullYear()} BrainWars. All rights reserved.
              </p>
            </div>
          </aside>

          {/* Right form panel */}
          <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8 lg:px-10">
            <div className="animate-fade-in w-full max-w-115">
              {children}
            </div>
          </main>

        </div>
      </div>
    </div>
  )
}
