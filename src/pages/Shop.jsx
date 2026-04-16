import { useState } from 'react'
import ShopStats from '../components/ShopStats'
import UpgradeList from '../components/UpgradeList'
import { useDebouncedValue } from '../hooks/useDebouncedValue'

const SEARCH_DEBOUNCE_MS = 300

function Shop() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebouncedValue(searchTerm, SEARCH_DEBOUNCE_MS)

  return (
    <main className="shop-page">
      <header className="shop-header">
        <p className="eyebrow">Investissements</p>
        <h1>Boutique</h1>
        <p>Ameliore ta startup avec des upgrades de revenu passif.</p>

        <ShopStats />
      </header>

      <label className="shop-search">
        <span>Rechercher un upgrade</span>
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Dev, serveur, marketing..."
        />
      </label>

      <UpgradeList searchQuery={debouncedSearchTerm} />
    </main>
  )
}

export default Shop
