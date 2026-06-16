import { useState } from 'react'
import { z } from 'zod'

import Button from './Button.jsx'
import Input from './Input.jsx'
import { parseResponse } from '../utils/api.js'

const schema = z.object({
  email: z
    .string()
    .min(1, 'Email is required.')
    .email('Enter a valid email address.'),
  password: z
    .string()
    .min(1, 'Password is required.')
    .min(8, 'Password must be at least 8 characters.'),
})


export default function LoginForm({ onSuccess, onForgotPassword, defaultEmail = '' }) {
  const [values, setValues] = useState({ email: defaultEmail, password: '' })
  const [touched, setTouched] = useState({ email: Boolean(defaultEmail), password: false })
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const result = schema.safeParse(values)
  const fieldErrors = result.success
    ? {}
    : Object.fromEntries(
        result.error.issues.map((e) => [e.path[0], e.message])
      )

  function getFieldState(field) {
    if (!touched[field] || !values[field]) return {}
    return fieldErrors[field]
      ? { error: fieldErrors[field] }
      : { success: true }
  }

  function handleChange(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }))
    setServerError('')
  }

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setTouched({ email: true, password: true })

    if (!result.success) return

    setLoading(true)
    setServerError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const payload = await parseResponse(response, 'Login failed. Please try again.')
      onSuccess?.(payload)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        inputMode="email"
        placeholder="you@example.com"
        value={values.email}
        {...getFieldState('email')}
        onChange={(e) => handleChange('email', e.target.value)}
        onBlur={() => handleBlur('email')}
      />

      <div className="grid gap-1">
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={values.password}
          {...getFieldState('password')}
          onChange={(e) => handleChange('password', e.target.value)}
          onBlur={() => handleBlur('password')}
        />
        <button
          type="button"
          className="justify-self-end text-xs text-slate-400 transition duration-150 hover:text-pink-400"
          onClick={onForgotPassword}
        >
          Forgot password?
        </button>
      </div>

      {serverError ? (
        <p className="text-sm text-[#FF5A4E]" role="alert">{serverError}</p>
      ) : null}

      <Button type="submit" variant="primary" className="w-full" disabled={loading}>
        {loading ? 'Signing in...' : 'Login'}
      </Button>
    </form>
  )
}
