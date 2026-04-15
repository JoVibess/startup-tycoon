import IncomeDisplay from './IncomeDisplay'
import MoneyDisplay from './MoneyDisplay'

function GameHeader({ money, income }) {
  return (
    <header className="game-header">
      <div>
        <p className="eyebrow">Auto clicker</p>
        <h1>Startup Tycoon</h1>
      </div>

      <div className="game-stats" aria-label="Statistiques de la partie">
        <MoneyDisplay money={money} />
        <IncomeDisplay income={income} />
      </div>
    </header>
  )
}

export default GameHeader
