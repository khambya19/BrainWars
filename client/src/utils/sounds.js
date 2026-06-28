const SOUND_FILES = {
  correct:     'correct.wav',
  wrong:       'wrong.wav',
  tick:        'tick.wav',
  elimination: 'elimination.wav',
  victory:     'victory.wav',
  click:       'click.mp3',
  join:        'join.wav',
  streak:      'streak.wav',
  countdown:   'countdown.wav',
  promotion:   'promotion.wav',
}

// One Audio element per sound, cloned on each play so rapid/overlapping calls work.
const pool = {}
Object.entries(SOUND_FILES).forEach(([name, file]) => {
  const audio = new Audio(`/sounds/${file}`)
  audio.preload = 'auto'
  audio.addEventListener('error', () => {
    console.error(`[BrainWars/sounds] Failed to load sound asset: /sounds/${file} (key: "${name}"). Add the file to client/public/sounds/.`)
  })
  pool[name] = audio
})

const MUTE_KEY = 'bw_muted'
const MUTE_EVENT = 'bw_mute_change'

export function playSound(name) {
  if (localStorage.getItem(MUTE_KEY) === 'true') return
  const src = pool[name]
  if (!src) return
  const clone = src.cloneNode()
  clone.play().catch((err) => {
    // NotAllowedError is expected before user interaction (browser autoplay policy) — not a bug
    if (err?.name !== 'NotAllowedError') {
      console.error(`[BrainWars/sounds] Unexpected error playing "${name}":`, err)
    }
  })
}

export function getMuted() {
  return localStorage.getItem(MUTE_KEY) === 'true'
}

export function setMuted(value) {
  localStorage.setItem(MUTE_KEY, value ? 'true' : 'false')
  window.dispatchEvent(new Event(MUTE_EVENT))
}

export function toggleMuted() {
  setMuted(!getMuted())
}

export { MUTE_EVENT }
