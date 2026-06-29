import { useState } from 'react'

// This component shows a streak-related popup message.

// Milestones that trigger the popup. After 10, every multiple of 5.
function isMilestone(streak) {
  if (streak === 3 || streak === 5 || streak === 8) return true
  if (streak >= 10 && streak % 5 === 0) return true
  return false
}

function getStreakText(streak) {
  if (streak >= 10) return { headline: `${streak} in a row!`, sub: 'Unstoppable! 🔥' }
  if (streak >= 8)  return { headline: 'Unstoppable!',        sub: `${streak} correct in a row 🔥` }
  if (streak >= 5)  return { headline: '5 streak!',           sub: 'On fire! 🔥' }
  return             { headline: '3 in a row!',               sub: '🔥' }
}

export default function StreakPopup({ streak }) {
  // Initialize visibility at mount time — RevealState re-mounts per question so
  // this component gets a fresh instance with each new streak value.
  const [visible, setVisible] = useState(() => streak > 1 && isMilestone(streak))

  if (!visible) return null

  const { headline, sub } = getStreakText(streak)

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-[28%] z-50 flex justify-center px-4"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        className="animate-streak-popup rounded-2xl border border-success/35 bg-void/96 px-8 py-5 text-center shadow-[0_0_36px_rgba(198,255,61,0.18)]"
        onAnimationEnd={() => setVisible(false)}
      >
        <p className="font-orbitron text-[1.75rem] font-bold leading-none tracking-[-0.03em] text-success">
          {headline}
        </p>
        <p className="mt-1 font-display text-base font-semibold text-success/75">
          {sub}
        </p>
      </div>
    </div>
  )
}
