import { createContext, useCallback, useContext, useEffect, useState } from 'react'

import { apiFetch } from '../api/client.js'
import { clearSession, getToken, saveSession } from '../utils/auth.js'

// This context provides authentication state and actions.

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [player, setPlayer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()

    if (!token) {
      setLoading(false)
      return
    }

    apiFetch('/api/auth/me')
      .then((r) => {
        if (!r.ok) {
          clearSession()
          setPlayer(null)
          return
        }
        return r.json().then((data) => setPlayer(data))
      })
      .catch((err) => {
        console.error('[BrainWars/AuthContext] Failed to restore session:', err)
        clearSession()
        setPlayer(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const refreshPlayer = useCallback(async () => {
    try {
      const r = await apiFetch('/api/auth/me')
      if (!r.ok) return null
      const data = await r.json()
      setPlayer(data)
      return data
    } catch (err) {
      console.error('[BrainWars/AuthContext] Failed to refresh player:', err)
      return null
    }
  }, [])

  function login(token, playerData) {
    saveSession(token, playerData)
    setPlayer(playerData)
  }

  function logout() {
    clearSession()
    setPlayer(null)
  }

  return (
    <AuthContext.Provider value={{ player, loading, login, logout, refreshPlayer }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
