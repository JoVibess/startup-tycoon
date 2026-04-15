import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ThemeProvider from './contexts/ThemeProvider.jsx'
import './styles/theme.css'
import './styles/App.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
