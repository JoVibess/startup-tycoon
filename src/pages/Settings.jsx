import { useEffect, useState } from 'react'
import { getLastSavedAt } from '../services/gameSave'
import { useGameStore } from '../state/useGameStore'

const LAST_SAVED_REFRESH_MS = 5000

function formatLastSavedAt(savedAt) {
  if (!savedAt) {
    return 'Aucune sauvegarde'
  }

  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(new Date(savedAt))
}

function Settings() {
  const resetSave = useGameStore((state) => state.resetSave)
  const [lastSavedAt, setLastSavedAt] = useState(() => getLastSavedAt())

  useEffect(() => {
    const refreshId = setInterval(() => {
      setLastSavedAt(getLastSavedAt())
    }, LAST_SAVED_REFRESH_MS)

    return () => {
      clearInterval(refreshId)
    }
  }, [])

  function handleResetSave() {
    const shouldReset = window.confirm(
      'Supprimer la sauvegarde et recommencer a zero ?',
    )

    if (!shouldReset) {
      return
    }

    resetSave()
    setLastSavedAt(null)
  }

  return (
    <main className="settings-page">
      <h1>Parametres</h1>
      <p>Configure ton experience de jeu.</p>

      <section className="settings-section" aria-labelledby="save-settings">
        <div>
          <h2 id="save-settings">Sauvegarde</h2>
          <p className="settings-last-saved">
            Derniere sauvegarde : <strong>{formatLastSavedAt(lastSavedAt)}</strong>
          </p>
          <p>
            Efface la sauvegarde locale et remet la partie a zero sur cet
            appareil.
          </p>
        </div>

        <button
          className="settings-danger-button"
          type="button"
          onClick={handleResetSave}
        >
          Reset Save
        </button>
      </section>
    </main>
  )
}

export default Settings
