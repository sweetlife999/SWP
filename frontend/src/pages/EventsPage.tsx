import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { type Event } from '../lib/api'
import { useFetch } from '../hooks/useFetch'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { ErrorBanner } from '../components/ErrorBanner'
import { EmptyState } from '../components/EmptyState'


function statusLabel(ev: Event): string {
  if (ev.statusText) return ev.statusText
  if (ev.status === 'published') return 'live'
  return ''
}

function EventCard({ ev }: { ev: Event }) {
  const label = statusLabel(ev)
  const footerLabel = ev.footLabel || 'Подробнее'
  return (
    <Link data-testid="event-card" className={`event-card${ev.featured ? ' featured' : ''}${ev.past ? ' passed' : ''}`} to={`/events/${ev.id}`}>
      <div className={`ec-cover${ev.cover ? ` ${ev.cover}` : ''}${ev.past ? ' passed-cover' : ''}`}>
        <div className="date-badge"><div className="d">{ev.dd}</div><div className="m">{ev.mm}</div></div>
        {label && <span className={`status-badge${ev.status === 'published' ? ' live' : ''}`}>{label}</span>}
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
          <span className="open">{footerLabel} <Icon id="i-arrow-r" style={{ width: 12, height: 12 }} /></span>
        </div>
      </div>
    </Link>
  )
}

export default function EventsPage() {
  // Public endpoint — useFetch owns loading/error/retry; the list is the single source of truth.
  const { data: fetchedEvents, loading, error, retry } = useFetch<Event[]>('/api/events')
  const events = fetchedEvents ?? []

  const [seg1, setSeg1] = useState(0)
  const [search, setSearch] = useState('')
  const [showCal, setShowCal] = useState(false)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [limit, setLimit] = useState(4)

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

  const shown = seg1 === 0 ? current : past
  const total = seg1 === 0 ? allCurrent.length : allPast.length

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
            <input placeholder="Поиск мероприятий…" value={search} onChange={e => setSearch(e.target.value)} />
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

      <div className="section-head-row">
        <h3>{seg1 === 0 ? 'Текущие' : 'Прошедшие'} <span className="count">{loading ? '--' : String(total).padStart(2, '0')}</span></h3>
      </div>

      {error ? (
        <ErrorBanner message="Не удалось загрузить мероприятия." onRetry={retry} stack={error} />
      ) : loading ? (
        <div className="events-grid"><LoadingSkeleton type="event" count={6} /></div>
      ) : events.length === 0 ? (
        <EmptyState title="Мероприятий пока нет" description="Скоро здесь появятся ближайшие события студсовета." />
      ) : (
        <div className="events-grid">
          {shown.map(ev => <EventCard key={ev.id} ev={ev} />)}
          {shown.length === 0 && (
            <p className="text-muted" style={{ gridColumn: '1/-1', padding: '24px 0' }}>Мероприятия не найдены</p>
          )}
        </div>
      )}

      {hasMore && !loading && !error && (
        <div className="row" style={{ justifyContent: 'center', marginTop: 32 }}>
          <button className="btn secondary" onClick={() => setLimit(l => l + 4)}>Загрузить ещё <Icon id="i-chevron-d" style={{ width: 14, height: 14 }} /></button>
        </div>
      )}

    </>
  )
}
