import { clearSession, getToken } from '../utils/auth.js'
import { apiFetch as requestApi } from '../utils/api.js'

let isRefreshing = false
let refreshQueue = [] // pending requests waiting for the new token

function drainQueue(newToken, error) {
  refreshQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(newToken)
  )
  refreshQueue = []
}

async function attemptRefresh() {
  if (isRefreshing) {
    // Queue this call until the in-flight refresh completes
    return new Promise((resolve, reject) => {
      refreshQueue.push({ resolve, reject })
    })
  }

  isRefreshing = true
  try {
    const res = await requestApi('/api/auth/refresh', {
      method: 'POST',
    })
    if (!res.ok) throw new Error('Refresh failed')

    const { token } = await res.json()
    localStorage.setItem('bw_token', token)
    drainQueue(token, null)
    return token
  } catch (err) {
    drainQueue(null, err)
    clearSession()
    window.location.replace('/login')
    throw err
  } finally {
    isRefreshing = false
  }
}

export async function apiFetch(path, options = {}) {
  const token = getToken()

  const makeRequest = (t) =>
    requestApi(path, {
      ...options,
      headers: {
        ...(t ? { Authorization: `Bearer ${t}` } : {}),
        ...options.headers,
      },
    })

  let response = await makeRequest(token)

  if (response.status === 401 && path !== '/api/auth/refresh') {
    // Token likely expired — try to refresh once
    try {
      const newToken = await attemptRefresh()
      response = await makeRequest(newToken)
    } catch {
      // attemptRefresh already redirected to /login
      throw new Error('Session expired. Please log in again.')
    }
  }

  return response
}
