import { useState, useEffect, useRef } from 'react'
import { Icon } from '../Icon'
import { api, type Automation, type AutomationAction, type AutomationActionType, type AutomationRun, type Member } from '../../lib/api'
import { useModalA11y, MODAL_A11Y_PROPS } from '../../hooks/useModalA11y'
import type { KbColumn } from './types'

interface AutomationsPanelProps {
  cols: KbColumn[]
  members: Member[]
  onClose: () => void
}

// Poll while the panel is open so runs from elsewhere (another tab, another
// admin) show up without closing/reopening — the app has no websocket/event
// infra, so short polling is the honest "real-time" ceiling here.
const POLL_MS = 4000

const ACTION_LABEL: Record<AutomationActionType, string> = {
  change_column: 'Переместить в колонку',
  assign_user: 'Назначить',
}

function blankAction(cols: KbColumn[]): AutomationAction {
  return { type: 'change_column', params: { to: cols[0]?.key ?? '' } }
}

// Renders the message for one entry from AutomationRunOut.details.actions —
// those are plain strings the backend already composed ("moved to done",
// "assigned Дима"), so this is just a pass-through for readability.
function runLine(r: AutomationRun) {
  if (r.status === 'failure') return r.details.error ?? 'ошибка'
  return (r.details.actions ?? []).join(', ') || '—'
}

