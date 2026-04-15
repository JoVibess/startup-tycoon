import { useState } from 'react'
import ClickButton from '../components/ClickButton'
import GameHeader from '../components/GameHeader'

function Game() {
  const [money, setMoney] = useState(0)
  const [clickValue] = useState(1)
  const income = 0

  function handleDevelopClick() {
    setMoney((currentMoney) => currentMoney + clickValue)
  }

  return (
    <main className="game-page">
      <GameHeader money={money} income={income} />

      <section className="game-clicker" aria-label="Action principale">
        <p>
          Clique pour développer ta startup.
        </p>

        <ClickButton clickValue={clickValue} onClick={handleDevelopClick} />
      </section>
    </main>
  )
}

export default Game
