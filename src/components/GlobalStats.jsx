import { useGameStore } from '../state/useGameStore'
import { formatNumber } from '../utils/formatNumber'

function GlobalStats() {
  const money = useGameStore((state) => state.money)
  const incomePerSecond = useGameStore((state) => state.incomePerSecond)

  return (
    <div className="global-stats" aria-label="Ressources globales">
      <span>Money: ${formatNumber(money)}</span>
      <span>Income/sec: ${formatNumber(incomePerSecond)}</span>
    </div>
  )
}

export default GlobalStats
