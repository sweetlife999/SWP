import { useState, useEffect } from 'react'
import { Icon } from '../components/Icon'
import { api, type Event } from '../lib/api'

const BLANK_EVENT: Omit<Event, 'id'> = {
  title: '', desc: '', date: '', dd: '', mm: '', cover: '',
  tag: 'SU:Core', tagCls: 'green', time: '', foot: '', past: false,
}

const MONTH_ABBR = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']

export default function EventsManagementPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState<Partial<Event>>({})
  const [addingEvent, setAddingEvent] = useState(false)
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>(BLANK_EVENT)
  const [toast, setToast] = useState('')

  useEffect(() => {
    loadEvents()
  }, [])

  async function loadEvents() {
    try {
      const data = await api.admin.events.list()
      setEvents(data)
    } catch {
      showToast('Ошибка загрузки событий')
    }
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  async function handleAddEvent() {
    const d = new Date(newEvent.date)
    const ev = {
      ...newEvent,
      dd: newEvent.date ? String(d.getDate()).padStart(2, '0') : '',
      mm: newEvent.date ? MONTH_ABBR[d.getMonth()] : '',
    }
    try {
      const created = await api.events.create(ev)
      setEvents(prev => [...prev, created])
      showToast('Событие создано')
    } catch {
      showToast('Ошибка создания события')
    }
    setNewEvent(BLANK_EVENT)
    setAddingEvent(false)
  }

  async function handleSaveEdit(id: number) {
    try {
      await api.admin.events.update(id, editData)
      setEvents(prev => prev.map(e => e.id === id ? { ...e, ...editData } : e))
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
          <Icon id="i-plus" style={{ width: 14, height: 14 }} /> Добавить событие
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
                    onChange={e => setEditData(v => ({ ...v, title: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Описание</label>
                  <textarea
                    className="textarea"
                    rows={2}
                    value={editData.desc ?? ev.desc}
                    onChange={e => setEditData(v => ({ ...v, desc: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Дата</label>
                  <input
                    className="input"
                    type="date"
                    value={editData.date ?? ev.date}
                    onChange={e => setEditData(v => ({ ...v, date: e.target.value }))}
                  />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn ghost" onClick={() => setEditingId(null)}>Отмена</button>
                  <button className="btn primary" onClick={() => handleSaveEdit(ev.id as number)}>Сохранить</button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 12 }}>
                  <span className={`tag ${ev.tagCls}`} style={{ fontSize: 11 }}>{ev.tag}</span>
                  {ev.past && <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--text-muted)' }}>Прошедшее</span>}
                </div>
                <h3 style={{ marginBottom: 8, fontSize: 16, lineHeight: 1.2 }}>{ev.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>{ev.desc}</p>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
                  <div>{ev.dd} {ev.mm}{ev.time && ` · ${ev.time}`}</div>
                  {ev.foot && <div>{ev.foot}</div>}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="btn ghost"
                    style={{ fontSize: 12, flex: 1 }}
                    onClick={() => {
                      setEditingId(ev.id as number)
                      setEditData({ title: ev.title, desc: ev.desc, date: ev.date })
                    }}
                  >
                    <Icon id="i-edit" style={{ width: 12, height: 12 }} /> Редактировать
                  </button>
                  <button
                    className="btn ghost"
                    style={{ fontSize: 12, color: 'var(--red)' }}
                    onClick={() => handleDeleteEvent(ev.id as number)}
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
            <div className="member-modal-body" style={{ paddingTop: 24 }}>
              <h3 style={{ marginBottom: 20 }}>Новое событие</h3>
              <div className="col gap-3">
                <div className="field">
                  <label>Название</label>
                  <input className="input" placeholder="Hackathon Summer 24h" value={newEvent.title} onChange={e => setNewEvent(v => ({ ...v, title: e.target.value }))} />
                </div>
                <div className="field">
                  <label>Описание</label>
                  <textarea className="textarea" rows={2} placeholder="Краткое описание…" value={newEvent.desc} onChange={e => setNewEvent(v => ({ ...v, desc: e.target.value }))} />
                </div>
                <div className="row gap-3">
                  <div className="field" style={{ flex: 1 }}>
                    <label>Дата</label>
                    <input className="input" type="date" value={newEvent.date} onChange={e => setNewEvent(v => ({ ...v, date: e.target.value }))} />
                  </div>
                  <div className="field" style={{ flex: 1 }}>
                    <label>Время (опц.)</label>
                    <input className="input" placeholder="19:00" value={newEvent.time ?? ''} onChange={e => setNewEvent(v => ({ ...v, time: e.target.value }))} />
                  </div>
                </div>
                <div className="row gap-3">
                  <div className="field" style={{ flex: 1 }}>
                    <label>Департамент</label>
                    <select className="input" value={newEvent.tag} onChange={e => {
                      const map: Record<string, string> = { 'SU:Core': 'green', 'SU:Active': 'blue', 'SU:Media': 'purple' }
                      setNewEvent(v => ({ ...v, tag: e.target.value, tagCls: map[e.target.value] ?? 'green' }))
                    }}>
                      <option>SU:Core</option>
                      <option>SU:Active</option>
                      <option>SU:Media</option>
                    </select>
                  </div>
                  <div className="field" style={{ flex: 1 }}>
                    <label>Статус</label>
                    <select className="input" value={newEvent.past ? 'past' : 'current'} onChange={e => setNewEvent(v => ({ ...v, past: e.target.value === 'past' }))}>
                      <option value="current">Текущее</option>
                      <option value="past">Прошедшее</option>
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label>Доп. инфо (участники, места)</label>
                  <input className="input" placeholder="32 участника" value={newEvent.foot} onChange={e => setNewEvent(v => ({ ...v, foot: e.target.value }))} />
                </div>
                <div className="row gap-2" style={{ justifyContent: 'flex-end', marginTop: 8 }}>
                  <button className="btn ghost" onClick={() => setAddingEvent(false)}>Отмена</button>
                  <button className="btn primary" disabled={!newEvent.title.trim() || !newEvent.date} onClick={handleAddEvent}>Добавить</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
