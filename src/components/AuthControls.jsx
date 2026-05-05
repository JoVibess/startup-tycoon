import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/clerk-react'

function AuthControls() {
  return (
    <div className="auth-controls">
      <SignedOut>
        <SignInButton mode="redirect">
          <button className="auth-button" type="button">
            Se connecter
          </button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </div>
  )
}

export default AuthControls
