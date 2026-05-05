import { SignIn, useAuth } from '@clerk/clerk-react'
import { Navigate, useLocation } from 'react-router-dom'

function SignInPage() {
  const { isLoaded, isSignedIn } = useAuth()
  const location = useLocation()
  const redirectTo = location.state?.from || '/'

  if (isLoaded && isSignedIn) {
    return <Navigate to={redirectTo} replace />
  }

  return (
    <main className="sign-in-page">
      <h1>Connexion</h1>
      <p>Connecte-toi pour acceder au multi et a tes statistiques.</p>

      <div className="sign-in-shell">
        <SignIn routing="path" path="/sign-in" fallbackRedirectUrl={redirectTo} />
      </div>
    </main>
  )
}

export default SignInPage
