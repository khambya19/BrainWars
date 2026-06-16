import { Link, useNavigate } from 'react-router-dom'

import AuthLayout from '../components/AuthLayout.jsx'
import SignupForm from '../components/SignupForm.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  function handleSuccess(payload) {
    login(payload.token, payload.player)
    navigate('/dashboard')
  }

  return (
    <AuthLayout mode="register">
      <div className="rounded-3xl border border-pink-500/18 bg-[#141B2E]/95 p-6 shadow-[0_0_0_1px_rgba(255,61,129,0.08)] sm:p-8">
        <div className="mb-6">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-pink-400">
            Get started — it's free
          </p>
          <h1 className="font-['Orbitron'] text-[clamp(1.6rem,4vw,2.2rem)] leading-none tracking-[-0.04em] text-[#EDEFF5]">
            Create your account
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Pick a name, set a password, and you're in the arena.
          </p>
        </div>

        <SignupForm onSuccess={handleSuccess} />

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-[#EDEFF5] underline underline-offset-4 transition duration-150 hover:text-pink-400"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
