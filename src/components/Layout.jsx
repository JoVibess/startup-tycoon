import { createElement } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  ChartLineUp,
  GameController,
  GearSix,
  ShoppingCart,
} from '@phosphor-icons/react'
import ThemeToggle from './ThemeToggle'

const navItems = [
  { to: '/', label: 'Game', icon: GameController },
  { to: '/shop', label: 'Shop', icon: ShoppingCart },
  { to: '/stats', label: 'Stats', icon: ChartLineUp },
  { to: '/settings', label: 'Settings', icon: GearSix },
]

function Layout() {
  return (
    <div className="app-shell">
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
