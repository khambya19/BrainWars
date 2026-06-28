import { useState } from 'react'
import { Mail } from 'lucide-react'

import Button from './Button.jsx'
import Input from './Input.jsx'
import { parseResponse } from '../utils/api.js'

export default function ForgotPasswordForm({ onBackToLogin }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [sent, setSent] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    if (!email.trim()) {
      setEmailError('Email is required.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Enter a valid email address.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      await parseResponse(response, 'Failed to send reset link.')
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset link.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="grid gap-4 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-pink-500/30 bg-pink-500/10">
          <Mail size={24} className="text-pink-400" aria-hidden="true" />
        </div>
        <div>
          <p className="font-bold text-text">Check your inbox</p>
          <p className="mt-1 text-sm text-slate-400">
            A reset link was sent to{' '}
            <span className="text-text">{email}</span>.
          </p>
        </div>
        <Button type="button" variant="ghost" onClick={onBackToLogin}>
          Back to login
        </Button>
      </div>
    )
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <p className="text-sm text-slate-400">
        Enter your account email and we'll send you a link to reset your password.
      </p>

      <Input
        label="Email"
        type="email"
        autoComplete="email"
        inputMode="email"
        placeholder="you@example.com"
        value={email}
        error={emailError}
        onChange={(e) => { setEmail(e.target.value); setEmailError('') }}
      />

      {error ? (
        <p className="text-sm text-danger" role="alert">{error}</p>
      ) : null}

      <Button type="submit" variant="primary" className="w-full" disabled={loading}>
        {loading ? 'Sending...' : 'Send reset link'}
      </Button>

      <Button type="button" variant="ghost" onClick={onBackToLogin}>
        Back to login
      </Button>
    </form>
  )
}
