const stats = [
  { value: '10K+', label: 'Players joined' },
  { value: '50K+', label: 'Matches played' },
  { value: '99ms', label: 'Avg latency' },
  { value: '4-digit', label: 'Room code entry' },
]

export default function StatsStrip() {
  return (
    <div className="animate-fade-in-up my-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-pink-500/15 bg-pink-500/8 sm:grid-cols-4">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="grid gap-1 bg-[#0B0F1A] px-5 py-7 text-center"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <span className="font-['Orbitron'] text-[clamp(1.5rem,4vw,2rem)] leading-none tracking-[-0.04em] text-[#EDEFF5]">
            {stat.value}
          </span>
          <span className="text-sm text-slate-400">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}
