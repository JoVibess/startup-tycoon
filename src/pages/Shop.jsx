import ShopStats from '../components/ShopStats'
import UpgradeList from '../components/UpgradeList'

function Shop() {
  return (
    <main className="shop-page">
      <header className="shop-header">
        <p className="eyebrow">Investissements</p>
        <h1>Boutique</h1>
        <p>Ameliore ta startup avec des upgrades de revenu passif.</p>

        <ShopStats />
      </header>

      <UpgradeList />
    </main>
  )
}

export default Shop
