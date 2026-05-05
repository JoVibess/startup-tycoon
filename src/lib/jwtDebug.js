function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  return atob(padded)
}

export function decodeJwt(token) {
  if (!token || typeof token !== 'string') {
    return null
  }

  const parts = token.split('.')
  if (parts.length !== 3) {
    return null
  }

  try {
    const header = JSON.parse(decodeBase64Url(parts[0]))
    const payload = JSON.parse(decodeBase64Url(parts[1]))
    return { header, payload }
  } catch {
    return null
  }
}

export function getTokenLifetimeSeconds(payload) {
  if (!payload || typeof payload.iat !== 'number' || typeof payload.exp !== 'number') {
    return null
  }

  return payload.exp - payload.iat
}