export function AutomationsPanel({ cols, members, onClose }: AutomationsPanelProps) {
  const [automations, setAutomations] = useState<Automation[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedHistory, setExpandedHistory] = useState<number | null>(null)
  const [history, setHistory] = useState<AutomationRun[]>([])
  const [name, setName] = useState('')
  const [triggerType, setTriggerType] = useState<'column_changed' | 'task_created'>('column_changed')
  const [toColumn, setToColumn] = useState('') // '' = any column
  const [actions, setActions] = useState<AutomationAction[]>([])
  const [busy, setBusy] = useState(false)
  const ref = useModalA11y(true, onClose)
  const expandedHistoryRef = useRef(expandedHistory)
  useEffect(() => { expandedHistoryRef.current = expandedHistory }, [expandedHistory])

  function load() {
    api.admin.kanban.automations.list().then(setAutomations).catch(() => {}).finally(() => setLoading(false))
  }
  function loadHistory(id: number) {
    api.admin.kanban.automations.runHistory(id).then(setHistory).catch(() => {})
  }

  useEffect(() => {
    load()
    const id = setInterval(() => {
      load()
      if (expandedHistoryRef.current != null) loadHistory(expandedHistoryRef.current)
    }, POLL_MS)
    return () => clearInterval(id)
  }, [])

  async function toggleActive(a: Automation) {
    await api.admin.kanban.automations.patch(a.id, { is_active: !a.is_active }).catch(() => {})
    load()
  }
  async function remove(id: number) {
    if (!window.confirm('Удалить автоматизацию?')) return
    await api.admin.kanban.automations.remove(id).catch(() => {})
    load()
  }
  function viewHistory(id: number) {
    if (expandedHistory === id) { setExpandedHistory(null); return }
    setExpandedHistory(id)
    loadHistory(id)
  }

  function addAction() {
    setActions(a => [...a, blankAction(cols)])
  }
  function removeAction(i: number) {
    setActions(a => a.filter((_, idx) => idx !== i))
  }
  function updateAction(i: number, patch: Partial<AutomationAction>) {
    setActions(a => a.map((act, idx) => (idx === i ? { ...act, ...patch, params: { ...act.params, ...patch.params } } : act)))
  }
  function setActionType(i: number, type: AutomationActionType) {
    setActions(a => a.map((act, idx) => {
      if (idx !== i) return act
      return type === 'change_column' ? { type, params: { to: cols[0]?.key ?? '' } } : { type, params: { name: members[0]?.name ?? '' } }
    }))
  }

  async function create() {
    if (!name.trim() || actions.length === 0) return
    setBusy(true)
    try {
      await api.admin.kanban.automations.create({
        name: name.trim(),
        trigger_type: triggerType,
        trigger_filters: triggerType === 'column_changed' && toColumn ? { to_column: toColumn } : {},
        actions,
      })
      setName(''); setToColumn(''); setActions([])
      load()
    } finally {
      setBusy(false)
    }
  }

  function triggerLabel(a: Automation): string {
    if (a.trigger_type === 'task_created') return 'Когда создана новая задача'
    const to = a.trigger_filters.to_column
    if (!to) return 'Когда перемещена в любую колонку'
    return `Когда перемещена → ${cols.find(c => c.key === to)?.label ?? to}`
  }

  function actionLabel(act: AutomationAction): string {
    if (act.type === 'change_column') return `переместить в ${cols.find(c => c.key === act.params.to)?.label ?? act.params.to}`
    return `назначить ${act.params.name}`
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="dep-modal"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 600 }}
        ref={ref}
        {...MODAL_A11Y_PROPS}
        aria-label="Автоматизации"
      >
        <button className="modal-close" onClick={onClose} aria-label="Закрыть"><Icon id="i-x" style={{ width: 14, height: 14 }} /></button>
        <div className="dep-modal-header"><h2>Автоматизации</h2></div>
        <div className="dep-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: '65vh', overflowY: 'auto' }}>
          {loading ? (
            <p className="text-muted" style={{ fontSize: 13 }}>Загрузка…</p>
          ) : automations.length === 0 ? (
            <p className="text-muted" style={{ fontSize: 13 }}>Автоматизаций пока нет.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {automations.map(a => (
                <div key={a.id} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <div>
                      <strong style={{ fontSize: 13.5, opacity: a.is_active ? 1 : 0.5 }}>{a.name}</strong>
                      <div className="text-muted" style={{ fontSize: 12 }}>{triggerLabel(a)}</div>
                      <ul style={{ margin: '4px 0 0', paddingLeft: 16, fontSize: 12, color: 'var(--muted)' }}>
                        {a.actions.map((act, i) => <li key={i}>{actionLabel(act)}</li>)}
                      </ul>
                      <div className="text-muted" style={{ fontSize: 11.5, marginTop: 4 }}>{a.stats_runs} запусков</div>
                    </div>
                    <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                      <button className="btn secondary" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => toggleActive(a)}>
                        {a.is_active ? 'Выкл' : 'Вкл'}
                      </button>
                      <button className="btn secondary" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => viewHistory(a.id)}>
                        История
                      </button>
                      <button className="btn danger" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => remove(a.id)}>
                        <Icon id="i-trash" style={{ width: 12, height: 12 }} />
                      </button>
                    </div>
                  </div>
                  {expandedHistory === a.id && (
                    <div style={{ marginTop: 8, borderTop: '1px solid var(--border)', paddingTop: 8 }}>
                      {history.length === 0 ? (
                        <p className="text-muted" style={{ fontSize: 12 }}>Ещё не запускалась.</p>
                      ) : history.map(r => (
                        <div key={r.id} style={{ fontSize: 12, color: r.status === 'failure' ? '#EF4444' : 'var(--muted)' }}>
                          {new Date(r.ran_at).toLocaleString('ru-RU')} · {runLine(r)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="kb-detail-section-label">Новая автоматизация</div>
            <input className="input" placeholder="Название…" value={name} onChange={e => setName(e.target.value)} />

            <div>
              <div className="text-muted" style={{ fontSize: 11.5, marginBottom: 4 }}>КОГДА</div>
              <div className="row gap-3">
                <select className="select" value={triggerType} onChange={e => setTriggerType(e.target.value as typeof triggerType)}>
                  <option value="column_changed">Карточка перемещена</option>
                  <option value="task_created">Создана новая задача</option>
                </select>
                {triggerType === 'column_changed' && (
                  <select className="select" value={toColumn} onChange={e => setToColumn(e.target.value)}>
                    <option value="">в любую колонку</option>
                    {cols.map(c => <option key={c.key} value={c.key}>в «{c.label}»</option>)}
                  </select>
                )}
              </div>
            </div>

            <div>
              <div className="text-muted" style={{ fontSize: 11.5, marginBottom: 4 }}>ТОГДА</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {actions.map((act, i) => (
                  <div key={i} className="row gap-2" style={{ alignItems: 'center' }}>
                    <select
                      className="select"
                      style={{ width: 'auto' }}
                      value={act.type}
                      onChange={e => setActionType(i, e.target.value as AutomationActionType)}
                    >
                      {(Object.keys(ACTION_LABEL) as AutomationActionType[]).map(t => (
                        <option key={t} value={t}>{ACTION_LABEL[t]}</option>
                      ))}
                    </select>
                    {act.type === 'change_column' ? (
                      <select
                        className="select"
                        style={{ width: 'auto' }}
                        value={act.params.to ?? ''}
                        onChange={e => updateAction(i, { params: { to: e.target.value } })}
                      >
                        {cols.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                      </select>
                    ) : (
                      <select
                        className="select"
                        style={{ width: 'auto' }}
                        value={act.params.name ?? ''}
                        onChange={e => updateAction(i, { params: { name: e.target.value } })}
                      >
                        {members.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                      </select>
                    )}
                    <button className="icon-btn" aria-label="Убрать действие" onClick={() => removeAction(i)}>
                      <Icon id="i-x" style={{ width: 12, height: 12 }} />
                    </button>
                  </div>
                ))}
                <button className="btn secondary" style={{ alignSelf: 'flex-start', padding: '4px 10px', fontSize: 12.5 }} onClick={addAction}>
                  <Icon id="i-plus" style={{ width: 12, height: 12 }} />Добавить действие
                </button>
              </div>
            </div>

            <button className="btn primary" disabled={busy || !name.trim() || actions.length === 0} onClick={create}>
              <Icon id="i-plus" style={{ width: 14, height: 14 }} />Создать
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
