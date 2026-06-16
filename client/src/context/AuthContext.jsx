import { createContext, useContext, useEffect, useState } from 'react'

import { apiFetch } from '../api/client.js'
import { clearSession, getToken, saveSession } from '../utils/auth.js'

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
      .then((r) => r.json())
      .then((data) => {
        setPlayer(data)
      })
      .catch(() => {
        clearSession()
        setPlayer(null)
      })
      .finally(() => {
        setLoading(false)
      })
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
    <AuthContext.Provider value={{ player, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
