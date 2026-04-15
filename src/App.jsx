import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Game from './pages/Game'
import Shop from './pages/Shop'
import Stats from './pages/Stats'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Game />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
