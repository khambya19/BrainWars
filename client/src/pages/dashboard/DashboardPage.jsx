import { useAuth } from '../../context/AuthContext.jsx'
import DashboardNav from './components/DashboardNav.jsx'
import HostRoomCard from './components/HostRoomCard.jsx'
import JoinRoomCard from './components/JoinRoomCard.jsx'
import RecentMatches from './components/RecentMatches.jsx'
import StatsGrid from './components/StatsGrid.jsx'

export default function DashboardPage() {
  const { player } = useAuth()

  return (
    <div
      className="relative min-h-screen bg-[#0B0F1A] text-[#EDEFF5]"
      style={{
        backgroundImage:
          'radial-gradient(circle at top, rgba(255,61,129,0.10), transparent 30%), radial-gradient(circle at 80% 80%, rgba(198,255,61,0.05), transparent 40%)',
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        <DashboardNav />

        <main className="mx-auto w-full max-w-295 flex-1 px-4 py-10 sm:px-6">
          <div className="animate-fade-in-up mb-8">
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-pink-400">
              Dashboard
            </p>
            <h1 className="font-['Orbitron'] text-[clamp(1.8rem,4vw,2.8rem)] leading-none tracking-[-0.04em] text-[#EDEFF5]">
              Welcome back, {player?.name ?? 'Player'}.
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Game rooms and live tournaments are coming soon.
            </p>
          </div>

          <div className="grid gap-6">
            <StatsGrid />

            <div className="grid gap-4 md:grid-cols-2">
              <JoinRoomCard />
              <HostRoomCard />
            </div>

            <RecentMatches />
          </div>
        </main>
      </div>
    </div>
  )
}
