function MissingClerkKey() {
  return (
    <div style={{ padding: '32px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <h1>Clerk non configure</h1>
      <p>Ajoute VITE_CLERK_PUBLISHABLE_KEY dans .env.local pour activer l'authentification.</p>
    </div>
  )
}

export default MissingClerkKey
