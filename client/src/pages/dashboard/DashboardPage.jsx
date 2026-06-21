import MiniLeaderboard from './components/MiniLeaderboard.jsx'
import QuickJoin from './components/QuickJoin.jsx'
import RecentMatches from './components/RecentMatches.jsx'
import StatsGrid from './components/StatsGrid.jsx'
import WelcomeBanner from './components/WelcomeBanner.jsx'

export default function DashboardPage() {
  return (
    <div>
      <WelcomeBanner />
      <StatsGrid />

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <QuickJoin />
        <MiniLeaderboard />
      </div>

      <div className="mt-4">
        <RecentMatches />
      </div>
    </div>
  )
}
