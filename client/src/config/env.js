/**
 * Central environment configuration for the BrainWars client.
 * Reads all import.meta.env.VITE_* values once and exports a typed config object.
 * Every other client file should import from here instead of reading
 * import.meta.env directly.
 */

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5050'

// DAILY_BONUS_AMOUNT is display-only text — the server is the source of truth for the
// actual amount. Keep this in sync with server/config/gameConfig.js → DAILY_BONUS_AMOUNT.
// If the server returns a live value via /api/config, that overrides this at runtime.
const DAILY_BONUS_AMOUNT = Number(import.meta.env.VITE_DAILY_BONUS_AMOUNT) || 20

if (import.meta.env.DEV && !import.meta.env.VITE_API_URL) {
  console.warn('[BrainWars] VITE_API_URL is not set — defaulting to http://localhost:5050')
}

const clientEnv = { API_URL, DAILY_BONUS_AMOUNT }

export default clientEnv
