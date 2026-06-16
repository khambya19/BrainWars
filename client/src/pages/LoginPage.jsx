import { CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import AuthLayout from '../components/AuthLayout.jsx'
import ForgotPasswordForm from '../components/ForgotPasswordForm.jsx'
import LoginForm from '../components/LoginForm.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { state } = useLocation()
  const justRegistered = state?.justRegistered ?? false
  const prefillEmail = state?.email ?? ''

  const [showForgot, setShowForgot] = useState(false)

  function handleSuccess(payload) {
    login(payload.token, payload.player)
    navigate('/dashboard')
  }

  return (
    <AuthLayout mode="login">
      <div className="rounded-3xl border border-pink-500/18 bg-[#141B2E]/95 p-6 shadow-[0_0_0_1px_rgba(255,61,129,0.08)] sm:p-8">
        {justRegistered && !showForgot ? (
          <div className="animate-fade-in-down mb-5 flex items-start gap-3 rounded-2xl border border-lime-400/25 bg-lime-400/8 p-4">
            <CheckCircle size={18} className="mt-0.5 shrink-0 text-lime-400" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-lime-400">Account created!</p>
              <p className="mt-0.5 text-xs text-slate-400">Sign in below to start playing.</p>
            </div>
          </div>
        ) : null}

        {showForgot ? (
          <>
            <div className="mb-6">
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-pink-400">
                Password reset
              </p>
              <h1 className="font-['Orbitron'] text-[clamp(1.6rem,4vw,2.2rem)] leading-none tracking-[-0.04em] text-[#EDEFF5]">
                Forgot your password?
              </h1>
            </div>
            <ForgotPasswordForm onBackToLogin={() => setShowForgot(false)} />
          </>
        ) : (
          <>
            <div className="mb-6">
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-pink-400">
                {justRegistered ? 'One more step' : 'Welcome back'}
              </p>
              <h1 className="font-['Orbitron'] text-[clamp(1.6rem,4vw,2.2rem)] leading-none tracking-[-0.04em] text-[#EDEFF5]">
                {justRegistered ? 'Sign in to play.' : 'Sign in to BrainWars'}
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {justRegistered
                  ? 'Your account is ready — enter your password to jump in.'
                  : 'Jump back into live tournaments and keep your streak alive.'}
              </p>
            </div>

            <LoginForm
              onSuccess={handleSuccess}
              onForgotPassword={() => setShowForgot(true)}
              defaultEmail={prefillEmail}
            />

            <p className="mt-6 text-center text-sm text-slate-400">
              No account yet?{' '}
              <Link
                to="/register"
                className="font-medium text-[#EDEFF5] underline underline-offset-4 transition duration-150 hover:text-pink-400"
              >
                Create one free
              </Link>
            </p>
          </>
        )}
      </div>
    </AuthLayout>
  )
}
