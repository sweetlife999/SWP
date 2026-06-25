import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { api, type Event } from '../lib/api'
import { useAdmin } from '../lib/AdminContext'
import { useFetch } from '../hooks/useFetch'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { ErrorBanner } from '../components/ErrorBanner'
import { EmptyState } from '../components/EmptyState'

const BLANK_EVENT = {
  title: '',
  desc: '',
  date: '',
  dd: '',
  mm: '',
  cover: '',
  tag: '',
  tagCls: '',
  time: '',
  foot: '',
  past: false,
}

function EventCard({ ev }: { ev: Event }) {
  // cast ev locally, so compiler understands snake_case backend parameters
  const dbEv = ev as Event & {
    event_date?: string
    cover_class?: string
    department?: string
    event_time?: string
    description?: string
    foot_text?: string
    foot_label?: string
  }

  const label = statusLabel(ev)
  
  const isPast = dbEv.past ?? (dbEv.event_date ? new Date(dbEv.event_date) < new Date() : false)
  const coverClass = dbEv.cover_class ?? dbEv.cover ?? ''
  const tagText = dbEv.tag ?? (dbEv.department ? `SU:${dbEv.department}` : '')
  const tagClass = dbEv.tagCls ?? 'green'
  const timeText = dbEv.event_time ?? dbEv.time ?? ''
  const description = dbEv.description ?? dbEv.desc ?? ''
  const footerText = dbEv.foot_text ?? dbEv.foot ?? ''
  const footerLabel = dbEv.foot_label ?? dbEv.footLabel ?? 'Подробнее'
  
  return (
    <Link className={`event-card${dbEv.featured ? ' featured' : ''}${isPast ? ' passed' : ''}`} to={`/events/${dbEv.id}`}>
      <div className={`ec-cover${coverClass ? ` ${coverClass}` : ''}${isPast ? ' passed-cover' : ''}`}>
        <div className="date-badge">
          <div className="d">{dbEv.dd}</div>
          <div className="m">{dbEv.mm}</div>
        </div>
        {label && (
          <span className={`status-badge${dbEv.status === 'published' ? ' live' : ''}`}>{label}</span>
        )}
      </div>
      <div className="ec-body">
        <div className="ec-meta">
          <span className={`tag ${tagClass}`}>
            <span className="dot"></span>
            {tagText}
          </span>
          {timeText && <span>{timeText}</span>}
        </div>
        <h3>{dbEv.title}</h3>
        <p className="desc">{description}</p>
        <div className="ec-foot">
          <span>{footerText}</span>
          <span className="open">
            {footerLabel}{' '}
            <Icon id="i-arrow-r" style={{ width: 12, height: 12 }} />
          </span>
        </div>
      </div>
    </Link>
  )
}

function statusLabel(ev: Event & { status_text?: string }) {
  if (ev.status_text ?? ev.statusText) return ev.status_text ?? ev.statusText
  if (ev.status === 'published') return 'live'
  return ev.status ?? ''
}

function sortEvents(list: Event[]) {
  return [...list].sort((a, b) => {
    const itemA = a as Event & { event_date?: string }
    const itemB = b as Event & { event_date?: string }
    const dateA = itemA.event_date ?? a.date ?? ''
    const dateB = itemB.event_date ?? b.date ?? ''
    return dateB.localeCompare(dateA) || b.id - a.id
  })
}

