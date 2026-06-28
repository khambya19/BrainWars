import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'

import ProtectedRoute from './components/ProtectedRoute.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { GameSocketProvider } from './context/GameSocketContext.jsx'
import GamePage from './pages/game/GamePage.jsx'
import DashboardLayout from './pages/dashboard/layout/DashboardLayout.jsx'
import DashboardPage from './pages/dashboard/DashboardPage.jsx'
import BanksPage from './pages/dashboard/BanksPage.jsx'
import LeaderboardPage from './pages/dashboard/LeaderboardPage.jsx'
import PlayPage from './pages/dashboard/PlayPage.jsx'
import ProfilePage from './pages/dashboard/ProfilePage.jsx'
import SettingsPage from './pages/dashboard/SettingsPage.jsx'
import Home from './pages/Home.jsx'
import LoginPage from './pages/LoginPage.jsx'
import PrivacyPage from './pages/PrivacyPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import ResetPasswordPage from './pages/ResetPasswordPage.jsx'
import TermsPage from './pages/TermsPage.jsx'

function ProtectedWithSocket() {
  return (
    <ProtectedRoute>
      <GameSocketProvider>
        <Outlet />
      </GameSocketProvider>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />

          {/* Protected — dashboard + game share ONE socket instance */}
          <Route element={<ProtectedWithSocket />}>
            <Route path="/game" element={<GamePage />} />

            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="play" element={<PlayPage />} />
              <Route path="banks" element={<BanksPage />} />
              <Route path="leaderboard" element={<LeaderboardPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
