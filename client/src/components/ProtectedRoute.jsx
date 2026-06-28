import { Navigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext.jsx'

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-void">
      <div className="grid place-items-center gap-4 text-center">
        <span className="animate-pulse grid h-14 w-14 place-items-center rounded-2xl border border-pink-500/35 bg-pink-500/10 font-orbitron text-lg tracking-[0.08em] text-text">
          BW
        </span>
        <p className="text-sm text-slate-500">Verifying session…</p>
      </div>
    </div>
  )
}

export default function ProtectedRoute({ children }) {
  const { player, loading } = useAuth()

  if (loading) return <LoadingScreen />
  if (!player) return <Navigate to="/login" replace />

  return children
}
