import { Link } from 'react-router-dom'

import Button from './Button.jsx'

export default function CTASection() {
  return (
    <section className="animate-fade-in-up relative my-6 overflow-hidden rounded-3xl border border-pink-500/20 bg-panel px-6 py-14 text-center md:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        className="bg-gradient-cta"
      />

      <div className="relative">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-pink-400">
          Ready to battle?
        </p>
        <h2 className="mx-auto max-w-[14ch] font-orbitron text-[clamp(2rem,6vw,3.5rem)] leading-none tracking-[-0.04em] text-text">
          Your next win is one room code away.
        </h2>
        <p className="mx-auto mt-4 max-w-[50ch] text-[1.02rem] leading-7 text-slate-400">
          Join thousands of players already battling in real-time quiz tournaments. No downloads, just a code.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link to="/register">
            <Button variant="primary">Play Now — it's free</Button>
          </Link>
          <a
            className="inline-flex min-h-11 items-center px-1 text-text transition duration-150 ease-out hover:-translate-y-px hover:text-pink-400"
            href="#how-it-works"
          >
            See how it works
          </a>
        </div>
      </div>
    </section>
  )
}
