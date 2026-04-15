import { formatNumber } from '../utils/formatNumber'

function MoneyDisplay({ money }) {
  return (
    <p className="money-display" aria-live="polite">
      <span>Money:</span>
      <strong>${formatNumber(money)}</strong>
    </p>
  )
}

export default MoneyDisplay
