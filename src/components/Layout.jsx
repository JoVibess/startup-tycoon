import { createElement, memo } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  ChartLineUp,
  GameController,
  GearSix,
  Ranking,
  ShoppingCart,
} from '@phosphor-icons/react'
import GameAutoSave from './GameAutoSave'
import GameTick from './GameTick'
import GlobalStats from './GlobalStats'
import AuthControls from './AuthControls'
import ThemeToggle from './ThemeToggle'

const navItems = [
  { to: '/', label: 'Game', icon: GameController },
  { to: '/shop', label: 'Shop', icon: ShoppingCart },
  { to: '/leaderboard', label: 'Leaderboard', icon: Ranking },
  { to: '/stats', label: 'Stats', icon: ChartLineUp },
  { to: '/settings', label: 'Settings', icon: GearSix },
]

const BrandLink = memo(function BrandLink() {
  return (
    <NavLink className="brand" to="/" aria-label="Retour au jeu">
      <span className="brand-mark">ST</span>
      <span>Startup Tycoon</span>
    </NavLink>
  )
})

const MainNav = memo(function MainNav() {
  return (
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
  )
})

const AppHeader = memo(function AppHeader() {
  return (
    <header className="app-header">
      <BrandLink />
      <MainNav />
      <GlobalStats />
      <AuthControls />
      <ThemeToggle />
    </header>
  )
})

function Layout() {
  return (
    <div className="app-shell">
      <GameTick />
      <GameAutoSave />

      <AppHeader />

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
