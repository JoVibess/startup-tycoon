import { useEffect, useMemo, useState } from 'react'
import { ThemeContext } from './themeContext'

const THEME_STORAGE_KEY = 'startup-tycoon-theme'

function getSavedTheme() {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY)
  } catch {
    return null
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Theme persistence is a bonus; the UI can still run without it.
  }
}

function getInitialTheme() {
  const savedTheme = getSavedTheme()

  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    saveTheme(theme)
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      toggleTheme() {
        setTheme((currentTheme) =>
          currentTheme === 'light' ? 'dark' : 'light',
        )
      },
    }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export default ThemeProvider
