export default function AnswerOption({ label, letter, onClick, disabled, status }) {
  const base = 'w-full rounded-2xl border px-5 py-4 text-left text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-signal/60 focus-visible:ring-offset-2 focus-visible:ring-offset-void flex items-center gap-3'

  const styles = {
    idle:     `${base} border-pink-500/20 bg-panel/85 text-text hover:-translate-y-0.5 hover:border-pink-500/50 hover:bg-pink-500/10 active:translate-y-0`,
    selected: `${base} border-pink-500/60 bg-pink-500/20 text-text scale-[0.99]`,
    correct:  `${base} border-lime-400/60 bg-lime-400/15 text-lime-300`,
    wrong:    `${base} border-danger/60 bg-danger/15 text-danger line-through opacity-60`,
    disabled: `${base} border-pink-500/10 bg-panel/40 text-slate-500 cursor-not-allowed`,
  }

  const letterStyles = {
    idle:     'border-pink-500/25 bg-pink-500/10 text-pink-400',
    selected: 'border-pink-500/50 bg-pink-500/30 text-pink-300',
    correct:  'border-lime-400/50 bg-lime-400/20 text-lime-300',
    wrong:    'border-danger/50 bg-danger/20 text-danger',
    disabled: 'border-white/8 bg-white/5 text-slate-600',
  }

  return (
    <button
      type="button"
      className={styles[status] ?? styles.idle}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={status === 'selected'}
    >
      {letter && (
        <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg border font-data text-xs font-bold ${letterStyles[status] ?? letterStyles.idle}`}>
          {letter}
        </span>
      )}
      <span>{label}</span>
    </button>
  )
}
