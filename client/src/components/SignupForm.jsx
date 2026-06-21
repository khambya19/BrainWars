import { useState } from 'react'
import { z } from 'zod'

import Button from './Button.jsx'
import Input from './Input.jsx'
import { parseResponse } from '../utils/api.js'
import { useFormValidation } from '../hooks/useFormValidation.js'

const schema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required.')
      .min(2, 'Name must be at least 2 characters.')
      .max(60, 'Name must be 60 characters or less.'),
    email: z
      .string()
      .min(1, 'Email is required.')
      .email('Enter a valid email address.'),
    password: z
      .string()
      .min(1, 'Password is required.')
      .min(8, 'Password must be at least 8 characters.')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter.')
      .regex(/[0-9]/, 'Must contain at least one number.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })


function getStrength(password) {
  if (!password) return null
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  if (score <= 2) return 'weak'
  if (score <= 3) return 'fair'
  if (score <= 4) return 'good'
  return 'strong'
}

const strengthConfig = {
  weak:   { bars: 1, color: 'bg-[#FF5A4E]', label: 'Too weak',  text: 'text-[#FF5A4E]' },
  fair:   { bars: 2, color: 'bg-amber-400',  label: 'Fair',      text: 'text-amber-400' },
  good:   { bars: 3, color: 'bg-yellow-300', label: 'Good',      text: 'text-yellow-300' },
  strong: { bars: 4, color: 'bg-lime-400',   label: 'Strong',    text: 'text-lime-400' },
}

export default function SignupForm({ onSuccess }) {
  const [values, setValues] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [touched, setTouched] = useState({ name: false, email: false, password: false, confirmPassword: false })
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const { isValid, getFieldState } = useFormValidation(schema, values, touched)

  function handleChange(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }))
    setServerError('')
  }

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setTouched({ name: true, email: true, password: true, confirmPassword: true })

    if (!isValid) return

    setLoading(true)
    setServerError('')

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      })
      const payload = await parseResponse(response, 'Signup failed. Please try again.')
      onSuccess?.(payload)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Signup failed.')
    } finally {
      setLoading(false)
    }
  }

  const strength = getStrength(values.password)
  const cfg = strength ? strengthConfig[strength] : null

  return (
    <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
      <Input
        label="Name"
        autoComplete="name"
        placeholder="Alex Rivera"
        value={values.name}
        {...getFieldState('name')}
        onChange={(e) => handleChange('name', e.target.value)}
        onBlur={() => handleBlur('name')}
      />

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

      <div className="grid gap-2">
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="Min. 8 chars, 1 uppercase, 1 number"
          value={values.password}
          {...getFieldState('password')}
          onChange={(e) => handleChange('password', e.target.value)}
          onBlur={() => handleBlur('password')}
        />

        {cfg ? (
          <div className="grid gap-1.5">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={[
                    'h-1 flex-1 rounded-full transition-all duration-300',
                    bar <= cfg.bars ? cfg.color : 'bg-white/10',
                  ].join(' ')}
                />
              ))}
            </div>
            <p className={`text-xs ${cfg.text}`}>{cfg.label}</p>
          </div>
        ) : null}
      </div>

      <Input
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        placeholder="Re-enter your password"
        value={values.confirmPassword}
        {...getFieldState('confirmPassword')}
        onChange={(e) => handleChange('confirmPassword', e.target.value)}
        onBlur={() => handleBlur('confirmPassword')}
      />

      {serverError ? (
        <p className="text-sm text-[#FF5A4E]" role="alert">{serverError}</p>
      ) : null}

      <Button type="submit" variant="primary" className="w-full" disabled={loading}>
        {loading ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  )
}
