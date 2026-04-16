import { useEffect } from 'react'
import { useGameStore } from '../state/useGameStore'

function GameTick() {
  const tick = useGameStore((state) => state.tick)

  useEffect(() => {
    const tickId = setInterval(() => {
      tick()
    }, 1000)

    return () => {
      clearInterval(tickId)
    }
  }, [tick])

  return null
}

export default GameTick
