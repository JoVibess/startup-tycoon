import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <main>
      <h1>404 - Page introuvable</h1>
      <p>Cette page n’existe pas.</p>
      <Link to="/">Retour à l’accueil</Link>
    </main>
  )
}

export default NotFound
