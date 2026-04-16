import UpgradeCard from './UpgradeCard'
import { useGameStore } from '../state/useGameStore'
import { getUpgradeCost } from '../utils/getUpgradeCost'

function UpgradeList() {
  const money = useGameStore((state) => state.money)
  const upgrades = useGameStore((state) => state.upgrades)
  const buyUpgrade = useGameStore((state) => state.buyUpgrade)

  return (
    <section className="upgrade-list" aria-label="Liste des upgrades">
      {upgrades.map((upgrade) => {
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
