import { Plus, Share2, Zap } from 'lucide-react'

// This component explains how the product flow works.

const steps = [
  {
    number: '01',
    title: 'Create a room',
    description: 'The host picks categories, sets the time limit, and launches the tournament in seconds.',
    icon: Plus,
  },
  {
    number: '02',
    title: 'Share the code',
    description: 'Players join from any device using the 4-character room code. No downloads needed.',
    icon: Share2,
  },
  {
    number: '03',
    title: 'Battle live',
    description: 'Answer fast to earn bonus points. Wrong answers drain HP. Last one standing wins.',
    icon: Zap,
  },
]

export default function HowItWorks() {
  return (
    <section className="py-10 md:py-14" id="how-it-works">
      <div className="animate-fade-in-up mb-8 md:mb-10">
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-pink-400">How it works</p>
        <h2 className="font-orbitron text-[clamp(2rem,5vw,3.4rem)] leading-none tracking-[-0.04em] text-text">
          Up and battling in three steps.
        </h2>
      </div>

      <div className="grid gap-px overflow-hidden rounded-3xl border border-pink-500/15 bg-pink-500/8 md:grid-cols-3">
        {steps.map((step, i) => {
          const Icon = step.icon
          return (
            <article
              key={step.number}
              className="animate-fade-in-up grid gap-5 bg-void p-6 transition duration-200 hover:bg-sidebar md:p-8"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-2xl border border-pink-500/25 bg-pink-500/10 text-pink-400">
                  <Icon size={20} aria-hidden="true" />
                </div>
                <span className="select-none font-data text-[2.8rem] leading-none text-white/5">
                  {step.number}
                </span>
              </div>
              <div>
                <h3 className="font-orbitron text-[1.1rem] leading-snug tracking-[-0.03em] text-text">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{step.description}</p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
