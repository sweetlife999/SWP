import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { api } from '../lib/api'
import { useAdmin } from '../lib/AdminContext'

const BLANK_EVENT = {
  title: '',
  description: '',
  event_date: '',
  event_time: '',
  department: 'core',
  cover_class: '',
  foot_text: '',
  foot_label: '',
  status: 'draft',
}

function EventCard({ ev }: { ev: any }) {
  const label = statusLabel(ev)
  const isPast = ev.past ?? (ev.event_date ? new Date(ev.event_date) < new Date() : false)
  
  return (
    <Link className={`event-card${ev.featured ? ' featured' : ''}${isPast ? ' passed' : ''}`} to={`/events/${ev.id}`}>
      <div className={`ec-cover${ev.cover_class ?? ev.cover ? ` ${ev.cover_class ?? ev.cover}` : ''}${isPast ? ' passed-cover' : ''}`}>
        <div className="date-badge">
          <div className="d">{ev.dd}</div>
          <div className="m">{ev.mm}</div>
        </div>
        {label && (
          <span className={`status-badge${ev.status === 'published' ? ' live' : ''}`}>{label}</span>
        )}
      </div>
      <div className="ec-body">
        <div className="ec-meta">
          <span className={`tag ${ev.tagCls ?? 'green'}`}>
            <span className="dot"></span>
            {ev.tag ?? `SU:${ev.department}`}
          </span>
          {(ev.event_time || ev.time) && <span>{ev.event_time ?? ev.time}</span>}
        </div>
        <h3>{ev.title}</h3>
        <p className="desc">{ev.description ?? ev.desc}</p>
        <div className="ec-foot">
          <span>{ev.foot_text ?? ev.foot}</span>
          <span className="open">
            {ev.foot_label ?? ev.footLabel ?? 'Подробнее'}{' '}
            <Icon id="i-arrow-r" style={{ width: 12, height: 12 }} />
          </span>
        </div>
      </div>
    </Link>
  )
}

function statusLabel(ev: any) {
  if (ev.status_text ?? ev.statusText) return ev.status_text ?? ev.statusText
  if (ev.status === 'published') return 'live'
  return ev.status ?? ''
}

function sortEvents(list: any[]) {
  return [...list].sort((a, b) => {
    const dateA = a.event_date ?? a.date ?? ''
    const dateB = b.event_date ?? b.date ?? ''
    return dateB.localeCompare(dateA) || b.id - a.id
  })
}

