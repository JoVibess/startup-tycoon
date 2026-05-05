import { SignInButton, SignedIn, SignedOut, useAuth } from '@clerk/clerk-react'
import ClickButton from '../components/ClickButton'
import GameHeader from '../components/GameHeader'
import { useGameStore } from '../state/useGameStore'

function Game() {
  const { isSignedIn } = useAuth()
  const money = useGameStore((state) => state.money)
  const clickValue = useGameStore((state) => state.clickValue)
  const incomePerSecond = useGameStore((state) => state.incomePerSecond)
  const click = useGameStore((state) => state.click)

  return (
    <main className="game-page">
      <GameHeader money={money} incomePerSecond={incomePerSecond} />

      <section className="game-clicker" aria-label="Action principale">
        <div className="game-intro">
          <p>Clique pour développer ta startup.</p>

          <div className="game-mode-actions" aria-label="Choix du mode de jeu">
            <button className="mode-button mode-button-primary" type="button">
              Partie solo
            </button>
            <button
              className="mode-button"
              type="button"
              disabled={!isSignedIn}
              title={
                !isSignedIn
                  ? 'Creez un compte pour jouer en multijoueur'
                  : 'Mode multi bientot disponible'
              }
            >
              Partie multi
            </button>
          </div>

          <SignedOut>
            <SignInButton mode="redirect">
              <button className="game-sign-in-button" type="button">
                Se connecter
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <p className="auth-help">Connecte. Le mode multi peut etre active.</p>
          </SignedIn>
        </div>

        <ClickButton
          clickValue={clickValue}
          onClick={click}
        />
      </section>
    </main>
  )
}

export default Game
