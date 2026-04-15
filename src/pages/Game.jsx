import { useEffect } from 'react'
import ClickButton from '../components/ClickButton'
import GameHeader from '../components/GameHeader'

function Game({
  money,
  clickValue,
  incomePerSecond,
  onDevelopClick,
  onPassiveIncomeTick,
  onAddIncomePerSecond,
  onResetIncomePerSecond,
}) {
  useEffect(() => {
    const tickId = setInterval(() => {
      onPassiveIncomeTick()
    }, 1000)

    return () => {
      clearInterval(tickId)
    }
  }, [onPassiveIncomeTick])

  return (
    <main className="game-page">
      <GameHeader money={money} incomePerSecond={incomePerSecond} />

      <section className="game-clicker" aria-label="Action principale">
        <p>
          Clique pour développer ta startup.
        </p>

        <ClickButton clickValue={clickValue} onClick={onDevelopClick} />

        <div className="test-actions" aria-label="Tests du revenu passif">
          <button type="button" onClick={onAddIncomePerSecond}>
            +1 income/sec
          </button>
          <button type="button" onClick={onResetIncomePerSecond}>
            Reset income/sec
          </button>
        </div>
      </section>
    </main>
  )
}

export default Game
