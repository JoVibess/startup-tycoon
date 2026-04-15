import UpgradeCard from '../components/UpgradeCard'
import { formatNumber } from '../utils/formatNumber'
import { getUpgradeCost } from '../utils/getUpgradeCost'

function Shop({ money, incomePerSecond, upgrades, message, onBuyUpgrade }) {
  return (
    <main className="shop-page">
      <header className="shop-header">
        <p className="eyebrow">Investissements</p>
        <h1>Boutique</h1>
        <p>Ameliore ta startup avec des upgrades de revenu passif.</p>

        <div className="shop-stats" aria-label="Etat actuel">
          <span>Money: ${formatNumber(money)}</span>
          <span>Income/sec: ${formatNumber(incomePerSecond)}</span>
        </div>

        {message ? <p className="shop-feedback">{message}</p> : null}
      </header>

      <section className="upgrade-list" aria-label="Liste des upgrades">
        {upgrades.map((upgrade) => {
          const currentCost = getUpgradeCost(upgrade.baseCost, upgrade.count)
          const canBuy = money >= currentCost
          const missingMoney = currentCost - money

          return (
            <UpgradeCard
              key={upgrade.id}
              name={upgrade.name}
              description={upgrade.description}
              count={upgrade.count}
              cost={currentCost}
              gain={upgrade.incomePerSecondGain}
              canBuy={canBuy}
              missingMoney={missingMoney}
              onBuy={() => onBuyUpgrade(upgrade.id)}
            />
          )
        })}
      </section>
    </main>
  )
}

export default Shop
