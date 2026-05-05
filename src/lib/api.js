const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

function buildApiUrl(path) {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${normalizedPath}`
}

async function getClerkToken() {
  const clerk = window.Clerk
  if (!clerk || !clerk.session) {
    return null
  }

  try {
    return await clerk.session.getToken()
  } catch {
    return null
  }
}

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }

  const text = await response.text()
  return text ? { message: text } : null
}

export async function apiFetch(path, options = {}) {
  const {
    method = 'GET',
    body,
    headers = {},
    auth = true,
    signal,
  } = options

  const requestHeaders = { ...headers }
  let requestBody = body

  if (auth) {
    const token = await getClerkToken()
    if (!token) {
      window.location.assign('/sign-in')
      throw new Error('User is not authenticated')
    }

    requestHeaders.Authorization = `Bearer ${token}`
  }

  if (body !== undefined && body !== null && !(body instanceof FormData)) {
    requestHeaders['Content-Type'] = requestHeaders['Content-Type'] || 'application/json'
    requestBody = typeof body === 'string' ? body : JSON.stringify(body)
  }

  const response = await fetch(buildApiUrl(path), {
    method,
    headers: requestHeaders,
    body: requestBody,
    signal,
  })

  const data = await parseResponse(response)

  if (response.status === 401) {
    window.location.assign('/sign-in')
    throw new Error('Unauthorized')
  }

  if (!response.ok) {
    const errorMessage = data?.error || data?.message || `HTTP ${response.status}`
    throw new Error(errorMessage)
  }

  return data
}
