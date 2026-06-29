import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import Button from './Button.jsx'

// This component shows the homepage hero section.

const EMPTY_STATS = [
  { label: 'Players live', value: '–' },
  { label: 'Avg response', value: '–' },
  { label: 'Top streak', value: '–' },
]

export default function Hero() {
  const [stats, setStats] = useState(EMPTY_STATS)
  const [leaderboard, setLeaderboard] = useState([])
  const [liveRoom, setLiveRoom] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    fetch('/api/stats', { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        setStats([
          { label: 'Players live', value: data.playersLive ?? '–' },
          { label: 'Avg response', value: data.avgResponse ?? '–' },
          { label: 'Top streak', value: data.topStreak ?? '–' },
        ])
        setLeaderboard(data.leaderboard ?? [])
        setLiveRoom(data.liveRoom ?? null)
      })
      .catch((err) => {
        if (err?.name !== 'AbortError') {
          console.error('[BrainWars/Hero] Failed to fetch live stats:', err)
        }
      })

    return () => controller.abort()
  }, [])

  return (
    <section className="grid gap-6 py-8 md:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] md:items-center md:py-10" id="home">
      <div className="grid gap-4">
        <p className="animate-fade-in-up text-sm font-bold uppercase tracking-[0.18em] text-pink-400">
          Live quiz battles
        </p>
        <h1
          className="animate-fade-in-up max-w-[11ch] font-orbitron text-[clamp(2.75rem,9vw,5.8rem)] leading-[0.94] tracking-[-0.04em] text-text delay-100"
        >
          Quiz tournaments with HP, speed, and a live scoreboard.
        </h1>
        <p
          className="animate-fade-in-up max-w-[58ch] text-[1.02rem] leading-7 text-slate-400 delay-200"
        >
          BrainWars turns every question into a real-time duel for lobbies of up to a hundred
          players, with score pressure that feels like an esports broadcast.
        </p>

        <div
          className="animate-fade-in-up mt-2 flex flex-wrap items-center gap-3 delay-300"
        >
          <Link to="/register">
            <Button variant="primary">Play Now</Button>
          </Link>
          <a
            className="inline-flex min-h-11 items-center px-1 text-text transition duration-150 ease-out hover:-translate-y-px hover:text-pink-400"
            href="#about"
          >
            See how it works
          </a>
        </div>

        <div className="mt-2 grid gap-3 sm:grid-cols-3" aria-label="Live match stats">
          {stats.map((stat, i) => (
            <article
              key={stat.label}
              className="animate-fade-in-up rounded-2xl border border-pink-500/15 bg-panel/85 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-pink-500/30"
              style={{ animationDelay: `${400 + i * 100}ms` }}
            >
              <span className="mb-2 block text-sm text-slate-400">{stat.label}</span>
              <strong className="font-data text-[1.4rem] text-text drop-shadow-[0_0_14px_rgba(255,61,129,0.2)]">
                {stat.value}
              </strong>
            </article>
          ))}
        </div>
      </div>

      <div
        className="animate-fade-in-right animate-float grid"
        aria-label="Live tournament preview"
      >
        <div className="rounded-3xl border border-pink-500/18 bg-panel/88 p-5 shadow-[0_0_0_1px_rgba(255,61,129,0.1)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Tournament room</p>
              <h2 className="mt-1 font-orbitron text-[clamp(2.4rem,8vw,4rem)] leading-none tracking-[-0.04em] text-text">
                {liveRoom ?? '—'}
              </h2>
            </div>
            {liveRoom ? (
              <span className="inline-flex min-h-8 items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/12 px-3 text-[0.78rem] font-data tracking-[0.12em] text-text">
                <span className="animate-pulse-dot h-2 w-2 rounded-full bg-pink-400" />
                LIVE
              </span>
            ) : (
              <span className="inline-flex min-h-8 items-center rounded-full border border-white/10 bg-white/5 px-3 text-[0.78rem] font-data tracking-[0.12em] text-slate-500">
                IDLE
              </span>
            )}
          </div>

          {leaderboard.length > 0 ? (
            <>
              <div className="my-4 h-3 overflow-hidden rounded-full bg-white/5" aria-hidden="true">
                <span className="block h-full w-[68%] rounded-full bg-linear-to-r from-pink-500 to-lime-300 shadow-[0_0_18px_rgba(255,61,129,0.24)]" />
              </div>
              <div className="grid gap-3">
                {leaderboard.map((player, index) => (
                  <article
                    key={`${player.name}-${index}`}
                    className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-pink-500/8 py-3 last:border-b-0 last:pb-0"
                  >
                    <div className="font-data text-[1rem] text-text drop-shadow-[0_0_14px_rgba(255,61,129,0.2)]">
                      0{index + 1}
                    </div>
                    <div>
                      <strong className="block text-text">{player.name}</strong>
                      <p className="mt-0.5 text-sm text-slate-400">HP {player.hp}</p>
                    </div>
                    <div className="font-data text-[1rem] text-text drop-shadow-[0_0_14px_rgba(255,61,129,0.2)]">
                      {player.score}
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <p className="mt-6 text-center text-sm text-slate-500">No live game right now</p>
          )}
        </div>
      </div>
    </section>
  )
}
