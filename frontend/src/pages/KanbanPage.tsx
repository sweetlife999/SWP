import { useState, useEffect, useRef } from 'react'
import { Icon } from '../components/Icon'
import { api } from '../lib/api'

// Plain-text snippet from a (possibly rich-HTML) description, for card previews.
function stripHtml(html?: string): string {
  if (!html) return ''
  const el = document.createElement('div')
  el.innerHTML = html
  return el.textContent ?? ''
}
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { ErrorBanner } from '../components/ErrorBanner'

type ColKey = 'backlog' | 'next' | 'doing' | 'review' | 'done'
type Priority = 'p-low' | 'p-mid' | 'p-high'

interface Tag { label: string; cls: string; style?: React.CSSProperties; dot?: boolean }
interface MetaItem { icon: string; text: string; urgent?: boolean; soon?: boolean }
interface Assignee { initials: string; bg: string; offset?: boolean }
interface CardData {
  id: string; col: ColKey; blocker?: boolean
  tags: Tag[]; title: string; desc?: string
  attachment?: { icon: string; bold: string; rest: string }
  progressPct?: number; progressLabel?: string
  meta?: MetaItem[]
  priority: Priority; pLabel: string; assignees: Assignee[]
}

const PRIORITY_BORDER: Record<Priority, string> = {
  'p-high': '#EF4444',
  'p-mid':  '#F97316',
  'p-low':  '#10B981',
}
const PRIORITY_LABEL: Record<Priority, string> = {
  'p-high': 'Urgent',
  'p-mid':  'High',
  'p-low':  'Low',
}

const COLS: { key: ColKey; cls: string; label: string; color: string; eyeBtn?: boolean }[] = [
  { key: 'backlog', cls: 'c-backlog', label: 'Backlog',         color: '#9CA3AF' },
  { key: 'next',    cls: 'c-next',    label: 'Up next',         color: '#60A5FA' },
  { key: 'doing',   cls: 'c-doing',   label: 'In progress',     color: '#F59E0B' },
  { key: 'review',  cls: 'c-review',  label: 'Review',          color: '#A78BFA' },
  { key: 'done',    cls: 'c-done',    label: 'Done · sprint 14', color: '#22C55E', eyeBtn: true },
]

const FACES = [
  { i: 'МР', bg: 'linear-gradient(135deg,#a3e0ad,#32b247)' },
  { i: 'ДА', bg: 'linear-gradient(135deg,#b3d5a8,#5fa44f)' },
  { i: 'ЕВ', bg: 'linear-gradient(135deg,#c7dfa9,#74a55c)' },
  { i: 'ТК', bg: 'linear-gradient(135deg,#a8dba8,#3da152)' },
  { i: 'АС', bg: 'linear-gradient(135deg,#a8c0e0,#3868b8)' },
]

interface CardPatch { title?: string; desc?: string; priority?: Priority; col?: ColKey; assignee?: string }
interface CardDetailPanelProps {
  card: CardData
  col: ColKey
  onClose: () => void
  onMarkDone: () => void
  onDelete: () => void
  onSave: (patch: CardPatch) => Promise<void>
}

