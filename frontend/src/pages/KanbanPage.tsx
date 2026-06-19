import { useState, useEffect } from 'react'
import { Icon } from '../components/Icon'
import { api } from '../lib/api'
import { useFetch } from '../hooks/useFetch'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { ErrorBanner } from '../components/ErrorBanner'
import { EmptyState } from '../components/EmptyState'

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

interface CardDetailPanelProps { card: CardData; onClose: () => void; onMarkDone: () => void }

function CardDetailPanel({ card, onClose, onMarkDone }: CardDetailPanelProps) {
  const borderColor = card.blocker ? '#EF4444' : PRIORITY_BORDER[card.priority]
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
            <h3 style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.4, color: 'var(--text)' }}>{card.title}</h3>
          </div>
          <button className="icon-btn" onClick={onClose} style={{ flexShrink: 0, marginTop: -2 }}>
            <Icon id="i-x" />
          </button>
        </div>

        <div className="kb-detail-body">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
          </div>

          {card.desc && (
            <div>
              <div className="kb-detail-section-label">Description</div>
              <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.65 }}>{card.desc}</p>
            </div>
          )}

          {card.attachment && (
            <div>
              <div className="kb-detail-section-label">File</div>
              <div className="kbc-attachment">
                <Icon id={card.attachment.icon} />
                <span><b>{card.attachment.bold}</b>{card.attachment.rest}</span>
              </div>
            </div>
          )}

          {card.progressPct !== undefined && (
            <div>
              <div className="kb-detail-section-label">Progress — {card.progressLabel}</div>
              <div className="progress" style={{ height: 8 }}>
                <div className="bar" style={{ width: `${card.progressPct}%` }} />
              </div>
            </div>
          )}

          {card.meta && card.meta.length > 0 && (
            <div>
              <div className="kb-detail-section-label">Details</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {card.meta.map((m, i) => (
                  <span key={i} className={`mi${m.urgent ? ' urgent' : m.soon ? ' soon' : ''}`} style={{ fontSize: 13 }}>
                    <Icon id={m.icon} /><span>{m.text}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="kb-detail-footer">
          <button className="btn secondary" style={{ flex: 1 }} onClick={onClose}>
            <Icon id="i-x" style={{ width: 14, height: 14 }} />Close
          </button>
          <button className="btn primary" style={{ flex: 1 }} onClick={() => { onMarkDone(); onClose() }}>
            <Icon id="i-check" style={{ width: 14, height: 14 }} />Done
          </button>
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
      {card.desc && <p className="kbc-desc">{card.desc}</p>}
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
  const [extraCards, setExtraCards] = useState<CardData[]>([])
  const [cardCols, setCardCols] = useState<Record<string, ColKey>>({})
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<ColKey | null>(null)
  const [selected, setSelected] = useState<CardData | null>(null)
  const [chipP01, setChipP01] = useState(true)
  const [chipOpenDay, setChipOpenDay] = useState(false)
  const [newTask, setNewTask] = useState<{ open: boolean; col: ColKey; title: string }>({ open: false, col: 'backlog', title: '' })
  const [toast, setToast] = useState<string | null>(null)

  const { data: kanbanData, loading, error, retry } = useFetch<CardData[]>('/api/kanban');

  useEffect(() => {
    if (kanbanData) {
      setFetchedCards(kanbanData);
      setCardCols(Object.fromEntries(kanbanData.map(c => [c.id, c.col as ColKey])));
    }
  }, [kanbanData]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const allCards = [...fetchedCards, ...extraCards]

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
    setNewTask({ open: true, col, title: '' })
  }

  function submitNewTask() {
    if (!newTask.title.trim()) return
    const id = `kb-x${Date.now()}`
    const card: CardData = {
      id, col: newTask.col, tags: [], title: newTask.title.trim(),
      priority: 'p-low', pLabel: 'P3', assignees: []
    }
    setExtraCards(prev => [...prev, card])
    setCardCols(prev => ({ ...prev, [id]: newTask.col }))
    setNewTask({ open: false, col: 'backlog', title: '' })
  }

  function handleDrop(e: React.DragEvent, col: ColKey) {
    e.preventDefault()
    const cardId = e.dataTransfer.getData('cardId') || dragging
    if (!cardId) return

    const prevCol = cardCols[cardId]
    if (prevCol === col) {
      setDragging(null)
      setDragOver(null)
      return
    }

    // Optimistic update
    setCardCols(prev => ({ ...prev, [cardId]: col }))

    // Send PATCH to server
    fetch(`/api/kanban/${cardId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ col })
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed to update task')
    })
    .catch(() => {
      // Rollback on error
      setCardCols(prev => ({ ...prev, [cardId]: prevCol }))
      setToast('Failed to move task. Please try again.')
    })

    setDragging(null)
    setDragOver(null)
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

  if (!loading && !error && allCards.length === 0) {
    return (
      <>
        <div className="page-head">
          <div className="title">
            <span className="eyebrow">SU:Core · Internal backlog</span>
            <h1>Core board · Sprint 14</h1>
          </div>
        </div>
        <EmptyState
          icon="grid"
          title="Board is empty"
          description="No tasks on the board. Start by adding a new task!"
        />
      </>
    )
  }

  return (
    <>
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#EF4444',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 500,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          zIndex: 2000,
          animation: 'slideUp 0.3s ease'
        }}>
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
                <input className="input" autoFocus placeholder="Task title…" value={newTask.title} onChange={e => setNewTask(t => ({ ...t, title: e.target.value }))} onKeyDown={e => e.key === 'Enter' && submitNewTask()} />
              </div>
              <div className="field">
                <label>Column</label>
                <select className="select" value={newTask.col} onChange={e => setNewTask(t => ({ ...t, col: e.target.value as ColKey }))}>
                  {COLS.filter(c => c.key !== 'done').map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                </select>
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
          onClose={() => setSelected(null)}
          onMarkDone={() => setCardCols(prev => ({ ...prev, [selected.id]: 'done' }))}
        />
      )}
    </>
  )
}
