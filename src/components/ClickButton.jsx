import clickerLogo from '../assets/logo-auto-clicker.png'
import { formatNumber } from '../utils/formatNumber'

function ClickButton({ clickValue, onClick }) {
  return (
    <button className="click-button" type="button" onClick={onClick}>
      <img src={clickerLogo} alt="" aria-hidden="true" />
      <span>Développer</span>
      <small>+{formatNumber(clickValue)}$ / clic</small>
    </button>
  )
}

export default ClickButton
