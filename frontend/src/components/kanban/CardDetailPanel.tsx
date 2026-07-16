import { useState, useEffect } from 'react'
import { Icon } from '../Icon'
import { api, type Member } from '../../lib/api'
import { sanitizeHtml } from '../../lib/sanitize'
import { useModalA11y, MODAL_A11Y_PROPS } from '../../hooks/useModalA11y'
import { CardDescriptionEditor } from './CardDescriptionEditor'
import {
  COLS,
  PRIORITY_BORDER,
  PRIORITY_LABEL,
  type CardData,
  type CardPatch,
  type ColKey,
  type Priority,
} from './types'

interface CardDetailPanelProps {
  card: CardData
  col: ColKey
  onClose: () => void
  onMarkDone: () => void
  onDelete: () => void
  onSave: (patch: CardPatch) => Promise<void>
}

// Mirrors the backend's _initials() (app/routers/kanban.py) so an existing
// card's stored initials can be matched back to a real member for the
// assignee picker's default selection.
function deriveInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length > 1) return parts.slice(0, 3).map(p => p[0]).join('').toUpperCase()
  return name.slice(0, 3).toUpperCase()
}

export function CardDetailPanel({ card, col, onClose, onMarkDone, onDelete, onSave }: CardDetailPanelProps) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(card.title)
  const [priority, setPriority] = useState<Priority>(card.priority)
  const [colKey, setColKey] = useState<ColKey>(col)
  const [assignee, setAssignee] = useState('')
  const [members, setMembers] = useState<Member[]>([])
  const [descHtml, setDescHtml] = useState(card.desc ?? '')
  const [busy, setBusy] = useState(false)
  const borderColor = card.blocker ? '#EF4444' : PRIORITY_BORDER[priority]
  const dialogRef = useModalA11y(true, onClose)

  // The board is SU:Core-only, so the assignee picker only offers SU:Core members.
  useEffect(() => {
    const currentInitials = card.assignees[0]?.initials ?? ''
    api.members.list('core').then(list => {
      setMembers(list)
      const match = currentInitials && list.find(m => deriveInitials(m.name) === currentInitials)
      if (match) setAssignee(match.name)
    }).catch(() => {})
    // card is the panel's identity for the lifetime of this mount (see KanbanPage), so
    // this only needs to run once per open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function save() {
    setBusy(true)
    try {
      await onSave({
        title: title.trim() || card.title,
        desc: sanitizeHtml(descHtml),
        priority,
        col: colKey,
        assignee: assignee.trim(),
      })
      setEditing(false)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <div className="kb-detail-backdrop" onClick={onClose} />
      <div
        className="kb-detail-panel"
        ref={dialogRef}
        {...MODAL_A11Y_PROPS}
        aria-label={card.title}
      >
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 4, flexShrink: 0, borderRadius: 4, background: borderColor, alignSelf: 'stretch', minHeight: 52 }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
              {card.tags.map((t, i) => (
                <span key={i} className={t.cls} style={t.style}>
                  {t.dot && <span className="dot" />}{t.label}
                </span>
              ))}
            </div>
            {editing
              ? <input className="input" value={title} onChange={e => setTitle(e.target.value)} />
              : <h3 style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.4, color: 'var(--text)' }}>{card.title}</h3>}
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Закрыть" style={{ flexShrink: 0, marginTop: -2 }}>
            <Icon id="i-x" />
          </button>
        </div>

        <div className="kb-detail-body">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            {editing ? (
              <>
                <select className="select" style={{ width: 'auto', height: 32 }} value={priority} onChange={e => setPriority(e.target.value as Priority)}>
                  <option value="p-high">P0 · Urgent</option>
                  <option value="p-mid">P1 · High</option>
                  <option value="p-low">P2 · Low</option>
                </select>
                <select className="select" style={{ width: 'auto', height: 32 }} value={colKey} onChange={e => setColKey(e.target.value as ColKey)}>
                  {COLS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                </select>
                <select className="select" style={{ width: 'auto', height: 32 }} value={assignee} onChange={e => setAssignee(e.target.value)}>
                  <option value="">Unassigned</option>
                  {members.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                </select>
              </>
            ) : (
              <>
                <span className={`kbc-priority ${card.priority}`}>
                  <span className="bar" /><span className="bar" /><span className="bar" />
                  {card.pLabel} · {PRIORITY_LABEL[card.priority]}
                </span>
                <div style={{ display: 'flex', gap: 4 }}>
                  {card.assignees.map((a, i) => (
                    <div key={i} className="avatar" style={{ background: a.bg, ...(a.offset ? { marginLeft: -8, border: '2px solid var(--surface)' } : {}) }}>
                      {a.initials}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div>
            <div className="kb-detail-section-label">Описание</div>
            {editing ? (
              <div style={{ border: '1px solid var(--border)', borderRadius: 8 }}>
                <CardDescriptionEditor initialHtml={card.desc ?? ''} onChangeHtml={setDescHtml} />
              </div>
            ) : card.desc ? (
              <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.65 }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(card.desc) }} />
            ) : (
              <p className="text-muted" style={{ fontSize: 13 }}>Описание не задано.</p>
            )}
          </div>
        </div>

        <div className="kb-detail-footer">
          {editing ? (
            <>
              <button className="btn ghost" disabled={busy} onClick={() => setEditing(false)}>Отмена</button>
              <button className="btn primary" style={{ flex: 1 }} disabled={busy} onClick={save}>
                <Icon id="i-check" style={{ width: 14, height: 14 }} />{busy ? 'Сохранение…' : 'Сохранить'}
              </button>
            </>
          ) : (
            <>
              <button className="btn danger" aria-label="Удалить задачу" onClick={() => { if (window.confirm(`Удалить задачу «${card.title}»?`)) onDelete() }}>
                <Icon id="i-trash" style={{ width: 14, height: 14 }} />
              </button>
              <button className="btn secondary" style={{ flex: 1 }} onClick={() => setEditing(true)}>
                <Icon id="i-edit" style={{ width: 14, height: 14 }} />Редактировать
              </button>
              <button className="btn primary" style={{ flex: 1 }} onClick={() => { onMarkDone(); onClose() }}>
                <Icon id="i-check" style={{ width: 14, height: 14 }} />Готово
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}
