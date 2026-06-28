import { NavLink, useNavigate } from 'react-router-dom'
import { Icon } from './Icon'
import { useAdmin } from '../lib/AdminContext'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { isAdmin, logout } = useAdmin()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    onClose()
    navigate('/')
  }

  return (
    <>
      <aside className={`sidebar${open ? ' open' : ''}`} aria-label="Sidebar">
        <div className="sidebar-brand">
          <div className="logo">SU</div>
          <div>
            <div className="name">Студсовет IU</div>
            <div className="sub">su.innopolis.university</div>
          </div>
        </div>

        <div className="nav-section">Главное</div>
        <nav className="nav-list">
          <NavLink className="nav-item" to="/" end onClick={onClose}>
            <Icon id="i-home" className="ic" />
            Главная
          </NavLink>
          <NavLink className="nav-item" to="/members" onClick={onClose}>
            <Icon id="i-users" className="ic" />
            Members &amp; History
          </NavLink>
          <NavLink className="nav-item" to="/events" onClick={onClose}>
            <Icon id="i-calendar" className="ic" />
            Events
          </NavLink>
          <NavLink className="nav-item" to="/questionnaires" onClick={onClose}>
            <Icon id="i-clipboard" className="ic" />
            Questionnaires
          </NavLink>
          <NavLink className="nav-item" to="/donations" onClick={onClose}>
            <Icon id="i-heart" className="ic" />
            Donations
          </NavLink>
        </nav>

        <div className="nav-section">Admin</div>
        <nav className="nav-list">
          <NavLink className="nav-item" to="/admin/events" onClick={onClose}>
            <Icon id="i-calendar" className="ic" />
            Events Manager
          </NavLink>
          <NavLink className="nav-item" to="/admin/members" onClick={onClose}>
            <Icon id="i-users" className="ic" />
            Members Manager
          </NavLink>
          <NavLink className="nav-item" to="/admin/kanban" onClick={onClose}>
            <Icon id="i-kanban" className="ic" />
            Kanban
          </NavLink>
          <NavLink className="nav-item" to="/admin/events" onClick={onClose}>
            <Icon id="i-calendar" className="ic" />
            Events Manager
          </NavLink>
          <NavLink className="nav-item" to="/admin/forms/builder" onClick={onClose}>
            <Icon id="i-edit" className="ic" />
            Forms Builder
          </NavLink>
          <NavLink className="nav-item" to="/admin/forms/viewer" onClick={onClose}>
            <Icon id="i-clipboard" className="ic" />
            Forms Viewer
          </NavLink>
        </nav>

        <div className="sidebar-user">
          {isAdmin ? (
            <>
              <div className="avatar" style={{ background: 'var(--accent)', color: '#fff' }}>А</div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div className="name">Администратор</div>
                <div className="role">SU:Core</div>
              </div>
              <button className="icon-btn" title="Выйти" onClick={handleLogout}>
                <Icon id="i-x" style={{ width: 14, height: 14 }} />
              </button>
            </>
          ) : null}
        </div>
      </aside>
      <div className={`scrim${open ? ' open' : ''}`} onClick={onClose} />
    </>
  )
}
