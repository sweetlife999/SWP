import { useState, useEffect, useRef } from 'react'
import { Icon } from '../components/Icon'
import { api, type Member } from '../lib/api'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { ErrorBanner } from '../components/ErrorBanner'
import { useModalA11y, MODAL_A11Y_PROPS } from '../hooks/useModalA11y'
import { colClass, FALLBACK_COLS, PRIORITY_BORDER, type CardData, type ColKey, type KbColumn, type Priority } from '../components/kanban/types'
import { CardDetailPanel } from '../components/kanban/CardDetailPanel'
import { KbCard } from '../components/kanban/KbCard'
import { AutomationsPanel } from '../components/kanban/AutomationsPanel'

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
  const [newTask, setNewTask] = useState<{ open: boolean; col: ColKey; title: string; desc: string; priority: Priority; assignees: string[]; deadline: string }>({ open: false, col: 'backlog', title: '', desc: '', priority: 'p-mid', assignees: [], deadline: '' })
  // The board is SU:Core-only, so the assignee picker only offers SU:Core members.
  const [members, setMembers] = useState<Member[]>([])
  useEffect(() => {
    api.members.list('core').then(setMembers).catch(() => {})
  }, [])
  // Columns come from the DB (issue #126 AC4/AC5); FALLBACK_COLS only covers the gap before this resolves.
  const [cols, setCols] = useState<KbColumn[]>(FALLBACK_COLS)
  useEffect(() => {
    api.admin.kanban.columns()
      .then(fetched => setCols(fetched.map(c => ({
        key: c.key, label: c.label, color: c.color,
        cls: colClass(c.order_index), eyeBtn: c.key === 'done',
      }))))
      .catch(() => {})
  }, [])
  const [showAutomations, setShowAutomations] = useState(false)
  const closeNewTask = () => setNewTask(t => ({ ...t, open: false }))
  const newTaskRef = useModalA11y(newTask.open, closeNewTask)
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

  // Automations run server-side inside the same request that moves/creates a
  // card, so by the time that request resolves any triggered rule has already
  // run — this diffs stats_runs against the last known baseline and surfaces
  // it as a toast right on the board, instead of only inside the Automations
  // panel's own history view (issue #126 follow-up: runs weren't visible in
  // real time).
  const automationRunsRef = useRef<Record<number, number>>({})
  useEffect(() => {
    api.admin.kanban.automations.list()
      .then(list => { automationRunsRef.current = Object.fromEntries(list.map(a => [a.id, a.stats_runs])) })
      .catch(() => {})
  }, [])
  async function checkAutomationRuns() {
    try {
      const list = await api.admin.kanban.automations.list()
      for (const a of list) {
        // 0, not a.stats_runs, so an automation created after the initial
        // baseline fetch still toasts on its very first observed run.
        const prev = automationRunsRef.current[a.id] ?? 0
        if (a.stats_runs > prev) showToast(`⚡ Автоматизация «${a.name}» сработала`)
      }
      automationRunsRef.current = Object.fromEntries(list.map(a => [a.id, a.stats_runs]))
    } catch {
      // best-effort — a failed check here shouldn't disrupt the board
    }
  }

  // Optimistic move: update the UI immediately, persist via PATCH, roll back + toast on failure (US-10 AC2/AC3).
  async function moveCard(cardId: string, col: ColKey) {
    const prev = cardCols[cardId] ?? allCards.find(c => c.id === cardId)?.col
    if (!prev || prev === col) return
    setCardCols(p => ({ ...p, [cardId]: col }))
    // Locally-created tasks (kb-x…) have no backend row yet — skip persistence.
    if (cardId.startsWith('kb-x')) return
    try {
      await api.admin.kanban.patch(cardId, { col })
      checkAutomationRuns()
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
    const a = document.createElement('a'); a.href = url; a.download = 'kanban-board.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  function openNewTask(col: ColKey) {
    setNewTask({ open: true, col, title: '', desc: '', priority: 'p-mid', assignees: [], deadline: '' })
  }

  async function submitNewTask() {
    if (!newTask.title.trim()) return
    try {
      await api.admin.kanban.create({
        title: newTask.title.trim(),
        col: newTask.col,
        desc: newTask.desc.trim() || undefined,
        priority: newTask.priority,
        assignees: newTask.assignees.length ? newTask.assignees : undefined,
        deadline: newTask.deadline || undefined,
      })
      setNewTask({ open: false, col: 'backlog', title: '', desc: '', priority: 'p-mid', assignees: [], deadline: '' })
      retry()  // reload the board so the persisted card appears
      showToast('Задача создана')
      checkAutomationRuns()
    } catch {
      showToast('Не удалось создать задачу')
    }
  }

  // List/Timeline (issue #125 AC1/AC2) apply the same search+priority filters
  // as the board, but across all columns at once instead of per-column.
  function matchesFilters(c: CardData): boolean {
    if (chipP01 && c.priority === 'p-low') return false
    const q = search.trim().toLowerCase()
    if (!q) return true
    return c.title.toLowerCase().includes(q) || c.desc?.toLowerCase().includes(q) || false
  }
  const visibleCards = allCards.filter(matchesFilters)

  const [listSort, setListSort] = useState<{ key: 'title' | 'col' | 'priority' | 'assignees' | 'deadline'; dir: 1 | -1 }>({ key: 'col', dir: 1 })
  function toggleSort(key: typeof listSort.key) {
    setListSort(s => (s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: 1 }))
  }
  const colOrderIndex = (key: ColKey) => { const i = cols.findIndex(c => c.key === key); return i === -1 ? cols.length : i }
  const PRIORITY_ORDER: Record<Priority, number> = { 'p-high': 0, 'p-mid': 1, 'p-low': 2 }
  const sortedListCards = [...visibleCards].sort((a, b) => {
    let cmp = 0
    switch (listSort.key) {
      case 'title': cmp = a.title.localeCompare(b.title); break
      case 'col': cmp = colOrderIndex(cardCols[a.id] ?? a.col) - colOrderIndex(cardCols[b.id] ?? b.col); break
      case 'priority': cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]; break
      case 'assignees': cmp = (a.assignees[0]?.initials ?? '').localeCompare(b.assignees[0]?.initials ?? ''); break
      case 'deadline': cmp = (a.deadline ?? '9999-99-99').localeCompare(b.deadline ?? '9999-99-99'); break
    }
    return cmp * listSort.dir
  })

  const LIST_COLUMNS = [
    { key: 'title' as const, label: 'Задача' },
    { key: 'col' as const, label: 'Колонка' },
    { key: 'priority' as const, label: 'Приоритет' },
    { key: 'assignees' as const, label: 'Исполнители' },
    { key: 'deadline' as const, label: 'Срок' },
  ]

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
            <h1>Core board</h1>
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
            <h1>Core board</h1>
          </div>
        </div>
        <div className="board">
          {cols.map(col => (
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
          <h1>Core board</h1>
          <p className="text-muted" style={{ fontSize: 13, marginTop: 2 }}>
            Only for SU:Core team. Students do not see this page.
          </p>
        </div>
        <div className="row gap-2">
          <button className="btn secondary" onClick={exportCsv}>
            <Icon id="i-download" style={{ width: 14, height: 14 }} />Export CSV
          </button>
          <button className="btn secondary" onClick={() => setShowAutomations(true)}>
            <Icon id="i-spark" style={{ width: 14, height: 14 }} />Automations
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
        <button className={`filter-chip${chipP01 ? ' active' : ''}`} onClick={() => setChipP01(v => !v)}>
          <Icon id="i-flag" style={{ width: 12, height: 12 }} />Priority: P0–P1{chipP01 && <span className="x">×</span>}
        </button>
        <div style={{ marginLeft: 'auto' }} className="row gap-2">
          <div className="seg">
            {['Board', 'List', 'Timeline'].map((l, i) => (
              <button key={i} className={viewSeg === i ? 'active' : ''} onClick={() => setViewSeg(i)}>{l}</button>
            ))}
          </div>
        </div>
      </section>

      {viewSeg === 0 && (
      <div className="board-wrap">
        <div className="board">
          {cols.map(col => {
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
                  {!col.eyeBtn && (
                    <button className="add" onClick={() => openNewTask(col.key)}><Icon id="i-plus" /></button>
                  )}
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
      )}

      {viewSeg === 1 && (
        <div className="board-wrap">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {LIST_COLUMNS.map(c => (
                  <th
                    key={c.key}
                    onClick={() => toggleSort(c.key)}
                    style={{ textAlign: 'left', padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid var(--border)', fontSize: 12, color: 'var(--muted)', userSelect: 'none' }}
                  >
                    {c.label}{listSort.key === c.key && (listSort.dir === 1 ? ' ↑' : ' ↓')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedListCards.map(card => {
                const colKeyForCard = cardCols[card.id] ?? card.col
                const colMeta = cols.find(c => c.key === colKeyForCard)
                return (
                  <tr key={card.id} onClick={() => setSelected(card)} style={{ cursor: 'pointer', borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '8px 12px', fontSize: 13 }}>{card.title}</td>
                    <td style={{ padding: '8px 12px', fontSize: 12.5, color: colMeta?.color }}>{colMeta?.label ?? colKeyForCard}</td>
                    <td style={{ padding: '8px 12px', fontSize: 12.5 }}>{card.pLabel}</td>
                    <td style={{ padding: '8px 12px', fontSize: 12.5 }}>{card.assignees.map(a => a.initials).join(', ') || '—'}</td>
                    <td style={{ padding: '8px 12px', fontSize: 12.5 }}>{card.deadline ?? '—'}</td>
                  </tr>
                )
              })}
              {sortedListCards.length === 0 && (
                <tr><td colSpan={LIST_COLUMNS.length} style={{ padding: 20, textAlign: 'center', color: 'var(--muted)' }}>No tasks</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {viewSeg === 2 && (
        <div className="board-wrap">
          {(() => {
            const withDeadline = [...visibleCards].filter(c => c.deadline).sort((a, b) => (a.deadline ?? '').localeCompare(b.deadline ?? ''))
            const noDeadline = visibleCards.filter(c => !c.deadline)
            const groups: [string, CardData[]][] = []
            for (const c of withDeadline) {
              const last = groups[groups.length - 1]
              if (last && last[0] === c.deadline) last[1].push(c)
              else groups.push([c.deadline!, [c]])
            }
            const renderCard = (card: CardData) => (
              <div
                key={card.id}
                onClick={() => setSelected(card)}
                className="kbc"
                style={{ borderLeft: `4px solid ${card.blocker ? PRIORITY_BORDER['p-high'] : PRIORITY_BORDER[card.priority]}`, cursor: 'pointer', padding: '10px 12px' }}
              >
                <div style={{ fontSize: 13, fontWeight: 500 }}>{card.title}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                  {cols.find(c => c.key === (cardCols[card.id] ?? card.col))?.label}
                </div>
              </div>
            )
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {groups.map(([date, dateCards]) => (
                  <div key={date}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)', marginBottom: 8, borderLeft: '3px solid var(--brand, #60A5FA)', paddingLeft: 8 }}>
                      {new Date(date).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{dateCards.map(renderCard)}</div>
                  </div>
                ))}
                {noDeadline.length > 0 && (
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)', marginBottom: 8 }}>Без срока</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{noDeadline.map(renderCard)}</div>
                  </div>
                )}
                {visibleCards.length === 0 && (
                  <div style={{ padding: 20, textAlign: 'center', color: 'var(--muted)' }}>No tasks</div>
                )}
              </div>
            )
          })()}
        </div>
      )}

      <footer className="text-muted" style={{ fontSize: 12, textAlign: 'center', padding: '18px 0 8px', marginTop: 8, borderTop: '1px solid var(--border)' }}>
        Internal backlog · visible only to SU:Core team · <span className="text-mono">drag card ↔ to change status · click to open details</span>
      </footer>

      {newTask.open && (
        <div className="modal-overlay" onClick={closeNewTask}>
          <div
            className="dep-modal"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: 420 }}
            ref={newTaskRef}
            {...MODAL_A11Y_PROPS}
            aria-label="New task"
          >
            <button className="modal-close" onClick={closeNewTask} aria-label="Закрыть"><Icon id="i-x" style={{ width: 14, height: 14 }} /></button>
            <div className="dep-modal-header"><h2>New task</h2></div>
            <div className="dep-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="field">
                <label htmlFor="kb-title">Title</label>
                <input id="kb-title" className="input" autoFocus placeholder="Task title…" value={newTask.title} onChange={e => setNewTask(t => ({ ...t, title: e.target.value }))} />
              </div>
              <div className="field">
                <label htmlFor="kb-desc">Description</label>
                <textarea id="kb-desc" className="textarea" rows={2} placeholder="Что нужно сделать…" value={newTask.desc} onChange={e => setNewTask(t => ({ ...t, desc: e.target.value }))} />
              </div>
              <div className="row gap-3">
                <div className="field" style={{ flex: 1 }}>
                  <label htmlFor="kb-col">Column</label>
                  <select id="kb-col" className="select" value={newTask.col} onChange={e => setNewTask(t => ({ ...t, col: e.target.value as ColKey }))}>
                    {cols.filter(c => c.key !== 'done').map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                  </select>
                </div>
                <div className="field" style={{ flex: 1 }}>
                  <label htmlFor="kb-priority">Priority</label>
                  <select id="kb-priority" className="select" value={newTask.priority} onChange={e => setNewTask(t => ({ ...t, priority: e.target.value as Priority }))}>
                    <option value="p-high">P0 · Urgent</option>
                    <option value="p-mid">P1 · High</option>
                    <option value="p-low">P2 · Low</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label htmlFor="kb-assignee">Assignees (Ctrl/Cmd-click for multiple)</label>
                <select
                  id="kb-assignee"
                  className="select"
                  multiple
                  style={{ height: 'auto', minHeight: 72 }}
                  value={newTask.assignees}
                  onChange={e => setNewTask(t => ({ ...t, assignees: Array.from(e.target.selectedOptions, o => o.value) }))}
                >
                  {members.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="kb-deadline">Deadline</label>
                <input
                  id="kb-deadline"
                  type="date"
                  className="input"
                  value={newTask.deadline}
                  onChange={e => setNewTask(t => ({ ...t, deadline: e.target.value }))}
                />
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
          cols={cols}
          onClose={() => setSelected(null)}
          onMarkDone={() => moveCard(selected.id, 'done')}
          onDelete={() => deleteCard(selected.id)}
          onSave={async patch => {
            try {
              await api.admin.kanban.patch(selected.id, patch)
              setSelected(null)
              retry()
              showToast('Карточка сохранена')
              checkAutomationRuns()
            } catch {
              showToast('Не удалось сохранить карточку')
            }
          }}
        />
      )}

      {showAutomations && (
        <AutomationsPanel cols={cols} members={members} onClose={() => setShowAutomations(false)} />
      )}
    </>
  )
}
