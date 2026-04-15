import ClickButton from '../components/ClickButton'
import GameHeader from '../components/GameHeader'
import { useGameStore } from '../state/useGameStore'

function Game() {
  const money = useGameStore((state) => state.money)
  const clickValue = useGameStore((state) => state.clickValue)
  const incomePerSecond = useGameStore((state) => state.incomePerSecond)
  const click = useGameStore((state) => state.click)

  return (
    <main className="game-page">
      <GameHeader money={money} incomePerSecond={incomePerSecond} />

      <section className="game-clicker" aria-label="Action principale">
        <p>
          Clique pour développer ta startup.
        </p>

        <ClickButton
          clickValue={clickValue}
          onClick={click}
        />
      </section>
    </main>
  )
}

export default Game
