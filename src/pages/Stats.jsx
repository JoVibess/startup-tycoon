import { useAuth, useUser } from '@clerk/clerk-react'
import { useState } from 'react'
import { useSubmitGame } from '../hooks/useSubmitGame'
import { useMyGames } from '../hooks/useMyGames'
import { decodeJwt, getTokenLifetimeSeconds } from '../lib/jwtDebug'

function Stats() {
  const { getToken } = useAuth()
  const { user } = useUser()
  const [tokenInfo, setTokenInfo] = useState(null)
  const [tokenError, setTokenError] = useState('')
  const { data: games = [], isLoading: gamesLoading, error: gamesError } = useMyGames()
  const submitGameMutation = useSubmitGame()

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

  function submitTestGame() {
    const score = Math.floor(Math.random() * 5000) + 1000
    const displayName =
      user?.fullName ||
      user?.username ||
      user?.primaryEmailAddress?.emailAddress ||
      'Startup Tycoon Player'

    submitGameMutation.mutate({
      payload: {
        mode: 'solo',
        score,
        duration: 300,
        clicks: Math.max(10, Math.floor(score / 4)),
        upgrades: Math.max(1, Math.floor(score / 100)),
        displayName,
      },
      optimistic: {
        userId: user?.id || 'unknown-user',
        displayName,
      },
    })
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
        {gamesError ? <p className="auth-investigation-error">Erreur API: {gamesError.message}</p> : null}
        {!gamesLoading && !gamesError ? <p>Parties recuperees: {games.length}</p> : null}

        <div className="stats-actions">
          <button
            className="mode-button"
            type="button"
            onClick={submitTestGame}
            disabled={submitGameMutation.isPending}
          >
            {submitGameMutation.isPending ? 'Envoi...' : 'Envoyer une partie test'}
          </button>
        </div>

        {submitGameMutation.isSuccess ? <p className="auth-help">Partie test enregistree.</p> : null}
        {submitGameMutation.error ? (
          <p className="auth-investigation-error">
            Echec envoi: {submitGameMutation.error.message}
          </p>
        ) : null}
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
