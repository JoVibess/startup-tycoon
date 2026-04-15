import { useEffect, useState } from 'react'
import ClickButton from '../components/ClickButton'
import GameHeader from '../components/GameHeader'

function Game() {
  const [money, setMoney] = useState(0)
  const [clickValue] = useState(1)
  const [incomePerSecond, setIncomePerSecond] = useState(0)

  useEffect(() => {
    const tickId = setInterval(() => {
      setMoney((currentMoney) => currentMoney + incomePerSecond)
    }, 1000)

    return () => {
      clearInterval(tickId)
    }
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

  return (
    <main className="game-page">
      <GameHeader money={money} incomePerSecond={incomePerSecond} />

      <section className="game-clicker" aria-label="Action principale">
        <p>
          Clique pour développer ta startup.
        </p>

        <ClickButton clickValue={clickValue} onClick={handleDevelopClick} />

        <div className="test-actions" aria-label="Tests du revenu passif">
          <button type="button" onClick={handleAddIncomePerSecond}>
            +1 income/sec
          </button>
          <button type="button" onClick={handleResetIncomePerSecond}>
            Reset income/sec
          </button>
        </div>
      </section>
    </main>
  )
}

export default Game
