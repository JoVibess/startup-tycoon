import { initialUpgrades } from '../data/upgrades'
import { getUpgradeCost } from '../utils/getUpgradeCost'

function Shop() {
  return (
    <main className="shop-page">
      <header className="shop-header">
        <p className="eyebrow">Investissements</p>
        <h1>Boutique</h1>
        <p>Ameliore ta startup avec des upgrades de revenu passif.</p>
      </header>

      <section className="upgrade-list" aria-label="Liste des upgrades">
        {initialUpgrades.map((upgrade) => {
          const currentCost = getUpgradeCost(upgrade.baseCost, upgrade.count)

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
                  <dd>${currentCost}</dd>
                </div>
                <div>
                  <dt>Gain</dt>
                  <dd>+${upgrade.incomePerSecondGain}/sec</dd>
                </div>
              </dl>

              <button type="button">Acheter</button>
            </article>
          )
        })}
      </section>
    </main>
  )
}

export default Shop
