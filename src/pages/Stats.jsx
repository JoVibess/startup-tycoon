import { useAuth, useUser } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'
import { decodeJwt, getTokenLifetimeSeconds } from '../lib/jwtDebug'

function Stats() {
  const { getToken } = useAuth()
  const { user } = useUser()
  const [tokenInfo, setTokenInfo] = useState(null)
  const [tokenError, setTokenError] = useState('')
  const [games, setGames] = useState([])
  const [gamesLoading, setGamesLoading] = useState(true)
  const [gamesError, setGamesError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadMyGames() {
      try {
        setGamesLoading(true)
        setGamesError('')

        const token = await getToken()
        if (!token) {
          throw new Error('Token Clerk introuvable')
        }

        const response = await fetch('http://localhost:3000/api/games/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`Erreur API: ${response.status}`)
        }

        const data = await response.json()
        if (isMounted) {
          setGames(Array.isArray(data.games) ? data.games : [])
        }
      } catch (error) {
        if (isMounted) {
          setGamesError(error instanceof Error ? error.message : 'Erreur inconnue')
        }
      } finally {
        if (isMounted) {
          setGamesLoading(false)
        }
      }
    }

    loadMyGames()

    return () => {
      isMounted = false
    }
  }, [getToken])

  async function inspectToken() {
    try {
      setTokenError('')
      const token = await getToken()
      const decoded = decodeJwt(token)
      const lifetime = getTokenLifetimeSeconds(decoded?.payload)

      console.log('TP13 Clerk token:', token)
      console.log('TP13 Clerk token decoded:', decoded)

      setTokenInfo({
        hasToken: Boolean(token),
        alg: decoded?.header?.alg || 'inconnu',
        sub: decoded?.payload?.sub || 'inconnu',
        iss: decoded?.payload?.iss || 'inconnu',
        lifetime,
      })
    } catch (error) {
      setTokenInfo(null)
      setTokenError(error instanceof Error ? error.message : 'Erreur inconnue')
    }
  }

  return (
    <main className="stats-page">
      <h1>Statistiques</h1>
      <p>
        Historique personnel de {user?.firstName || user?.username || 'ton compte'}.
      </p>

      <section className="auth-investigation" aria-label="Historique API">
        <h2>Historique API (/api/games/me)</h2>
        {gamesLoading ? <p>Chargement...</p> : null}
        {gamesError ? <p className="auth-investigation-error">Erreur API: {gamesError}</p> : null}
        {!gamesLoading && !gamesError ? <p>Parties recuperees: {games.length}</p> : null}
      </section>

      <section className="auth-investigation" aria-label="Investigation Clerk TP13">
        <h2>Investigation Clerk (TP13 Partie 2)</h2>
        <p>Clique pour récupérer un token Clerk et afficher un résumé.</p>

        <button className="mode-button mode-button-primary" type="button" onClick={inspectToken}>
          Inspecter mon token
        </button>

        {tokenInfo ? (
          <ul className="auth-investigation-list">
            <li>Token present: {tokenInfo.hasToken ? 'oui' : 'non'}</li>
            <li>Algorithme (header.alg): {tokenInfo.alg}</li>
            <li>Subject (payload.sub): {tokenInfo.sub}</li>
            <li>Issuer (payload.iss): {tokenInfo.iss}</li>
            <li>Duree de vie (exp - iat): {tokenInfo.lifetime ?? 'inconnue'} sec</li>
          </ul>
        ) : null}

        {tokenError ? (
          <p className="auth-investigation-error">Erreur token: {tokenError}</p>
        ) : null}

        <p className="auth-help">
          Le token complet et sa version decodee sont aussi logges dans la console navigateur.
        </p>
      </section>
    </main>
  )
}

export default Stats
