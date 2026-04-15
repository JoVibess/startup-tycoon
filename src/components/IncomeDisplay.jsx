import { formatNumber } from '../utils/formatNumber'

function IncomeDisplay({ income }) {
  return (
    <p className="income-display">
      <span>Income:</span>
      <strong>${formatNumber(income)} / sec</strong>
    </p>
  )
}

export default IncomeDisplay
