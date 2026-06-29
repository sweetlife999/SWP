import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import ScrollProgress from './ScrollProgress'
import { useReveal } from '../hooks/useReveal'

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()

  // Scroll-reveal + staggered entrance across every page.
  useReveal()

  return (
    <div className="app">
      <ScrollProgress />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <main className="main">
        {/* keyed by pathname so the cross-fade replays on each navigation */}
        <div className="route-fade" key={pathname}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
