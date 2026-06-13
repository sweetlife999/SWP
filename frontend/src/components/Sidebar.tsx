import { NavLink } from 'react-router-dom'
import { Icon } from './Icon'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
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
            <span className="count">12</span>
          </NavLink>
          <NavLink className="nav-item" to="/questionnaires" onClick={onClose}>
            <Icon id="i-clipboard" className="ic" />
            Questionnaires
            <span className="count">3</span>
          </NavLink>
          <NavLink className="nav-item" to="/donations" onClick={onClose}>
            <Icon id="i-heart" className="ic" />
            Donations
          </NavLink>
        </nav>

        <div className="nav-section">Admin</div>
        <nav className="nav-list">
          <NavLink className="nav-item" to="/admin/kanban" onClick={onClose}>
            <Icon id="i-kanban" className="ic" />
            SU:Core Board
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
          <div className="avatar">ИП</div>
          <div style={{ minWidth: 0 }}>
            <div className="name">Иван Петров</div>
            <div className="role">B22-DS-02 · Member</div>
          </div>
        </div>
      </aside>
      <div className={`scrim${open ? ' open' : ''}`} onClick={onClose} />
    </>
  )
}
