import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="page-shell">
      <div className="page-wrap">
        <header className="page-header">
          <p className="eyebrow">Next.js Public App</p>
          <h1>Startup Tycoon Public</h1>
          <p>
            Mini projet separe pour exposer une page SSR/SSG sans migrer le jeu
            principal.
          </p>
        </header>

        <Link className="primary-link" href="/public-stats">
          Ouvrir Public Stats
        </Link>
      </div>
    </main>
  )
}
