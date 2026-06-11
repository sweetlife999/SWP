import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

function getCrumbs(pathname: string): { label: string; href?: string }[] {
  if (pathname === '/') return [{ label: 'Главная' }]
  if (pathname === '/members') return [{ label: 'Members · History · Roadmap' }]
  if (pathname === '/events') return [{ label: 'Events' }]
  if (pathname.startsWith('/events/')) return [
    { label: 'Events', href: '/events' },
    { label: 'Hackathon Summer 24h' },
  ]
  if (pathname === '/questionnaires') return [{ label: 'Questionnaires' }]
  if (pathname === '/donations') return [{ label: 'Donations' }]
  if (pathname === '/admin/kanban') return [{ label: 'Admin' }, { label: 'SU:Core Board' }]
  if (pathname === '/admin/forms/builder') return [{ label: 'Admin' }, { label: 'Forms Builder' }, { label: 'Опрос #025 · Welcome Week фидбек' }]
  if (pathname === '/admin/accounts') return [{ label: 'Admin' }, { label: 'Accounts' }]
  return [{ label: pathname }]
}

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const crumbs = getCrumbs(location.pathname)

  return (
    <div className="app">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onMenuClick={() => setSidebarOpen(true)} crumbs={crumbs} />
      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}
