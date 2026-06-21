import { useAuth } from '../../../context/AuthContext.jsx'

export default function WelcomeBanner() {
  const { player } = useAuth()

  return (
    <div className="animate-fade-in-up mb-8">
      <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-pink-400">
        Dashboard
      </p>
      <h1 className="font-['Orbitron'] text-[clamp(1.8rem,4vw,2.8rem)] leading-none tracking-[-0.04em] text-[#EDEFF5]">
        Welcome back, {player?.name ?? 'Player'}.
      </h1>
      <p className="mt-2 text-sm text-slate-400">
        Ready to battle? Game rooms and live tournaments are coming soon.
      </p>
    </div>
  )
}
