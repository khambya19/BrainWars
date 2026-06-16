import { forwardRef, useId, useState } from 'react'
import { Check, Eye, EyeOff, X } from 'lucide-react'

const Input = forwardRef(function Input(
  { className = '', error, success, id, label, type = 'text', ...props },
  ref,
) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = error ? `${inputId}-error` : undefined

  const isPassword = type === 'password'
  const [showPassword, setShowPassword] = useState(false)
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type

  const hasStatusIcon = error || success
  const paddingRight = isPassword && hasStatusIcon ? 'pr-16' : 'pr-10'

  const borderClass = error
    ? 'border-[#FF5A4E]/70 focus:border-[#FF5A4E] focus:ring-[#FF5A4E]/15'
    : success
      ? 'border-lime-400/70 focus:border-lime-400 focus:ring-lime-400/15'
      : 'border-pink-500/18 focus:border-pink-500/80 focus:ring-pink-500/12'

  return (
    <label className={['grid gap-1.5', className].filter(Boolean).join(' ')} htmlFor={inputId}>
      <span className="text-sm text-slate-400">{label}</span>
      <div className={error ? 'animate-shake' : ''}>
        <div className="relative">
          <input
            {...props}
            ref={ref}
            id={inputId}
            type={resolvedType}
            className={[
              'min-h-12 w-full rounded-2xl border bg-[#0B0F1A]/75 px-4 text-[#EDEFF5] outline-none transition-all duration-200 ease-out placeholder:text-slate-500 focus:ring-4',
              paddingRight,
              borderClass,
            ].join(' ')}
            aria-invalid={Boolean(error)}
            aria-describedby={errorId}
          />

          <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
            {isPassword ? (
              <button
                type="button"
                className="pointer-events-auto text-slate-400 transition duration-150 hover:text-pink-400"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword
                  ? <EyeOff size={16} aria-hidden="true" />
                  : <Eye size={16} aria-hidden="true" />}
              </button>
            ) : null}

            {hasStatusIcon ? (
              <span className="transition-all duration-200">
                {error
                  ? <X size={16} className="shrink-0 text-[#FF5A4E]" aria-hidden="true" />
                  : <Check size={16} className="shrink-0 text-lime-400" aria-hidden="true" />}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {error ? (
        <span id={errorId} className="text-xs text-[#FF5A4E]" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  )
})

export default Input
