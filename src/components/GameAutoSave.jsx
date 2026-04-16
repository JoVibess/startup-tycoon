import { useEffect } from 'react'
import { saveGameState } from '../services/gameSave'
import { useGameStore } from '../state/useGameStore'

const AUTO_SAVE_INTERVAL_MS = 5000

function GameAutoSave() {
  useEffect(() => {
    const saveId = setInterval(() => {
      saveGameState(useGameStore.getState())
    }, AUTO_SAVE_INTERVAL_MS)

    return () => {
      clearInterval(saveId)
    }
  }, [])

  return null
}

export default GameAutoSave
