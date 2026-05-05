import { useLeaderboard } from '../hooks/useLeaderboard'

function Leaderboard() {
  const { data: entries = [], isLoading, error } = useLeaderboard()

  return (
    <main className="shop-page">
      <header className="shop-header">
        <p className="eyebrow">Classement public</p>
        <h1>Leaderboard</h1>
        <p>Top 20 all-time des meilleures startups.</p>
      </header>

      {isLoading ? <p>Chargement du leaderboard...</p> : null}
      {error ? <p className="auth-investigation-error">Erreur: {error.message}</p> : null}

      {!isLoading && !error ? (
        <section className="leaderboard-list" aria-label="Top 20 all-time">
          {entries.length === 0 ? (
            <p>Aucune entree pour le moment.</p>
          ) : (
            entries.map((entry, index) => (
              <article className="upgrade-card" key={`${entry.user_id}-${index}`}>
                <h3>
                  #{index + 1} {entry.display_name || 'Anonyme'}
                </h3>
                <p>Meilleur score: {entry.best_score}</p>
                <p>Parties: {entry.games_count}</p>
              </article>
            ))
          )}
        </section>
      ) : null}
    </main>
  )
}

export default Leaderboard
