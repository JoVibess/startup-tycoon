import { formatNumber } from '../utils/formatNumber'

function IncomeDisplay({ incomePerSecond }) {
  return (
    <p className="income-display">
      <span>Income/sec:</span>
      <strong>${formatNumber(incomePerSecond)}</strong>
    </p>
  )
}

export default IncomeDisplay
