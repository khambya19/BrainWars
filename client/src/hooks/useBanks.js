import { useEffect, useState } from 'react'
import { apiFetch } from '../api/client.js'

export function useBanks() {
  const [banks, setBanks]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  function refresh() {
    setLoading(true)
    apiFetch('/api/banks')
      .then((r) => r.json())
      .then((data) => { setBanks(data); setError(null) })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { refresh() }, [])

  return { banks, setBanks, loading, error, refresh }
}