function CardDetailPanel({ card, col, onClose, onMarkDone, onDelete, onSave }: CardDetailPanelProps) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(card.title)
  const [priority, setPriority] = useState<Priority>(card.priority)
  const [colKey, setColKey] = useState<ColKey>(col)
  const [assignee, setAssignee] = useState(card.assignees[0]?.initials ?? '')
  const [busy, setBusy] = useState(false)
  const descRef = useRef<HTMLDivElement>(null)
  const borderColor = card.blocker ? '#EF4444' : PRIORITY_BORDER[priority]

  async function save() {
    setBusy(true)
    try {
      await onSave({
        title: title.trim() || card.title,
        desc: descRef.current?.innerHTML ?? card.desc ?? '',
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
      <div className="kb-detail-panel">
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
          <button className="icon-btn" onClick={onClose} style={{ flexShrink: 0, marginTop: -2 }}>
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
                <input className="input" style={{ width: 90 }} maxLength={3} placeholder="Assignee" value={assignee} onChange={e => setAssignee(e.target.value)} />
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
              // "Block note": rich contentEditable, stored as HTML (the app's content-block pattern).
              <div
                ref={descRef}
                className="rm-edit"
                contentEditable
                suppressContentEditableWarning
                dangerouslySetInnerHTML={{ __html: card.desc ?? '' }}
                style={{ minHeight: 120, border: '1px solid var(--border)', borderRadius: 8, padding: 12, fontSize: 14, lineHeight: 1.6, outline: 'none' }}
              />
            ) : card.desc ? (
              <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.65 }} dangerouslySetInnerHTML={{ __html: card.desc }} />
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
              <button className="btn danger" onClick={() => { if (window.confirm(`Удалить задачу «${card.title}»?`)) onDelete() }}>
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

interface KbCardProps {
  card: CardData
  isDone: boolean
  isDragging: boolean
  onDragStart: (e: React.DragEvent) => void
  onDragEnd: () => void
  onSelect: (card: CardData) => void
}

function KbCard({ card, isDone, isDragging, onDragStart, onDragEnd, onSelect }: KbCardProps) {
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

export default function KanbanPage() {
  const [viewSeg, setViewSeg] = useState(0)
  const [search, setSearch] = useState('')
  const [fetchedCards, setFetchedCards] = useState<CardData[]>([])
  const [cardCols, setCardCols] = useState<Record<string, ColKey>>({})
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<ColKey | null>(null)
  const [selected, setSelected] = useState<CardData | null>(null)
  // Off by default — otherwise newly-created low-priority cards are hidden on load.
  const [chipP01, setChipP01] = useState(false)
  const [chipOpenDay, setChipOpenDay] = useState(false)
  const [newTask, setNewTask] = useState<{ open: boolean; col: ColKey; title: string; desc: string; priority: Priority; assignee: string }>({ open: false, col: 'backlog', title: '', desc: '', priority: 'p-mid', assignee: '' })
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Bumped to re-trigger the load effect on retry.
  const [reloadKey, setReloadKey] = useState(0)
  const retry = () => setReloadKey(k => k + 1)

  // /admin/kanban needs the Bearer token, so we use api.admin.kanban.list() (which
  // sends it) rather than useFetch. setState lives in async callbacks, not the
  // effect body, to satisfy react-hooks/set-state-in-effect.
  useEffect(() => {
    let cancelled = false
    api.admin.kanban.list()
      .then(data => {
        if (cancelled) return
        setFetchedCards(data as CardData[])
        setCardCols(Object.fromEntries(data.map(c => [c.id, c.col as ColKey])))
        setError(null)
      })
      .catch(() => { if (!cancelled) setError('Не удалось загрузить доску') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [reloadKey])

  const allCards = fetchedCards

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  // Optimistic move: update the UI immediately, persist via PATCH, roll back + toast on failure (US-10 AC2/AC3).
  async function moveCard(cardId: string, col: ColKey) {
    const prev = cardCols[cardId] ?? allCards.find(c => c.id === cardId)?.col
    if (!prev || prev === col) return
    setCardCols(p => ({ ...p, [cardId]: col }))
    // Locally-created tasks (kb-x…) have no backend row yet — skip persistence.
    if (cardId.startsWith('kb-x')) return
    try {
      await api.admin.kanban.update(cardId, col)
    } catch {
      setCardCols(p => ({ ...p, [cardId]: prev }))
      showToast('Не удалось переместить карточку')
    }
  }

  function colCards(col: ColKey) {
    const q = search.trim().toLowerCase()
    return allCards.filter(c => {
      if ((cardCols[c.id] ?? c.col) !== col) return false
      if (chipP01 && c.priority === 'p-low') return false
      if (chipOpenDay && !c.tags.some(t => t.label === 'Open Day')) return false
      if (!q) return true
      return c.title.toLowerCase().includes(q) || c.desc?.toLowerCase().includes(q) || false
    })
  }

  function exportCsv() {
    const headers = ['ID', 'Column', 'Priority', 'Title', 'Assignees']
    const rows = allCards.map(c => [c.id, cardCols[c.id] ?? c.col, c.pLabel, c.title, c.assignees.map(a => a.initials).join('; ')])
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'kanban-sprint14.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  function openNewTask(col: ColKey) {
    setNewTask({ open: true, col, title: '', desc: '', priority: 'p-mid', assignee: '' })
  }

  async function submitNewTask() {
    if (!newTask.title.trim()) return
    try {
      await api.admin.kanban.create({
        title: newTask.title.trim(),
        col: newTask.col,
        desc: newTask.desc.trim() || undefined,
        priority: newTask.priority,
        assignee: newTask.assignee.trim() || undefined,
      })
      setNewTask({ open: false, col: 'backlog', title: '', desc: '', priority: 'p-mid', assignee: '' })
      retry()  // reload the board so the persisted card appears
      showToast('Задача создана')
    } catch {
      showToast('Не удалось создать задачу')
    }
  }

  async function deleteCard(id: string) {
    try {
      await api.admin.kanban.remove(id)
      setSelected(null)
      retry()
      showToast('Задача удалена')
    } catch {
      showToast('Не удалось удалить задачу')
    }
  }

  function handleDrop(e: React.DragEvent, col: ColKey) {
    e.preventDefault()
    const cardId = e.dataTransfer.getData('cardId') || dragging
    setDragging(null)
    setDragOver(null)
    if (cardId) moveCard(cardId, col)
  }

  if (error) {
    return (
      <>
        <div className="page-head">
          <div className="title">
            <span className="eyebrow">SU:Core · Internal backlog</span>
            <h1>Core board · Sprint 14</h1>
          </div>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '300px',
          width: '100%'
        }}>
          <div style={{ maxWidth: '650px', width: '100%' }}>
            <ErrorBanner 
              message="Failed to load board. Please try again." 
              onRetry={retry}
              stack={error}
            />
          </div>
        </div>
      </>
    )
  }

  if (loading) {
    return (
      <>
        <div className="page-head">
          <div className="title">
            <span className="eyebrow">SU:Core · Internal backlog</span>
            <h1>Core board · Sprint 14</h1>
          </div>
        </div>
        <div className="board">
          {COLS.map(col => (
            <div key={col.key} className={`kb-col ${col.cls}`}>
              <header className="col-head">
                <span className="marker" style={{ background: col.color }} />
                <span className="title">{col.label}</span>
              </header>
              <div className="col-drop">
                <LoadingSkeleton type="kanban" count={2} />
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }

  // No empty-state early return: the board itself renders the "Новая задача"
  // button and per-column add buttons, so an empty board is still actionable.

  return (
    <>
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: 'var(--fg)', color: 'var(--bg)', padding: '10px 20px', borderRadius: 8, fontSize: 13, zIndex: 9999, pointerEvents: 'none' }}>
          {toast}
        </div>
      )}

      <div className="page-head">
        <div className="title">
          <span className="eyebrow">SU:Core · Internal backlog</span>
          <h1>Core board · Sprint 14</h1>
          <p className="text-muted" style={{ fontSize: 13, marginTop: 2 }}>
            Only for SU:Core team. Students do not see this page.
          </p>
        </div>
        <div className="row gap-2">
          <button className="btn secondary" onClick={exportCsv}>
            <Icon id="i-download" style={{ width: 14, height: 14 }} />Export CSV
          </button>
          <button className="btn primary" onClick={() => openNewTask('backlog')}>
            <Icon id="i-plus" style={{ width: 14, height: 14 }} />New task
          </button>
        </div>
      </div>

      <section className="kb-toolbar">
        <label className="input-group" style={{ width: 260 }}>
          <Icon id="i-search" className="ic" />
          <input
            type="text"
            placeholder="Search task or assignee…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </label>
        <span className="divider" />
        <div className="row gap-2">
          <span className="text-mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Sprint</span>
          <select className="select" style={{ width: 'auto', minWidth: 180, height: 32, fontSize: 13, paddingRight: 28 }}>
            <option>Sprint 14 · current</option>
            <option>Sprint 13</option>
            <option>Sprint 12</option>
            <option>Backlog (no sprint)</option>
          </select>
        </div>
        <span className="divider" />
        <span className="text-mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Who</span>
        <div className="kb-faces">
          {FACES.map(a => <div key={a.i} className="avatar" style={{ background: a.bg }}>{a.i}</div>)}
          <div className="more">+3</div>
        </div>
        <span className="divider" />
        <button className={`filter-chip${chipP01 ? ' active' : ''}`} onClick={() => setChipP01(v => !v)}>
          <Icon id="i-flag" style={{ width: 12, height: 12 }} />Priority: P0–P1{chipP01 && <span className="x">×</span>}
        </button>
        <button className={`filter-chip${chipOpenDay ? ' active' : ''}`} onClick={() => setChipOpenDay(v => !v)}>
          <Icon id="i-target" style={{ width: 12, height: 12 }} />Tag: Open Day{chipOpenDay && <span className="x">×</span>}
        </button>
        <div style={{ marginLeft: 'auto' }} className="row gap-2">
          <div className="seg">
            {['Board', 'List', 'Timeline'].map((l, i) => (
              <button key={i} className={viewSeg === i ? 'active' : ''} onClick={() => setViewSeg(i)}>{l}</button>
            ))}
          </div>
        </div>
      </section>

      <div className="board-wrap">
        <div className="board">
          {COLS.map(col => {
            const cards = colCards(col.key)
            const isOver = dragOver === col.key && dragging !== null && cardCols[dragging] !== col.key
            return (
              <section
                key={col.key}
                className={`kb-col ${col.cls}`}
                onDragOver={e => { e.preventDefault(); setDragOver(col.key) }}
                onDragLeave={() => setDragOver(null)}
                onDrop={e => handleDrop(e, col.key)}
              >
                <header className="col-head">
                  <span className="marker" style={{ background: col.color }} />
                  <span className="title">{col.label}</span>
                  <span
                    className="count"
                    style={cards.length > 0 ? {
                      color: col.color,
                      background: col.color + '18',
                    } : undefined}
                  >
                    {cards.length}
                  </span>
                  <button className="add" onClick={() => !col.eyeBtn && openNewTask(col.key)}><Icon id={col.eyeBtn ? 'i-eye' : 'i-plus'} /></button>
                </header>

                <div
                  className="col-drop"
                  style={{
                    background: isOver ? col.color + '10' : undefined,
                    outline: isOver ? `2px dashed ${col.color}` : undefined,
                    outlineOffset: -2,
                    borderRadius: isOver ? 8 : undefined,
                    minHeight: isOver && cards.length === 0 ? 64 : undefined,
                    transition: 'background 0.12s',
                  }}
                >
                  {cards.map(card => (
                    <KbCard
                      key={card.id}
                      card={card}
                      isDone={col.key === 'done'}
                      isDragging={dragging === card.id}
                      onDragStart={() => setDragging(card.id)}
                      onDragEnd={() => { setDragging(null); setDragOver(null) }}
                      onSelect={setSelected}
                    />
                  ))}
                  {cards.length === 0 && !isOver && (
                    <div style={{ padding: '20px 10px', textAlign: 'center', color: 'var(--muted)', fontSize: 12.5 }}>
                      No tasks · drag here
                    </div>
                  )}
                </div>

                {col.key !== 'done' && (
                  <button className="col-add-empty" onClick={() => openNewTask(col.key)}><Icon id="i-plus" />Add task</button>
                )}
              </section>
            )
          })}
        </div>
      </div>

      <footer className="text-muted" style={{ fontSize: 12, textAlign: 'center', padding: '18px 0 8px', marginTop: 8, borderTop: '1px solid var(--border)' }}>
        Internal backlog · visible only to SU:Core team · <span className="text-mono">drag card ↔ to change status · click to open details</span>
      </footer>

      {newTask.open && (
        <div className="modal-overlay" onClick={() => setNewTask(t => ({ ...t, open: false }))}>
          <div className="dep-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <button className="modal-close" onClick={() => setNewTask(t => ({ ...t, open: false }))}><Icon id="i-x" style={{ width: 14, height: 14 }} /></button>
            <div className="dep-modal-header"><h2>New task</h2></div>
            <div className="dep-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="field">
                <label>Title</label>
                <input className="input" autoFocus placeholder="Task title…" value={newTask.title} onChange={e => setNewTask(t => ({ ...t, title: e.target.value }))} />
              </div>
              <div className="field">
                <label>Description</label>
                <textarea className="textarea" rows={2} placeholder="Что нужно сделать…" value={newTask.desc} onChange={e => setNewTask(t => ({ ...t, desc: e.target.value }))} />
              </div>
              <div className="row gap-3">
                <div className="field" style={{ flex: 1 }}>
                  <label>Column</label>
                  <select className="select" value={newTask.col} onChange={e => setNewTask(t => ({ ...t, col: e.target.value as ColKey }))}>
                    {COLS.filter(c => c.key !== 'done').map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                  </select>
                </div>
                <div className="field" style={{ flex: 1 }}>
                  <label>Priority</label>
                  <select className="select" value={newTask.priority} onChange={e => setNewTask(t => ({ ...t, priority: e.target.value as Priority }))}>
                    <option value="p-high">P0 · Urgent</option>
                    <option value="p-mid">P1 · High</option>
                    <option value="p-low">P2 · Low</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label>Assignee (инициалы)</label>
                <input className="input" placeholder="МР" maxLength={3} value={newTask.assignee} onChange={e => setNewTask(t => ({ ...t, assignee: e.target.value }))} />
              </div>
            </div>
            <div className="dep-modal-foot" style={{ display: 'flex', gap: 8 }}>
              <button className="btn secondary" style={{ flex: 1 }} onClick={() => setNewTask(t => ({ ...t, open: false }))}>Cancel</button>
              <button className="btn primary" style={{ flex: 1 }} onClick={submitNewTask} disabled={!newTask.title.trim()}>Create</button>
            </div>
          </div>
        </div>
      )}

      {selected && (
        <CardDetailPanel
          card={selected}
          col={cardCols[selected.id] ?? selected.col}
          onClose={() => setSelected(null)}
          onMarkDone={() => moveCard(selected.id, 'done')}
          onDelete={() => deleteCard(selected.id)}
          onSave={async patch => {
            try {
              await api.admin.kanban.patch(selected.id, patch)
              setSelected(null)
              retry()
              showToast('Карточка сохранена')
            } catch {
              showToast('Не удалось сохранить карточку')
            }
          }}
        />
      )}
    </>
  )
}
