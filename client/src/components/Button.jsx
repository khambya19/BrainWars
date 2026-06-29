// This component renders a reusable styled button.

const variantClassNames = {
  primary:
    'border border-pink-500/45 bg-pink-500 text-white shadow-[0_0_0_1px_rgba(255,61,129,0.14)] hover:-translate-y-0.5 hover:bg-pink-400',
  secondary:
    'border border-pink-500/20 bg-slate-800/90 text-white hover:-translate-y-0.5 hover:bg-slate-700/90',
  ghost:
    'border border-transparent bg-transparent text-slate-400 hover:-translate-y-0.5 hover:bg-pink-500/10 hover:text-white',
}

export default function Button({
  children,
  className = '',
  type = 'button',
  variant = 'primary',
  ...props
}) {
  const resolvedVariant = variantClassNames[variant] ?? variantClassNames.primary
  const resolvedClassName = [resolvedVariant, className].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      className={[
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-bold transition duration-150 ease-out active:translate-y-px disabled:cursor-progress disabled:opacity-60',
        resolvedClassName,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}
