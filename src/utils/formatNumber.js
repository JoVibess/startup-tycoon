function trimTrailingZeros(value) {
  return value.replace(/\.?0+$/, '')
}

function formatCompactNumber(value, divisor, suffix) {
  return `${trimTrailingZeros((value / divisor).toFixed(2))}${suffix}`
}

export function formatNumber(value) {
  const absoluteValue = Math.abs(value)

  if (absoluteValue >= 1000000) {
    return formatCompactNumber(value, 1000000, 'M')
  }

  if (absoluteValue >= 1000) {
    return formatCompactNumber(value, 1000, 'K')
  }

  return String(value)
}