export default function EventsPage() {
  const { isAdmin } = useAdmin()
  const [events, setEvents] = useState<any[]>([])
  const [seg1, setSeg1] = useState(0)
  const [search, setSearch] = useState('')
  const [showCal, setShowCal] = useState(false)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [limit, setLimit] = useState(4)
  const [addingEvent, setAddingEvent] = useState(false)
  const [newEvent, setNewEvent] = useState<Record<string, any>>(BLANK_EVENT)

  useEffect(() => {
    api.events.list().then(setEvents).catch(() => {})
  }, [])

  async function handleAddEvent() {
    try {
      const created = await api.admin.events.create(newEvent as any)
      const published = await api.admin.events.update(created.id, { status: 'published' })
      setEvents(prev => sortEvents([...prev, published]))
    } catch {
      // Keep current list on execution errors
    }
    setNewEvent(BLANK_EVENT)
    setAddingEvent(false)
  }

  function applyFilter(list: any[]) {
    return list.filter(ev => {
      const evDate = ev.event_date ?? ev.date ?? ''
      if (search && !ev.title.toLowerCase().includes(search.toLowerCase())) return false
      if (dateFrom && evDate < dateFrom) return false
      if (dateTo && evDate > dateTo) return false
      return true
    })
  }

  const allCurrent = applyFilter(events.filter(ev => !(ev.past ?? (ev.event_date ? new Date(ev.event_date) < new Date() : false))))
  const allPast    = applyFilter(events.filter(ev => !!(ev.past ?? (ev.event_date ? new Date(ev.event_date) < new Date() : false))))
  const current    = allCurrent.slice(0, limit)
  const past       = allPast.slice(0, limit)
  const hasMore    = seg1 === 0 ? allCurrent.length > limit : allPast.length > limit
  const hasDateFilter = !!(dateFrom || dateTo)

  return (
    <>
      <div className="page-head">
        <div className="title">
          <span className="eyebrow">Жизнь кампуса</span>
          <h1>Events</h1>
          <p className="lead" style={{ fontSize: 14, marginTop: 6 }}>Ближайшие и прошедшие мероприятия от студсовета.</p>
        </div>
        <div className="row gap-2">
          {isAdmin && (
            <button className="btn primary" onClick={() => setAddingEvent(true)}>
              <Icon id="i-plus" style={{ width: 14, height: 14 }} />Добавить ивент
            </button>
          )}
          <div className="input-group" style={{ width: 220 }}>
            <Icon id="i-search" className="ic" />
            <input
              placeholder="Поиск мероприятий…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button
            className={`btn secondary${showCal ? ' cal-active' : ''}`}
            onClick={() => setShowCal(!showCal)}
            style={showCal ? { background: 'var(--accent-50)', borderColor: 'var(--accent)', color: 'var(--accent-700)' } : {}}
          >
            <Icon id="i-calendar" style={{ width: 14, height: 14 }} />
            Календарь
            {hasDateFilter && <span className="cal-dot"></span>}
          </button>
        </div>
      </div>

      {showCal && (
        <div className="date-panel">
          <div className="date-field">
            <label>С даты</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          </div>
          <div className="date-field">
            <label>По дату</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
          </div>
          {hasDateFilter && (
            <button className="btn ghost sm" onClick={() => { setDateFrom(''); setDateTo('') }}>
              <Icon id="i-x" style={{ width: 12, height: 12 }} /> Сбросить
            </button>
          )}
        </div>
      )}

      <div className="filters-bar">
        <div className="seg">
          {['Текущие', 'Прошедшие'].map((label, i) => (
            <button key={i} className={seg1 === i ? 'active' : ''} onClick={() => { setSeg1(i); setLimit(4) }}>{label}</button>
          ))}
        </div>
      </div>

      {seg1 === 0 && (
        <>
          <div className="section-head-row">
            <h3>Текущие <span className="count">{String(current.length).padStart(2, '0')}</span></h3>
          </div>
          <div className="events-grid">
            {current.map(ev => <EventCard key={ev.id} ev={ev} />)}
            {current.length === 0 && (
              <p className="text-muted" style={{ gridColumn: '1/-1', padding: '24px 0' }}>
                {events.length === 0 ? 'Загрузка…' : 'Мероприятия не найдены'}
              </p>
            )}
          </div>
        </>
      )}

      {seg1 === 1 && (
        <>
          <div className="section-head-row">
            <h3>Прошедшие <span className="count">{String(past.length).padStart(2, '0')}</span></h3>
          </div>
          <div className="events-grid">
            {past.map(ev => <EventCard key={ev.id} ev={ev} />)}
            {past.length === 0 && (
              <p className="text-muted" style={{ gridColumn: '1/-1', padding: '24px 0' }}>
                {events.length === 0 ? 'Загрузка…' : 'Мероприятия не найдены'}
              </p>
            )}
          </div>
        </>
      )}

      {hasMore && (
        <div className="row" style={{ justifyContent: 'center', marginTop: 32 }}>
          <button className="btn secondary" onClick={() => setLimit(l => l + 4)}>Загрузить ещё <Icon id="i-chevron-d" style={{ width: 14, height: 14 }} /></button>
        </div>
      )}

      {addingEvent && (
        <div className="modal-overlay" onClick={() => setAddingEvent(false)}>
          <div className="member-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <button className="modal-close" onClick={() => setAddingEvent(false)}>
              <Icon id="i-x" style={{ width: 14, height: 14 }} />
            </button>
            <div className="member-modal-body" style={{ paddingTop: 24 }}>
              <h3 style={{ marginBottom: 20 }}>Новое мероприятие</h3>
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
                  <div className="field" style={{ flex: 1 }}>
                    <label>Локация (Комната / Зал)</label>
                    <input className="input" value={newEvent.foot_label} onChange={e => setNewEvent({ ...newEvent, foot_label: e.target.value })} />
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