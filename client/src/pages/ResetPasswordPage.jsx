import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

// This page handles password reset flow UI.

function getPasswordStrength(pw) {
  if (!pw) return null
  let score = 0
  if (pw.length >= 8)           score++
  if (pw.length >= 12)          score++
  if (/[A-Z]/.test(pw))        score++
  if (/[0-9]/.test(pw))        score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 2) return 'weak'
  if (score <= 3) return 'fair'
  if (score <= 4) return 'good'
  return 'strong'
}

const STRENGTH_CONFIG = {
  weak:   { bars: 1, color: 'bg-danger', label: 'Too weak',  text: 'text-danger' },
  fair:   { bars: 2, color: 'bg-amber-400',  label: 'Fair',      text: 'text-amber-400'  },
  good:   { bars: 3, color: 'bg-yellow-300', label: 'Good',      text: 'text-yellow-300' },
  strong: { bars: 4, color: 'bg-lime-400',   label: 'Strong',    text: 'text-lime-400'   },
}

function validatePasswordRules(pw) {
  if (!pw || pw.length < 8) return 'Password must be at least 8 characters.'
  if (!/[A-Z]/.test(pw))    return 'Password must contain at least one uppercase letter.'
  if (!/[0-9]/.test(pw))    return 'Password must contain at least one number.'
  return null
}

export default function ResetPasswordPage() {
  const { token } = useParams()
  const navigate  = useNavigate()

  const [password, setPassword]     = useState('')
  const [confirm, setConfirm]       = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState(null)
  const [done, setDone]             = useState(false)

  const strength = getPasswordStrength(password)
  const strengthCfg = strength ? STRENGTH_CONFIG[strength] : null

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    const ruleError = validatePasswordRules(password)
    if (ruleError) { setError(ruleError); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }

    setSubmitting(true)
    try {
      const res = await fetch(`/api/auth/reset-password/${token}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message ?? 'Reset failed.')
      } else {
        setDone(true)
        setTimeout(() => navigate('/login'), 3000)
      }
    } catch (err) {
      console.error('[BrainWars/ResetPassword] Request failed:', err)
      setError('Request failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-void px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-pink-400">BrainWars</p>
          <h1 className="font-orbitron text-2xl leading-none tracking-[-0.04em] text-text">
            Reset password
          </h1>
        </div>

        {done ? (
          <div className="rounded-2xl border border-lime-400/20 bg-lime-400/8 p-6 text-center">
            <p className="text-sm font-medium text-lime-400">Password reset successfully.</p>
            <p className="mt-1 text-xs text-slate-400">Redirecting to login…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-2xl border border-pink-500/15 bg-panel/85 p-6">
            <div className="grid gap-3">
              <div className="grid gap-1.5">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password (8+ chars, 1 uppercase, 1 number)"
                  required
                  className="min-h-11 rounded-xl border border-pink-500/20 bg-void/60 px-4 text-sm text-text placeholder:text-slate-600 outline-none focus:border-pink-500/50"
                />
                {strengthCfg && (
                  <div className="grid gap-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((bar) => (
                        <div key={bar} className={`h-1 flex-1 rounded-full transition-all duration-300 ${bar <= strengthCfg.bars ? strengthCfg.color : 'bg-white/10'}`} />
                      ))}
                    </div>
                    <p className={`text-xs ${strengthCfg.text}`}>{strengthCfg.label}</p>
                  </div>
                )}
              </div>

              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirm new password"
                required
                className="min-h-11 rounded-xl border border-pink-500/20 bg-void/60 px-4 text-sm text-text placeholder:text-slate-600 outline-none focus:border-pink-500/50"
              />

              {error && (
                <p className="rounded-lg border border-danger/20 bg-danger/8 px-3 py-2 text-xs text-danger">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="min-h-11 rounded-xl border border-pink-500/40 bg-pink-500 font-bold text-white transition hover:bg-pink-400 disabled:opacity-50"
              >
                {submitting ? 'Resetting…' : 'Reset password'}
              </button>
            </div>
          </form>
        )}

        <p className="mt-4 text-center text-xs text-slate-500">
          <Link to="/login" className="text-pink-400 transition hover:text-pink-300">Back to login</Link>
        </p>
      </div>
    </div>
  )
}
