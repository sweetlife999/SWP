import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { api, type Event } from '../lib/api'

function EventCard({ ev }: { ev: Event }) {
  return (
    <Link className={`event-card${ev.featured ? ' featured' : ''}${ev.past ? ' passed' : ''}`} to={`/events/${ev.id}`}>
      <div className={`ec-cover${ev.cover ? ` ${ev.cover}` : ''}${ev.past ? ' passed-cover' : ''}`}>
        <div className="date-badge"><div className="d">{ev.dd}</div><div className="m">{ev.mm}</div></div>
        {ev.statusText && (
          <span className={`status-badge${ev.status === 'live' ? ' live' : ''}`}>{ev.statusText}</span>
        )}
      </div>
      <div className="ec-body">
        <div className="ec-meta">
          <span className={`tag ${ev.tagCls}`}><span className="dot"></span>{ev.tag}</span>
          {ev.time && <span>{ev.time}</span>}
        </div>
        <h3>{ev.title}</h3>
        <p className="desc">{ev.desc}</p>
        <div className="ec-foot">
          <span>{ev.foot}</span>
          <span className="open">{ev.footLabel ?? 'Подробнее'} <Icon id="i-arrow-r" style={{ width: 12, height: 12 }} /></span>
        </div>
      </div>
    </Link>
  )
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [seg1, setSeg1] = useState(0)
  const [search, setSearch] = useState('')
  const [showCal, setShowCal] = useState(false)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [limit, setLimit] = useState(4)

  useEffect(() => {
    api.events.list().then(setEvents).catch(() => {})
  }, [])

  function applyFilter(list: Event[]) {
    return list.filter(ev => {
      if (search && !ev.title.toLowerCase().includes(search.toLowerCase())) return false
      if (dateFrom && ev.date < dateFrom) return false
      if (dateTo && ev.date > dateTo) return false
      return true
    })
  }

  const allCurrent = applyFilter(events.filter(ev => !ev.past))
  const allPast    = applyFilter(events.filter(ev => !!ev.past))
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
            onClick={() => setShowCal(v => !v)}
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
    </>
  )
}
