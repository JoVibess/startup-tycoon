import { formatNumber } from '../utils/formatNumber'

function UpgradeCard({
  name,
  description,
  count,
  cost,
  gain,
  canBuy,
  missingMoney,
  onBuy,
}) {
  return (
    <article
      className={
        canBuy
          ? 'upgrade-card upgrade-card-affordable'
          : 'upgrade-card upgrade-card-locked'
      }
    >
      <div>
        <h2>{name}</h2>
        <p>{description}</p>
      </div>

      <dl className="upgrade-details">
        <div>
          <dt>Possede</dt>
          <dd>{count}</dd>
        </div>
        <div>
          <dt>Cout actuel</dt>
          <dd>${formatNumber(cost)}</dd>
        </div>
        <div>
          <dt>Gain</dt>
          <dd>+${formatNumber(gain)}/sec</dd>
        </div>
      </dl>

      <button type="button" disabled={!canBuy} onClick={onBuy}>
        {canBuy ? `Acheter - $${formatNumber(cost)}` : 'Fonds insuffisants'}
      </button>

      {!canBuy ? (
        <p className="upgrade-warning">Il manque ${formatNumber(missingMoney)}</p>
      ) : null}
    </article>
  )
}

export default UpgradeCard
