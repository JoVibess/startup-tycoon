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

          return (
            <article className="upgrade-card" key={upgrade.id}>
              <div>
                <h2>{upgrade.name}</h2>
                <p>{upgrade.description}</p>
              </div>

              <dl className="upgrade-details">
                <div>
                  <dt>Possede</dt>
                  <dd>{upgrade.count}</dd>
                </div>
                <div>
                  <dt>Cout actuel</dt>
                  <dd>${formatNumber(currentCost)}</dd>
                </div>
                <div>
                  <dt>Gain</dt>
                  <dd>+${formatNumber(upgrade.incomePerSecondGain)}/sec</dd>
                </div>
              </dl>

              <button
                type="button"
                disabled={!canBuy}
                onClick={() => onBuyUpgrade(upgrade.id)}
              >
                Acheter
              </button>

              {!canBuy ? (
                <p className="upgrade-warning">Fonds insuffisants</p>
              ) : null}
            </article>
          )
        })}
      </section>
    </main>
  )
}

export default Shop
