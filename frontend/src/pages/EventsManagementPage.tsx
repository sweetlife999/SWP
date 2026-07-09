import { useState, useEffect } from 'react'
import { Icon } from '../components/Icon'
import { api, type Event } from '../lib/api'

// Define a type for custom dynamic database extensions safely
type DatabaseEvent = Event & {
  description?: string
  event_date?: string
  event_time?: string
  department?: string
  cover_class?: string
  foot_text?: string
  status_text?: string
  tagCls?: string
}

const BLANK_EVENT = {
  title: '',
  description: '',
  event_date: '',
  event_time: '',
  department: '',
  cover_class: '',
  foot_text: '',
  status: 'draft',
}

function sortEvents(list: DatabaseEvent[]) {
  return [...list].sort((a, b) => {
    const dateA = a.event_date ?? a.date ?? ''
    const dateB = b.event_date ?? b.date ?? ''
    return dateB.localeCompare(dateA) || b.id - a.id
  })
}

export default function EventsManagementPage() {
  const [events, setEvents] = useState<DatabaseEvent[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState<Partial<DatabaseEvent>>({})
  const [addingEvent, setAddingEvent] = useState(false)
  const [newEvent, setNewEvent] = useState<typeof BLANK_EVENT>(BLANK_EVENT)
  const [toast, setToast] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadEvents() {
      try {
        const data = await api.admin.events.list() as DatabaseEvent[]
        if (!cancelled) setEvents(data)
      } catch {
        if (!cancelled) showToast('Ошибка загрузки событий')
      }
    }

    loadEvents()

    return () => {
      cancelled = true
    }
  }, [])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  async function handleAddEvent() {
    try {
      const created = await api.admin.events.create(newEvent) as DatabaseEvent
      const published = await api.admin.events.update(created.id, { status: 'published' })
      setEvents(prev => sortEvents([...prev, published as DatabaseEvent]))
      showToast('Событие создано')
    } catch {
      showToast('Ошибка создания события')
    }
    setNewEvent(BLANK_EVENT)
    setAddingEvent(false)
  }

  async function handleSaveEdit(id: number) {
    try {
      const updated = await api.admin.events.update(id, editData as Partial<Event>)
      setEvents(prev => sortEvents(prev.map(e => e.id === id ? (updated as DatabaseEvent) : e)))
      showToast('Изменения сохранены')
      setEditingId(null)
    } catch {
      showToast('Ошибка сохранения')
    }
  }

  async function handleDeleteEvent(id: number) {
    if (!confirm('Удалить это событие?')) return
    try {
      await api.admin.events.delete(id)
      setEvents(prev => prev.filter(e => e.id !== id))
      showToast('Событие удалено')
    } catch {
      showToast('Ошибка удаления')
    }
  }

  return (
    <>
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: 'var(--fg)', color: 'var(--bg)', padding: '10px 20px', borderRadius: 8, fontSize: 13, zIndex: 9999, pointerEvents: 'none' }}>
          {toast}
        </div>
      )}

      <div className="page-head">
        <div className="title">
          <span className="eyebrow">Admin</span>
          <h1>Управление событиями</h1>
          <p className="lead" style={{ fontSize: 14, marginTop: 6 }}>Создавайте, редактируйте и удаляйте события.</p>
        </div>
        <button className="btn primary" onClick={() => setAddingEvent(true)}>
          <Icon id="i-plus" style={{ width: 14, height: 14 }} /> Добавить ивент
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, marginTop: 24 }}>
        {events.map(ev => (
          <div key={ev.id} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 16, background: editingId === ev.id ? 'var(--accent-50)' : 'var(--bg)' }}>
            {editingId === ev.id ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Название</label>
                  <input
                    className="input"
                    value={editData.title ?? ev.title}
                    onChange={e => setEditData({ ...editData, title: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Описание</label>
                  <textarea
                    className="textarea"
                    rows={2}
                    value={editData.description ?? editData.desc ?? ev.description ?? ev.desc ?? ''}
                    onChange={e => setEditData({ ...editData, description: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Дата</label>
                  <input
                    className="input"
                    type="date"
                    value={editData.event_date ?? editData.date ?? ev.event_date ?? ev.date ?? ''}
                    onChange={e => setEditData({ ...editData, event_date: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Статус</label>
                  <select
                    className="input"
                    value={editData.status ?? ev.status}
                    onChange={e => setEditData({ ...editData, status: e.target.value as 'draft' | 'published' | 'archived' })}
                  >
                    <option value="draft">Черновик</option>
                    <option value="published">Опубликован</option>
                    <option value="archived">Архив</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn ghost" onClick={() => setEditingId(null)}>Отмена</button>
                  <button className="btn primary" onClick={() => handleSaveEdit(ev.id)}>Сохранить</button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 12 }}>
                  <span className={`tag ${ev.tagCls ?? 'green'}`} style={{ fontSize: 11 }}>
                    {ev.tag ?? (ev.department ? `SU:${ev.department}` : '')}
                  </span>
                  {ev.past && <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--text-muted)' }}>Прошедшее</span>}
                </div>
                <h3 style={{ marginBottom: 8, fontSize: 16, lineHeight: 1.2 }}>{ev.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>{ev.description ?? ev.desc}</p>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
                  <div>{ev.dd} {ev.mm}{(ev.event_time ?? ev.time) ? ` · ${ev.event_time ?? ev.time}` : ''}</div>
                  <div>{ev.foot_text ?? ev.foot ?? ''}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="btn ghost"
                    style={{ fontSize: 12, flex: 1 }}
                    onClick={() => {
                      setEditingId(ev.id)
                      setEditData({ 
                        title: ev.title, 
                        description: ev.description ?? ev.desc, 
                        event_date: ev.event_date ?? ev.date,
                        status: ev.status
                      })
                    }}
                  >
                    <Icon id="i-edit" style={{ width: 12, height: 12 }} /> Редактировать
                  </button>
                  <button
                    className="btn ghost"
                    style={{ fontSize: 12, color: 'var(--red)' }}
                    onClick={() => handleDeleteEvent(ev.id)}
                  >
                    <Icon id="i-trash" style={{ width: 12, height: 12 }} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        {events.length === 0 && (
          <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
            Событий не найдено
          </p>
        )}
      </div>

      {addingEvent && (
        <div className="modal-overlay" onClick={() => setAddingEvent(false)}>
          <div className="member-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <button className="modal-close" onClick={() => setAddingEvent(false)}>
              <Icon id="i-x" style={{ width: 14, height: 14 }} />
            </button>
            <div className="member-modal-body" style={{ paddingTop: 24, textAlign: 'left' }}>
              <h3 style={{ marginBottom: 20 }}>Новое событие</h3>
              <div className="col gap-3">
                <div className="field">
                  <label>Название</label>
                  <input className="input" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} />
                </div>
                <div className="field">
                  <label>Описание</label>
                  <textarea className="textarea" rows={2} value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} />
                </div>
                <div className="row gap-3">
                  <div className="field" style={{ flex: 1 }}>
                    <label>Дата</label>
                    <input className="input" type="date" value={newEvent.event_date} onChange={e => setNewEvent({ ...newEvent, event_date: e.target.value })} />
                  </div>
                  <div className="field" style={{ flex: 1 }}>
                    <label>Время (опц.)</label>
                    <input className="input" value={newEvent.event_time} onChange={e => setNewEvent({ ...newEvent, event_time: e.target.value })} />
                  </div>
                </div>
                <div className="row gap-3">
                  <div className="field" style={{ flex: 1 }}>
                    <label>Департамент (SQL Type)</label>
                    <select className="input" value={newEvent.department} onChange={e => setNewEvent({ ...newEvent, department: e.target.value })}>
                      <option value="core">SU:Core</option>
                      <option value="active">SU:Active</option>
                      <option value="media">SU:Media</option>
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label>Текст подвала (foot_text)</label>
                  <input className="input" value={newEvent.foot_text} onChange={e => setNewEvent({ ...newEvent, foot_text: e.target.value })} />
                </div>
                <div className="row gap-2" style={{ justifyContent: 'flex-end', marginTop: 8 }}>
                  <button className="btn ghost" onClick={() => setAddingEvent(false)}>Отмена</button>
                  <button className="btn primary" disabled={!newEvent.title.trim() || !newEvent.event_date} onClick={handleAddEvent}>Добавить</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}