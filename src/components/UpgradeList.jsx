import { useMemo } from 'react'
import UpgradeCard from './UpgradeCard'
import { useGameStore } from '../state/useGameStore'
import { getUpgradeCost } from '../utils/getUpgradeCost'

function UpgradeList({ searchQuery }) {
  const money = useGameStore((state) => state.money)
  const upgrades = useGameStore((state) => state.upgrades)
  const buyUpgrade = useGameStore((state) => state.buyUpgrade)
  const filteredUpgrades = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    if (!normalizedQuery) {
      return upgrades
    }

    return upgrades.filter((upgrade) =>
      upgrade.name.toLowerCase().includes(normalizedQuery),
    )
  }, [searchQuery, upgrades])

  if (filteredUpgrades.length === 0) {
    return (
      <p className="upgrade-empty">
        Aucun upgrade ne correspond a ta recherche.
      </p>
    )
  }

  return (
    <section className="upgrade-list" aria-label="Liste des upgrades">
      {filteredUpgrades.map((upgrade) => {
        const currentCost = getUpgradeCost(upgrade.baseCost, upgrade.count)
        const canBuy = money >= currentCost

        return (
          <UpgradeCard
            key={upgrade.id}
            id={upgrade.id}
            name={upgrade.name}
            description={upgrade.description}
            count={upgrade.count}
            cost={currentCost}
            gain={upgrade.incomePerSecondGain}
            canBuy={canBuy}
            missingMoney={canBuy ? 0 : currentCost - money}
            onBuy={buyUpgrade}
          />
        )
      })}
    </section>
  )
}

export default UpgradeList
