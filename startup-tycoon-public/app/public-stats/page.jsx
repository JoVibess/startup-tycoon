import fs from 'node:fs/promises'
import path from 'node:path'

async function getPublicStats() {
  const filePath = path.join(process.cwd(), 'data', 'public-stats.json')
  const fileContent = await fs.readFile(filePath, 'utf8')

  return JSON.parse(fileContent)
}

export default async function PublicStatsPage() {
  const publicStats = await getPublicStats()

  return (
    <main className="page-shell">
      <div className="page-wrap">
        <header className="page-header">
          <p className="eyebrow">Public Page</p>
          <h1>Startup Tycoon - Public Stats</h1>
          <p>Vue publique minimale des statistiques principales du jeu.</p>
        </header>

        <section aria-label="Public stats" className="stats-list">
          <article className="stats-card">
            <p>Total earned</p>
            <strong>{publicStats.totalEarned}</strong>
          </article>

          <article className="stats-card">
            <p>Total clicks</p>
            <strong>{publicStats.totalClicks}</strong>
          </article>

          <article className="stats-card">
            <p>Income/sec actuel</p>
            <strong>{publicStats.currentIncomePerSecond}</strong>
          </article>
        </section>
      </div>
    </main>
  )
}