export default function EventsPage() {
  const { isAdmin } = useAdmin()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [seg1, setSeg1] = useState(0)
  const [search, setSearch] = useState('')
  const [showCal, setShowCal] = useState(false)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [limit, setLimit] = useState(4)
  const [addingEvent, setAddingEvent] = useState(false)
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>(BLANK_EVENT)
  const [toast, setToast] = useState('')

  const { data: fetchedEvents, loading, error, retry } = useFetch<Event[]>('/api/events');

  useEffect(() => {
    api.events.list()
      .then(setEvents)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])
    if (fetchedEvents) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEvents(fetchedEvents);
    }
  }, [fetchedEvents]);

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  async function handleAddEvent() {
    const d = new Date(newEvent.date)
    const ev: Omit<Event, 'id'> = {
      ...newEvent,
      // Empty time would be sent as "" and rejected by the backend (TIME column) — omit it.
      time: newEvent.time || undefined,
      dd: newEvent.date ? String(d.getDate()).padStart(2, '0') : '',
      mm: newEvent.date ? MONTH_ABBR[d.getMonth()] : '',
    }
    try {
      const created = await api.events.create(ev)
      // Quick-add publishes immediately so it shows on /events; the admin panel
      // (/admin/events) keeps the full draft → publish → archive workflow.
      const published = await api.events.update(created.id, { status: 'published' })
      setEvents(prev => [...prev, published])
      showToast('Мероприятие добавлено')
    } catch {
      showToast('Не удалось добавить мероприятие')
    }
    setNewEvent(BLANK_EVENT)
    setAddingEvent(false)
  }

  function applyFilter(list: Event[]) {
    return list.filter(ev => {
      const item = ev as Event & { event_date?: string }
      const evDate = item.event_date ?? ev.date ?? ''
      if (search && !ev.title.toLowerCase().includes(search.toLowerCase())) return false
      if (dateFrom && evDate < dateFrom) return false
      if (dateTo && evDate > dateTo) return false
      return true
    })
  }

  const checkPastStatus = (ev: Event) => {
    const item = ev as Event & { event_date?: string }
    return !!(ev.past ?? (item.event_date ? new Date(item.event_date) < new Date() : false))
  }

  const allCurrent = applyFilter(events.filter(ev => !checkPastStatus(ev)))
  const allPast    = applyFilter(events.filter(ev => checkPastStatus(ev)))
  const current    = allCurrent.slice(0, limit)
  const past       = allPast.slice(0, limit)
  const hasMore    = seg1 === 0 ? allCurrent.length > limit : allPast.length > limit
  const hasDateFilter = !!(dateFrom || dateTo)

  return (
    <>
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: 'var(--fg)', color: 'var(--bg)', padding: '10px 20px', borderRadius: 8, fontSize: 13, zIndex: 9999, pointerEvents: 'none' }}>
          {toast}
        </div>
      )}
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

      {error && (
        <div role="alert" style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', padding: '12px 16px', borderRadius: 8, fontSize: 14, marginBottom: 16 }}>
          Не удалось загрузить мероприятия. Проверьте соединение и обновите страницу.
        </div>
      )}

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
            <h3>Текущие <span className="count">{loading ? '--' : String(current.length).padStart(2, '0')}</span></h3>
          </div>
          <div className="events-grid">
            {current.map(ev => <EventCard key={ev.id} ev={ev} />)}
            {current.length === 0 && (
              <p className="text-muted" style={{ gridColumn: '1/-1', padding: '24px 0' }}>
                {error ? 'Ошибка загрузки' : loading ? 'Загрузка…' : 'Мероприятия не найдены'}
              </p>
            )}
          </div>

          {error && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              width: '100%',
              padding: '20px 0'
            }}>
              <div style={{ maxWidth: '650px', width: '100%' }}>
                <ErrorBanner 
                  message="Failed to load events. Please try again." 
                  onRetry={retry}
                  stack={error}
                />
              </div>
            </div>
          )}

          {loading && (
            <div className="events-grid">
              <LoadingSkeleton type="event" count={6} />
            </div>
          )}

          {!loading && !error && events.length === 0 && (
            <EmptyState
              
              title="No events"
              description="There are no events scheduled at the moment. Check back later!"
            />
          )}

          {!loading && !error && events.length > 0 && (
            <div className="events-grid">
              {current.map(ev => <EventCard key={ev.id} ev={ev} />)}
              {current.length === 0 && (
                <p className="text-muted" style={{ gridColumn: '1/-1', padding: '24px 0' }}>
                  Мероприятия не найдены
                </p>
              )}
            </div>
          )}
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
                {error ? 'Ошибка загрузки' : loading ? 'Загрузка…' : 'Мероприятия не найдены'}
              </p>
            )}
          </div>

          {error && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              width: '100%',
              padding: '20px 0'
            }}>
              <div style={{ maxWidth: '650px', width: '100%' }}>
                <ErrorBanner 
                  message="Failed to load events. Please try again." 
                  onRetry={retry}
                  stack={error}
                />
              </div>
            </div>
          )}

          {loading && (
            <div className="events-grid">
              <LoadingSkeleton type="event" count={6} />
            </div>
          )}

          {!loading && !error && events.length === 0 && (
            <EmptyState
              
              title="No events"
              description="There are no events scheduled at the moment. Check back later!"
            />
          )}

          {!loading && !error && events.length > 0 && (
            <div className="events-grid">
              {past.map(ev => <EventCard key={ev.id} ev={ev} />)}
              {past.length === 0 && (
                <p className="text-muted" style={{ gridColumn: '1/-1', padding: '24px 0' }}>
                  Мероприятия не найдены
                </p>
              )}
            </div>
          )}
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
                  <textarea className="textarea" rows={2} value={newEvent.desc} onChange={e => setNewEvent({ ...newEvent, desc: e.target.value })} />
                </div>
                <div className="row gap-3">
                  <div className="field" style={{ flex: 1 }}>
                    <label>Дата</label>
                    <input className="input" type="date" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} />
                  </div>
                  <div className="field" style={{ flex: 1 }}>
                    <label>Время (опц.)</label>
                    <input className="input" type="time" value={newEvent.time ?? ''} onChange={e => setNewEvent(v => ({ ...v, time: e.target.value }))} />
                  </div>
                </div>
                <div className="row gap-3">
                  <div className="field" style={{ flex: 1 }}>
                    <label>Департамент</label>
                    <select className="input" value={newEvent.tag} onChange={e => {
                      const map: Record<string, string> = { 'SU:Core': 'green', 'SU:Active': 'blue', 'SU:Media': 'purple' }
                      setNewEvent({ ...newEvent, tag: e.target.value, tagCls: map[e.target.value] ?? 'green' })
                    }}>
                      <option value="SU:Core">SU:Core</option>
                      <option value="SU:Active">SU:Active</option>
                      <option value="SU:Media">SU:Media</option>
                    </select>
                  </div>
                  <div className="field" style={{ flex: 1 }}>
                    <label>Локация</label>
                    <input className="input" value={newEvent.footLabel ?? ''} onChange={e => setNewEvent({ ...newEvent, footLabel: e.target.value })} />
                  </div>
                </div>
                <div className="field">
                  <label>Текст подвала</label>
                  <input className="input" value={newEvent.foot} onChange={e => setNewEvent({ ...newEvent, foot: e.target.value })} />
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