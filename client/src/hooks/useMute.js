import { useEffect, useState } from 'react'
import { getMuted, MUTE_EVENT, toggleMuted } from '../utils/sounds.js'

export function useMute() {
  const [muted, setMuted] = useState(getMuted)

  useEffect(() => {
    const sync = () => setMuted(getMuted())
    window.addEventListener(MUTE_EVENT, sync)
    return () => window.removeEventListener(MUTE_EVENT, sync)
  }, [])

  return { muted, toggle: toggleMuted }
}
