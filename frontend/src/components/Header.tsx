import { NavLink, useNavigate } from 'react-router-dom'
import { Icon } from './Icon'
import { useAdmin } from '../lib/AdminContext'

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { isAdmin, logout } = useAdmin()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="header">
      <button className="icon-btn menu-btn" aria-label="Menu" onClick={onMenuClick}>
        <Icon id="i-menu" />
      </button>
      <div className="header-brand">
        <div className="logo-sm">SU</div>
        <span className="header-brand-name">Студсовет IU</span>
      </div>
      <nav className="header-nav">
        <NavLink className="nav-link" to="/" end>Главная</NavLink>
        <NavLink className="nav-link" to="/events">Events</NavLink>
        <NavLink className="nav-link" to="/members">Members</NavLink>
        <NavLink className="nav-link" to="/questionnaires">Questionnaires</NavLink>
        <NavLink className="nav-link" to="/donations">Donations</NavLink>
        <span className="nav-sep" />
        <NavLink className="nav-link" to="/admin/kanban">SU:Core</NavLink>
        <NavLink className="nav-link" to="/admin/forms/builder">Forms</NavLink>
        <NavLink className="nav-link" to="/admin/forms/viewer">Ответы</NavLink>
      </nav>
      {isAdmin && (
        <button className="btn ghost" style={{ fontSize: 12, gap: 6, marginLeft: 8 }} onClick={handleLogout}>
          <span style={{ background: 'var(--accent)', color: '#fff', borderRadius: 4, padding: '1px 6px', fontSize: 11, fontWeight: 700 }}>ADMIN</span>
          Выйти
        </button>
      )}
    </header>
  )
}
