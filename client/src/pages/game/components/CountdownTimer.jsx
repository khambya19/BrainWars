import { useEffect, useState } from 'react'

export default function CountdownTimer({ startTime, timeLimit, onExpire }) {
  const [remaining, setRemaining] = useState(timeLimit)

  useEffect(() => {
    const tick = () => {
      const elapsed = (Date.now() - startTime) / 1000
      const left    = Math.max(0, timeLimit - elapsed)
      setRemaining(left)
      if (left <= 0) onExpire?.()
    }

    tick()
    const id = setInterval(tick, 100)
    return () => clearInterval(id)
  }, [startTime, timeLimit, onExpire])

  const pct      = (remaining / timeLimit) * 100
  const danger   = remaining <= timeLimit * 0.3
  const color    = danger ? '#FF5A4E' : remaining <= timeLimit * 0.6 ? '#f59e0b' : '#c6ff3d'
  const radius   = 28
  const circ     = 2 * Math.PI * radius
  const dash     = (pct / 100) * circ

  return (
    <div className="relative flex items-center justify-center">
      <svg width="72" height="72" className="-rotate-90">
        <circle cx="36" cy="36" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
        <circle
          cx="36" cy="36" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.1s linear, stroke 0.3s' }}
        />
      </svg>
      <span
        className="absolute font-['JetBrains_Mono'] text-xl font-bold"
        style={{ color }}
      >
        {Math.ceil(remaining)}
      </span>
    </div>
  )
}
