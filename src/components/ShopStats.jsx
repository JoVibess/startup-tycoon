import { useGameStore } from '../state/useGameStore'
import { formatNumber } from '../utils/formatNumber'

function ShopStats() {
  const money = useGameStore((state) => state.money)
  const incomePerSecond = useGameStore((state) => state.incomePerSecond)

  return (
    <div className="shop-stats" aria-label="Etat actuel">
      <span>Money: ${formatNumber(money)}</span>
      <span>Income/sec: ${formatNumber(incomePerSecond)}</span>
    </div>
  )
}

export default ShopStats
