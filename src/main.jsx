import { ClerkProvider } from '@clerk/clerk-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import MissingClerkKey from './components/MissingClerkKey.jsx'
import ThemeProvider from './contexts/ThemeProvider.jsx'
import './styles/App.css'
import './styles/theme.css'

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 2,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {clerkPublishableKey ? (
      <ClerkProvider publishableKey={clerkPublishableKey} signInUrl="/sign-in">
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </QueryClientProvider>
      </ClerkProvider>
    ) : (
      <MissingClerkKey />
    )}
  </StrictMode>,
)
