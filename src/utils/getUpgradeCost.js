export function getUpgradeCost(baseCost, count) {
  return Math.round(baseCost * 1.15 ** count)
}
