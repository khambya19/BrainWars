import clientEnv from '../config/env.js'

const API_ORIGIN = clientEnv.API_URL.replace(/\/$/, '')

function resolveApiUrl(path) {
  if (/^https?:\/\//i.test(path)) {
    return path
  }

  return new URL(path, API_ORIGIN).toString()
}

function shouldSetJsonContentType(body) {
  if (body == null) return false
  if (body instanceof FormData) return false
  if (body instanceof URLSearchParams) return false
  if (body instanceof Blob) return false
  if (body instanceof ArrayBuffer) return false
  return true
}

export async function parseResponse(response, fallbackMessage) {
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(payload.message || payload.error || fallbackMessage)
  }
  return payload
}

export async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers || {})

  if (shouldSetJsonContentType(options.body) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  return fetch(resolveApiUrl(path), {
    ...options,
    credentials: 'include',
    headers,
  })
}
