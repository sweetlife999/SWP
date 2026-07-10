import { useState } from 'react'
import { Icon } from '../Icon'
import { PRIORITY_BORDER, type CardData } from './types'

// Plain-text snippet from a (possibly rich-HTML) description, for card previews.
function stripHtml(html?: string): string {
  if (!html) return ''
  const el = document.createElement('div')
  el.innerHTML = html
  return el.textContent ?? ''
}

interface KbCardProps {
  card: CardData
  isDone: boolean
  isDragging: boolean
  onDragStart: (e: React.DragEvent) => void
  onDragEnd: () => void
  onSelect: (card: CardData) => void
}

export function KbCard({ card, isDone, isDragging, onDragStart, onDragEnd, onSelect }: KbCardProps) {
  const [hovered, setHovered] = useState(false)
  const borderColor = card.blocker ? '#EF4444' : PRIORITY_BORDER[card.priority]

  return (
    <article
      className="kbc kbc-anim"
      draggable
      onDragStart={e => { e.dataTransfer.setData('cardId', card.id); e.dataTransfer.effectAllowed = 'move'; onDragStart(e) }}
      onDragEnd={onDragEnd}
      onClick={() => onSelect(card)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderLeft: `4px solid ${borderColor}`,
        opacity: isDragging ? 0.35 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        transform: hovered && !isDragging ? 'translateY(-2px)' : 'none',
        boxShadow: hovered && !isDragging ? '0 4px 16px rgba(0,0,0,0.09)' : undefined,
        transition: 'opacity 0.12s, transform 0.12s, box-shadow 0.12s',
      }}
    >
      <div className="kbc-tags">
        {card.tags.map((t, i) => (
          <span key={i} className={t.cls} style={t.style}>
            {t.dot && <span className="dot" />}{t.label}
          </span>
        ))}
      </div>
      <h4 className="kbc-title" style={isDone ? { textDecoration: 'line-through' } : undefined}>
        {card.title}
      </h4>
      {stripHtml(card.desc) && <p className="kbc-desc">{stripHtml(card.desc)}</p>}
      {card.attachment && (
        <div className="kbc-attachment">
          <Icon id={card.attachment.icon} />
          <span><b>{card.attachment.bold}</b>{card.attachment.rest}</span>
        </div>
      )}
      {card.progressPct !== undefined && (
        <div className="kbc-progress">
          <div className="progress"><div className="bar" style={{ width: `${card.progressPct}%` }} /></div>
          <span>{card.progressLabel}</span>
        </div>
      )}
      {card.meta && card.meta.length > 0 && (
        <div className="kbc-meta">
          {card.meta.map((m, i) => (
            <span key={i} className={`mi${m.urgent ? ' urgent' : m.soon ? ' soon' : ''}`}>
              <Icon id={m.icon} /><span>{m.text}</span>
            </span>
          ))}
        </div>
      )}
      <div className="kbc-foot">
        <span className={`kbc-priority ${card.priority}`}>
          <span className="bar" /><span className="bar" /><span className="bar" />{card.pLabel}
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          {card.assignees.map((a, i) => (
            <div key={i} className="avatar" style={{ background: a.bg, ...(a.offset ? { marginLeft: -8, border: '2px solid var(--surface)' } : {}) }}>
              {a.initials}
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}
