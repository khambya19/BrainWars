export default function AnswerOption({ label, onClick, disabled, status }) {
  const base = 'w-full rounded-2xl border px-5 py-4 text-left text-sm font-medium transition-all duration-200 focus:outline-none'

  const styles = {
    idle:     `${base} border-pink-500/20 bg-[#141B2E]/85 text-[#EDEFF5] hover:-translate-y-0.5 hover:border-pink-500/50 hover:bg-pink-500/10 active:translate-y-0`,
    selected: `${base} border-pink-500/60 bg-pink-500/20 text-[#EDEFF5] scale-[0.99]`,
    correct:  `${base} border-lime-400/60 bg-lime-400/15 text-lime-300`,
    wrong:    `${base} border-[#FF5A4E]/60 bg-[#FF5A4E]/15 text-[#FF5A4E] line-through opacity-60`,
    disabled: `${base} border-pink-500/10 bg-[#141B2E]/40 text-slate-500 cursor-not-allowed`,
  }

  return (
    <button
      type="button"
      className={styles[status] ?? styles.idle}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={status === 'selected'}
    >
      {label}
    </button>
  )
}
