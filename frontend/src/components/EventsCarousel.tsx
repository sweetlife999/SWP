import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from './Icon'
import type { Event } from '../lib/api'
import { eventStatusLabel, isEventLive } from '../lib/events'
import { useNow } from '../hooks/useNow'

interface EventsCarouselProps {
  events: Event[]
}

const AUTO_ADVANCE_MS = 3000

export function EventsCarousel({ events }: EventsCarouselProps) {
  const [index, setIndex] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function restartTimer() {
    if (timerRef.current) clearInterval(timerRef.current)
    if (events.length <= 1) return
    timerRef.current = setInterval(() => {
      setIndex(i => (i + 1) % events.length)
    }, AUTO_ADVANCE_MS)
  }

  useEffect(() => {
    restartTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events.length])

  // Guards against a stale index if the events list shrinks after mount,
  // without needing an effect just to clamp state.
  const safeIndex = index < events.length ? index : 0

  function goTo(i: number) {
    setIndex(i)
    restartTimer()
  }
  function prev() { goTo((safeIndex - 1 + events.length) % events.length) }
  function next() { goTo((safeIndex + 1) % events.length) }

  const ev = events[safeIndex]
  const now = useNow()
  if (!ev) return null

  const label = eventStatusLabel(ev, now)
  const live = isEventLive(ev, now)

  return (
    <div className="events-carousel">
      <div className="events-carousel-box">
        {events.length > 1 && (
          <button className="carousel-nav prev" onClick={prev} aria-label="Предыдущее событие">
            <Icon id="i-chevron-l" style={{ width: 16, height: 16 }} />
          </button>
        )}

        <Link data-testid="home-event-card" className="event-card" to={`/events/${ev.id}`}>
          <div className={`ec-cover${ev.cover ? ` ${ev.cover}` : ''}`}>
            <div className="date-badge"><div className="d">{ev.dd}</div><div className="m">{ev.mm}</div></div>
            {label && <span className={`status-badge${live ? ' live' : ''}`}>{label}</span>}
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
              <span className="open">{ev.footLabel || 'Подробнее'} <Icon id="i-arrow-r" style={{ width: 12, height: 12 }} /></span>
            </div>
          </div>
        </Link>

        {events.length > 1 && (
          <button className="carousel-nav next" onClick={next} aria-label="Следующее событие">
            <Icon id="i-chevron-r" style={{ width: 16, height: 16 }} />
          </button>
        )}
      </div>

      {events.length > 1 && (
        <div className="carousel-dots">
          {events.map((_, i) => (
            <button
              key={i}
              className={`carousel-dot${i === safeIndex ? ' active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Событие ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
