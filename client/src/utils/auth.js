const TOKEN_KEY = 'bw_token'
const PLAYER_KEY = 'bw_player'

export const getToken = () => localStorage.getItem(TOKEN_KEY)

export const getPlayer = () => {
  try { return JSON.parse(localStorage.getItem(PLAYER_KEY)) }
  catch { return null }
}

export const saveSession = (token, player) => {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(PLAYER_KEY, JSON.stringify(player))
}

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(PLAYER_KEY)
}

export const isAuthenticated = () => Boolean(getToken())
