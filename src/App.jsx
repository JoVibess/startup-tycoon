import { useCallback, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import { initialUpgrades } from './data/upgrades'
import Game from './pages/Game'
import Shop from './pages/Shop'
import Stats from './pages/Stats'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import { getUpgradeCost } from './utils/getUpgradeCost'

function App() {
  const [money, setMoney] = useState(0)
  const [clickValue] = useState(1)
  const [incomePerSecond, setIncomePerSecond] = useState(0)
  const [upgrades, setUpgrades] = useState(() =>
    initialUpgrades.map((upgrade) => ({ ...upgrade })),
  )
  const [shopMessage, setShopMessage] = useState('')

  const handlePassiveIncomeTick = useCallback(() => {
    setMoney((currentMoney) => currentMoney + incomePerSecond)
  }, [incomePerSecond])

  function handleDevelopClick() {
    setMoney((currentMoney) => currentMoney + clickValue)
  }

  function handleAddIncomePerSecond() {
    setIncomePerSecond((currentIncome) => currentIncome + 1)
  }

  function handleResetIncomePerSecond() {
    setIncomePerSecond(0)
  }

  function handleBuyUpgrade(upgradeId) {
    const upgradeToBuy = upgrades.find((upgrade) => upgrade.id === upgradeId)

    if (!upgradeToBuy) {
      return
    }

    const currentCost = getUpgradeCost(
      upgradeToBuy.baseCost,
      upgradeToBuy.count,
    )

    if (money < currentCost) {
      setShopMessage(`Fonds insuffisants pour ${upgradeToBuy.name}.`)
      return
    }

    setMoney((currentMoney) => currentMoney - currentCost)
    setIncomePerSecond(
      (currentIncome) => currentIncome + upgradeToBuy.incomePerSecondGain,
    )
    setUpgrades((currentUpgrades) =>
      currentUpgrades.map((upgrade) =>
        upgrade.id === upgradeId
          ? { ...upgrade, count: upgrade.count + 1 }
          : upgrade,
      ),
    )
    setShopMessage(`${upgradeToBuy.name} achete.`)
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <Game
                money={money}
                clickValue={clickValue}
                incomePerSecond={incomePerSecond}
                onDevelopClick={handleDevelopClick}
                onPassiveIncomeTick={handlePassiveIncomeTick}
                onAddIncomePerSecond={handleAddIncomePerSecond}
                onResetIncomePerSecond={handleResetIncomePerSecond}
              />
            }
          />
          <Route
            path="/shop"
            element={
              <Shop
                money={money}
                incomePerSecond={incomePerSecond}
                upgrades={upgrades}
                message={shopMessage}
                onBuyUpgrade={handleBuyUpgrade}
              />
            }
          />
          <Route path="/stats" element={<Stats />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
