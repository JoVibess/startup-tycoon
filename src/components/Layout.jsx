import { createElement } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  ChartLineUp,
  GameController,
  GearSix,
  ShoppingCart,
} from '@phosphor-icons/react'
import { useGameStore } from '../state/useGameStore'
import { formatNumber } from '../utils/formatNumber'
import GameAutoSave from './GameAutoSave'
import GameTick from './GameTick'
import ThemeToggle from './ThemeToggle'

const navItems = [
  { to: '/', label: 'Game', icon: GameController },
  { to: '/shop', label: 'Shop', icon: ShoppingCart },
  { to: '/stats', label: 'Stats', icon: ChartLineUp },
  { to: '/settings', label: 'Settings', icon: GearSix },
]

function Layout() {
  const money = useGameStore((state) => state.money)
  const incomePerSecond = useGameStore((state) => state.incomePerSecond)

  return (
    <div className="app-shell">
      <GameTick />
      <GameAutoSave />

      <header className="app-header">
        <NavLink className="brand" to="/" aria-label="Retour au jeu">
          <span className="brand-mark">ST</span>
          <span>Startup Tycoon</span>
        </NavLink>

        <nav className="main-nav" aria-label="Navigation principale">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link-active' : 'nav-link'
              }
            >
              {createElement(icon, {
                size: 22,
                weight: 'bold',
                'aria-hidden': true,
              })}
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="global-stats" aria-label="Ressources globales">
          <span>Money: ${formatNumber(money)}</span>
          <span>Income/sec: ${formatNumber(incomePerSecond)}</span>
        </div>

        <ThemeToggle />
      </header>

      <div className="app-main">
        <Outlet />
      </div>

      <footer className="app-footer">
        <p>Startup Tycoon - 2026</p>
      </footer>
    </div>
  )
}

export default Layout
