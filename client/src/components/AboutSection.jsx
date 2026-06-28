import { BarChart3, Heart, LayoutGrid, Zap } from 'lucide-react'

const features = [
  {
    title: 'HP system',
    copy: 'Wrong answers hit your health bar and keep every round tense till the last second.',
    icon: Heart,
    accent: 'text-pink-400',
    border: 'hover:border-pink-500/40',
  },
  {
    title: 'Speed scoring',
    copy: 'Fast answers earn bonus points that reward clutch reaction time under real pressure.',
    icon: Zap,
    accent: 'text-amber-400',
    border: 'hover:border-amber-400/40',
  },
  {
    title: 'Live leaderboard',
    copy: 'Scores and ranks update in real time so the whole room feels the pressure together.',
    icon: BarChart3,
    accent: 'text-lime-400',
    border: 'hover:border-lime-400/40',
  },
  {
    title: 'Question categories',
    copy: 'Mix subjects, rounds, and difficulty modes to craft the perfect game session.',
    icon: LayoutGrid,
    accent: 'text-sky-400',
    border: 'hover:border-sky-400/40',
  },
]

export default function AboutSection() {
  return (
    <section className="py-10 md:py-14" id="about">
      <div className="animate-fade-in-up mb-8 md:mb-10">
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-pink-400">What is BrainWars?</p>
        <h2 className="font-orbitron text-[clamp(2rem,5vw,3.4rem)] leading-none tracking-[-0.04em] text-text">
          A live multiplayer quiz arena for everyone.
        </h2>
        <p className="mt-4 max-w-[66ch] leading-7 text-slate-400">
          Hosts launch a tournament, players join with a room code, and everyone competes on one
          shared battlefield with HP, streaks, and live score pressure.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" id="features">
        {features.map((feature, i) => {
          const Icon = feature.icon
          return (
            <article
              key={feature.title}
              className={`animate-fade-in-up grid gap-4 rounded-2xl border border-pink-500/15 bg-panel/85 p-5 transition duration-200 hover:-translate-y-1 hover:bg-panel ${feature.border}`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`grid h-10 w-10 place-items-center rounded-xl border border-pink-500/15 bg-void ${feature.accent}`}>
                <Icon size={18} aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-orbitron text-[1.05rem] leading-snug tracking-[-0.03em] text-text">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{feature.copy}</p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
