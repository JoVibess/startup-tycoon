import { Moon, Sun } from '@phosphor-icons/react'
import { useTheme } from '../contexts/useTheme'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Activer le theme jour' : 'Activer le theme nuit'}
    >
      {isDark ? (
        <Sun size={22} weight="bold" aria-hidden="true" />
      ) : (
        <Moon size={22} weight="bold" aria-hidden="true" />
      )}
      <span>{isDark ? 'Jour' : 'Nuit'}</span>
    </button>
  )
}

export default ThemeToggle
