import { clearSession, getToken } from '../utils/auth.js'

export async function apiFetch(path, options = {}) {
  const token = getToken()

  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (response.status === 401) {
    clearSession()
    window.location.replace('/login')
    throw new Error('Session expired. Please log in again.')
  }

  return response
}
