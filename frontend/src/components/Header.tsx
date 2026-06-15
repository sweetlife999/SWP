import { NavLink } from 'react-router-dom'
import { Icon } from './Icon'

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
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
    </header>
  )
}
