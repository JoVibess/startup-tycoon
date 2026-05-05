import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Game from './pages/Game'
import Settings from './pages/Settings'
import SignInPage from './pages/SignInPage'
import NotFound from './pages/NotFound'

const Shop = lazy(() => import('./pages/Shop'))
const Stats = lazy(() => import('./pages/Stats'))

function PageLoader({ children }) {
  return (
    <Suspense
      fallback={
        <main>
          <p>Chargement...</p>
        </main>
      }
    >
      {children}
    </Suspense>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Game />} />
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route
            path="/shop"
            element={
              <PageLoader>
                <Shop />
              </PageLoader>
            }
          />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/stats"
              element={
                <PageLoader>
                  <Stats />
                </PageLoader>
              }
            />
          </Route>
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
