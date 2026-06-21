import { createContext, useContext } from 'react'
import { useGameSocket } from '../hooks/useGameSocket.js'

const GameSocketContext = createContext(null)

export function GameSocketProvider({ children }) {
  const gameSocket = useGameSocket()
  return (
    <GameSocketContext.Provider value={gameSocket}>
      {children}
    </GameSocketContext.Provider>
  )
}

export function useGameSocketContext() {
  const ctx = useContext(GameSocketContext)
  if (!ctx) throw new Error('useGameSocketContext must be used inside GameSocketProvider')
  return ctx
}
