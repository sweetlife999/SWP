import { Icon } from './Icon'

interface HeaderProps {
  onMenuClick: () => void
  crumbs?: { label: string; href?: string }[]
}

export default function Header({ onMenuClick, crumbs }: HeaderProps) {
  return (
    <header className="header">
      <button className="icon-btn menu-btn" aria-label="Menu" onClick={onMenuClick}>
        <Icon id="i-menu" />
      </button>
      <div className="header-crumbs">
        <span>SU Portal</span>
        {crumbs?.map((c, i) => (
          <>
            <span key={`sep-${i}`} className="sep">/</span>
            {c.href ? (
              <a key={`lnk-${i}`} href={c.href} className="cur" style={{ textDecoration: 'underline' }}>
                {c.label}
              </a>
            ) : (
              <span key={`cur-${i}`} className="cur">{c.label}</span>
            )}
          </>
        ))}
      </div>
      <div className="header-actions">
        <label className="search">
          <Icon id="i-search" style={{ width: 14, height: 14, color: 'var(--muted)' }} />
          <input placeholder="Поиск по порталу…" />
          <span className="kbd">⌘K</span>
        </label>
        <button className="icon-btn" aria-label="Notifications">
          <Icon id="i-bell" />
          <span className="dot"></span>
        </button>
        <div className="avatar sm">ИП</div>
      </div>
    </header>
  )
}
