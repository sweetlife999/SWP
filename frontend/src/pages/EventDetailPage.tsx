import { useState, useEffect, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { api, photoUrl, type Event } from '../lib/api'
import { isEventLive } from '../lib/eventStatus'
import { useAdmin } from '../lib/AdminContext'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { ErrorBanner } from '../components/ErrorBanner'
import { DEPT_LABEL } from '../lib/departments'

export default function EventDetailPage() {
  const { id } = useParams()
  return <EventDetailPageInner key={id} id={id} />
}

function EventDetailPageInner({ id }: { id?: string }) {
  const { isAdmin } = useAdmin()
  const [toast, setToast] = useState('')
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [related, setRelated] = useState<Event[]>([])
  const [editingDesc, setEditingDesc] = useState(false)
  const [descDraft, setDescDraft] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  // Initial state covers the first load; the retry handler resets these
  // flags (not the effect body, per react-hooks/set-state-in-effect), and
  // id changes remount this component entirely via key={id}.
  useEffect(() => {
    if (!id) return
    let cancelled = false
    api.events.get(id)
      .then(ev => { if (!cancelled) { setEvent(ev); setDescDraft(ev.desc) } })
      .catch(() => { if (!cancelled) { setEvent(null); setError(true) } })
      .finally(() => { if (!cancelled) setLoading(false) })
    // "Похожие мероприятия" — real other events instead of hardcoded mocks.
    api.events.list()
      .then(list => { if (!cancelled) setRelated(list.filter(e => String(e.id) !== String(id)).slice(0, 3)) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [id, reloadKey])

  const retry = useCallback(() => { setError(false); setLoading(true); setReloadKey(k => k + 1) }, [])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  async function handleDescSave() {
    if (!id) return
    try {
      const updated = await api.events.update(id, { desc: descDraft })
      setEvent(updated); setDescDraft(updated.desc)
      showToast('Сохранено')
    } catch { showToast('Ошибка сохранения') }
    setEditingDesc(false)
  }

  function handleCalendar() {
    if (!event?.date) { showToast('У мероприятия не указана дата'); return }
    const title = event.title ?? ''
    const dateCompact = event.date.replace(/-/g, '')
    const esc = (s: string) => s.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n')
    let dtLines: string[]
    if (event.time) {
      const start = event.time.replace(':', '') + '00'
      const [h, m] = event.time.split(':').map(Number)
      const endH = String((h + 1) % 24).padStart(2, '0')
      dtLines = [`DTSTART:${dateCompact}T${start}`, `DTEND:${dateCompact}T${endH}${String(m).padStart(2, '0')}00`]
    } else {
      dtLines = [`DTSTART;VALUE=DATE:${dateCompact}`, `DTEND;VALUE=DATE:${dateCompact}`]
    }
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//SU Portal//Events//RU', 'BEGIN:VEVENT',
      `UID:su-event-${event.id}@su-portal`, `DTSTAMP:${dateCompact}T000000Z`, `SUMMARY:${esc(title)}`,
      ...dtLines, `DESCRIPTION:${esc(event.desc ?? '')}`,
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n')
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${title.toLowerCase().replace(/\s+/g, '-') || 'event'}.ics`; a.click()
    URL.revokeObjectURL(url)
    showToast('Файл .ics скачан')
  }

  if (loading) return <LoadingSkeleton type="event" count={1} />
  if (error || !event) {
    return (
      <div style={{ padding: '48px 16px' }}>
        <ErrorBanner message="Не удалось загрузить мероприятие" onRetry={retry} />
      </div>
    )
  }

  return (
    <>
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: 'var(--fg)', color: 'var(--bg)', padding: '10px 20px', borderRadius: 8, fontSize: 13, zIndex: 9999, pointerEvents: 'none' }}>
          {toast}
        </div>
      )}

      <section
        className="event-banner"
        style={event?.photo_url ? { backgroundImage: `url(${photoUrl(event.photo_url, '1200x400')})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
      >
        <div className="banner-inner">
          <div>
            <div className="badges">
              <span className="b">{event?.tag ?? DEPT_LABEL.core}</span>
              <span className={`b${event && isEventLive(event) ? ' live' : ''}`}>
                {event?.statusText ?? (event && isEventLive(event) ? 'live' : event?.status ?? 'draft')}
              </span>
            </div>
            <h1>{event?.title ?? ''}</h1>
            <p className="sub">{event?.desc ?? ''}</p>
          </div>
          <div className="quick-meta">
            <div className="qm"><span className="qm-label">КОГДА</span><span className="qm-value">{event ? `${event.dd} ${event.mm}${event.time ? ` · ${event.time}` : ''}` : ''}</span></div>
          </div>
        </div>
      </section>

      <div className="detail-grid">
        <div>
          <article className="content-block">
            <div className="row sb" style={{ marginBottom: 12 }}>
              <h2 style={{ marginBottom: 0 }}>О мероприятии</h2>
              {isAdmin && !editingDesc && (
                <button className="btn ghost" style={{ fontSize: 12 }} onClick={() => { setDescDraft(event?.desc ?? ''); setEditingDesc(true) }}>
                  <Icon id="i-edit" style={{ width: 12, height: 12 }} /> Редактировать
                </button>
              )}
              {editingDesc && (
                <div className="row gap-2">
                  <button className="btn ghost" onClick={() => { setDescDraft(event?.desc ?? ''); setEditingDesc(false) }}>Отмена</button>
                  <button className="btn primary" style={{ fontSize: 12 }} onClick={handleDescSave}><Icon id="i-check" style={{ width: 12, height: 12 }} /> Сохранить</button>
                </div>
              )}
            </div>
            {editingDesc
              ? <textarea className="textarea" rows={10} value={descDraft} onChange={e => setDescDraft(e.target.value)} style={{ width: '100%', minHeight: 240, resize: 'vertical' }} />
              : <p style={{ whiteSpace: 'pre-wrap' }}>{event?.desc}</p>}
          </article>

          {/* Related — real other events */}
          {related.length > 0 && (
            <article className="content-block">
              <h2>Похожие мероприятия</h2>
              <div className="related-grid">
                {related.map(r => {
                  const rPhoto = photoUrl(r.photo_url, '480x300')
                  return (
                    <Link className="related-card" to={`/events/${r.id}`} key={r.id}>
                      <div
                        className={`img${!rPhoto && r.cover ? ` ${r.cover}` : ''}`}
                        style={rPhoto ? { backgroundImage: `url(${rPhoto})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
                      ></div>
                      <div className="body"><div className="meta">{r.dd} {r.mm} · {r.tag}</div><h4>{r.title}</h4></div>
                    </Link>
                  )
                })}
              </div>
            </article>
          )}
        </div>

        <aside>
          <div className="reg-card">
            <div>
              <div className="row sb mb-2"><span className="eyebrow">УЧАСТИЕ</span><span className="tag green"><span className="dot"></span>Открыта</span></div>
              <div className="price-row"><span className="price">Бесплатно</span><span className="price-label">для всех IU студентов</span></div>
            </div>
            <div className="reg-status"><span className="num">{event?.foot ?? ''}</span></div>
            <button className="btn primary lg" onClick={handleCalendar}>Сохранить в календарь</button>
            <div className="key-meta">
              <div className="row sb"><span className="lbl">Департамент</span><span className="val">{event?.tag ?? ''}</span></div>
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}