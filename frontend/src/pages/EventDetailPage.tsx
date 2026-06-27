import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { api, type Event, type ScheduleItem, type OrganizerItem } from '../lib/api'
import { useAdmin } from '../lib/AdminContext'

const FORMAT_OPTIONS = ['Оффлайн', 'Онлайн', 'Гибрид']
const AGE_OPTIONS = ['0+', '6+', '12+', '16+', '18+']
const ORG_BG = [
  'linear-gradient(135deg,#a3e0ad,#32b247)', 'linear-gradient(135deg,#b3d5a8,#5fa44f)',
  'linear-gradient(135deg,#a8c0e0,#3868b8)', 'linear-gradient(135deg,#e0a8c8,#c93f8b)',
]

export default function EventDetailPage() {
  const { id } = useParams()
  return <EventDetailPageInner key={id} id={id} />
}

type Details = { format: string; age: string; locationAddress: string; schedule: ScheduleItem[]; organizers: OrganizerItem[] }

function EventDetailPageInner({ id }: { id?: string }) {
  const { isAdmin } = useAdmin()
  const [toast, setToast] = useState('')
  const [event, setEvent] = useState<Event | null>(null)
  const [related, setRelated] = useState<Event[]>([])
  const [editingDesc, setEditingDesc] = useState(false)
  const [descDraft, setDescDraft] = useState('')
  // Single edit mode for the structured detail blocks (admin only).
  const [editingDetails, setEditingDetails] = useState(false)
  const [draft, setDraft] = useState<Details>({ format: 'Оффлайн', age: '0+', locationAddress: '', schedule: [], organizers: [] })

  useEffect(() => {
    if (!id) return
    api.events.get(id)
      .then(ev => { setEvent(ev); setDescDraft(ev.desc) })
      .catch(() => setEvent(null))
    // "Похожие мероприятия" — real other events instead of hardcoded mocks.
    api.events.list()
      .then(list => setRelated(list.filter(e => String(e.id) !== String(id)).slice(0, 3)))
      .catch(() => {})
  }, [id])

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

  function startEditDetails() {
    if (!event) return
    setDraft({
      format: event.format ?? 'Оффлайн',
      age: event.age ?? '0+',
      locationAddress: event.locationAddress ?? '',
      schedule: event.schedule ? event.schedule.map(s => ({ ...s })) : [],
      organizers: event.organizers ? event.organizers.map(o => ({ ...o })) : [],
    })
    setEditingDetails(true)
  }

  async function saveDetails() {
    if (!id) return
    try {
      const updated = await api.events.update(id, {
        format: draft.format, age: draft.age, locationAddress: draft.locationAddress,
        schedule: draft.schedule.filter(s => s.time || s.title || s.where),
        organizers: draft.organizers.filter(o => o.name || o.initials || o.role),
      })
      setEvent(updated)
      showToast('Детали сохранены')
    } catch { showToast('Ошибка сохранения') }
    setEditingDetails(false)
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
      ...dtLines, `LOCATION:${esc(event.footLabel ?? '')}`, `DESCRIPTION:${esc(event.desc ?? '')}`,
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n')
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${title.toLowerCase().replace(/\s+/g, '-') || 'event'}.ics`; a.click()
    URL.revokeObjectURL(url)
    showToast('Файл .ics скачан')
  }

  const schedule = event?.schedule ?? []
  const organizers = event?.organizers ?? []

  return (
    <>
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: 'var(--fg)', color: 'var(--bg)', padding: '10px 20px', borderRadius: 8, fontSize: 13, zIndex: 9999, pointerEvents: 'none' }}>
          {toast}
        </div>
      )}

      <section className="event-banner">
        <div className="banner-inner">
          <div>
            <div className="badges">
              <span className="b">{event?.tag ?? 'SU:Core'}</span>
              <span className={`b${event?.status === 'published' ? ' live' : ''}`}>
                {event?.statusText ?? (event?.status === 'published' ? 'live' : event?.status ?? 'draft')}
              </span>
            </div>
            <h1>{event?.title ?? ''}</h1>
            <p className="sub">{event?.desc ?? ''}</p>
          </div>
          <div className="quick-meta">
            <div className="qm"><span className="qm-label">КОГДА</span><span className="qm-value">{event ? `${event.dd} ${event.mm}${event.time ? ` · ${event.time}` : ''}` : ''}</span></div>
            <div className="qm"><span className="qm-label">ГДЕ</span><span className="qm-value">{event?.footLabel ?? '—'}</span></div>
          </div>
        </div>
      </section>

      {/* Admin toolbar to edit the structured detail blocks */}
      {isAdmin && (
        <div className="row gap-2" style={{ justifyContent: 'flex-end', margin: '16px 0' }}>
          {editingDetails ? (
            <>
              <button className="btn ghost" onClick={() => setEditingDetails(false)}>Отмена</button>
              <button className="btn primary" onClick={saveDetails}><Icon id="i-check" style={{ width: 14, height: 14 }} />Сохранить детали</button>
            </>
          ) : (
            <button className="btn secondary" onClick={startEditDetails}><Icon id="i-edit" style={{ width: 14, height: 14 }} />Редактировать детали</button>
          )}
        </div>
      )}

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

          {/* Schedule */}
          <article className="content-block">
            <div className="row sb mb-4">
              <h2 style={{ marginBottom: 0 }}>Расписание</h2>
              {editingDetails && (
                <button className="btn ghost sm" onClick={() => setDraft(d => ({ ...d, schedule: [...d.schedule, { time: '', title: '', where: '' }] }))}>
                  <Icon id="i-plus" style={{ width: 12, height: 12 }} />Пункт
                </button>
              )}
            </div>
            {editingDetails ? (
              <div className="col gap-2">
                {draft.schedule.map((s, i) => (
                  <div key={i} className="row gap-2" style={{ alignItems: 'center' }}>
                    <input className="input" style={{ width: 130 }} placeholder="20.06 · 10:00" value={s.time} onChange={e => setDraft(d => { const sc = [...d.schedule]; sc[i] = { ...sc[i], time: e.target.value }; return { ...d, schedule: sc } })} />
                    <input className="input" style={{ flex: 1 }} placeholder="Название пункта" value={s.title} onChange={e => setDraft(d => { const sc = [...d.schedule]; sc[i] = { ...sc[i], title: e.target.value }; return { ...d, schedule: sc } })} />
                    <input className="input" style={{ width: 160 }} placeholder="Место" value={s.where} onChange={e => setDraft(d => { const sc = [...d.schedule]; sc[i] = { ...sc[i], where: e.target.value }; return { ...d, schedule: sc } })} />
                    <button className="icon-btn" onClick={() => setDraft(d => ({ ...d, schedule: d.schedule.filter((_, j) => j !== i) }))}><Icon id="i-x" /></button>
                  </div>
                ))}
                {draft.schedule.length === 0 && <p className="text-muted" style={{ fontSize: 13 }}>Пунктов нет — добавьте.</p>}
              </div>
            ) : schedule.length > 0 ? (
              schedule.map((row, i) => (
                <div className="schedule-row" key={i}>
                  <div className="time">{row.time}</div>
                  <div><div className="title">{row.title}</div><div className="where">{row.where}</div></div>
                </div>
              ))
            ) : <p className="text-muted" style={{ fontSize: 13 }}>Расписание пока не опубликовано.</p>}
          </article>

          {/* Organizers */}
          <article className="content-block">
            <div className="row sb mb-4">
              <h2 style={{ marginBottom: 0 }}>Кто за это отвечает</h2>
              {editingDetails && (
                <button className="btn ghost sm" onClick={() => setDraft(d => ({ ...d, organizers: [...d.organizers, { initials: '', name: '', role: '' }] }))}>
                  <Icon id="i-plus" style={{ width: 12, height: 12 }} />Человек
                </button>
              )}
            </div>
            {editingDetails ? (
              <div className="col gap-2">
                {draft.organizers.map((o, i) => (
                  <div key={i} className="row gap-2" style={{ alignItems: 'center' }}>
                    <input className="input" style={{ width: 64 }} maxLength={3} placeholder="МР" value={o.initials} onChange={e => setDraft(d => { const or = [...d.organizers]; or[i] = { ...or[i], initials: e.target.value }; return { ...d, organizers: or } })} />
                    <input className="input" style={{ flex: 1 }} placeholder="Имя" value={o.name} onChange={e => setDraft(d => { const or = [...d.organizers]; or[i] = { ...or[i], name: e.target.value }; return { ...d, organizers: or } })} />
                    <input className="input" style={{ flex: 1 }} placeholder="Роль" value={o.role} onChange={e => setDraft(d => { const or = [...d.organizers]; or[i] = { ...or[i], role: e.target.value }; return { ...d, organizers: or } })} />
                    <button className="icon-btn" onClick={() => setDraft(d => ({ ...d, organizers: d.organizers.filter((_, j) => j !== i) }))}><Icon id="i-x" /></button>
                  </div>
                ))}
                {draft.organizers.length === 0 && <p className="text-muted" style={{ fontSize: 13 }}>Никого нет — добавьте.</p>}
              </div>
            ) : organizers.length > 0 ? (
              <div className="org-list" style={{ marginTop: 8 }}>
                {organizers.map((o, i) => (
                  <div className="org" key={i}>
                    <div className="avatar" style={{ background: ORG_BG[i % ORG_BG.length] }}>{o.initials || o.name.slice(0, 2).toUpperCase()}</div>
                    <div className="info"><div className="name">{o.name}</div><div className="role">{o.role}</div></div>
                  </div>
                ))}
              </div>
            ) : <p className="text-muted" style={{ fontSize: 13 }}>Организаторы пока не указаны.</p>}
          </article>

          {/* Location */}
          <article className="content-block">
            <h2>Локация</h2>
            <div className="row gap-3 mb-4">
              <Icon id="i-pin" style={{ width: 18, height: 18, color: 'var(--accent)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500 }}>{event?.footLabel ?? '—'}</div>
                {editingDetails
                  ? <input className="input" style={{ marginTop: 6 }} placeholder="Адрес (улица, ориентир)" value={draft.locationAddress} onChange={e => setDraft(d => ({ ...d, locationAddress: e.target.value }))} />
                  : <div className="text-muted" style={{ fontSize: 13 }}>{event?.locationAddress || 'Адрес не указан'}</div>}
              </div>
            </div>
            <div className="map-card"></div>
            <div className="row gap-2 mt-4">
              <a className="btn secondary" href={`https://yandex.ru/maps/?text=${encodeURIComponent(`${event?.footLabel ?? ''} ${event?.locationAddress ?? ''}`)}`} target="_blank" rel="noopener noreferrer">
                <Icon id="i-map" style={{ width: 14, height: 14 }} />Открыть в Яндекс.Картах
              </a>
            </div>
          </article>

          {/* Related — real other events */}
          {related.length > 0 && (
            <article className="content-block">
              <h2>Похожие мероприятия</h2>
              <div className="related-grid">
                {related.map(r => (
                  <Link className="related-card" to={`/events/${r.id}`} key={r.id}>
                    <div className="img"></div>
                    <div className="body"><div className="meta">{r.dd} {r.mm} · {r.tag}</div><h4>{r.title}</h4></div>
                  </Link>
                ))}
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
              <div className="row sb">
                <span className="lbl">Формат</span>
                {editingDetails
                  ? <select className="input" style={{ width: 'auto', height: 30 }} value={draft.format} onChange={e => setDraft(d => ({ ...d, format: e.target.value }))}>{FORMAT_OPTIONS.map(o => <option key={o}>{o}</option>)}</select>
                  : <span className="val">{event?.format ?? 'Оффлайн'}</span>}
              </div>
              <div className="row sb">
                <span className="lbl">Возраст</span>
                {editingDetails
                  ? <select className="input" style={{ width: 'auto', height: 30 }} value={draft.age} onChange={e => setDraft(d => ({ ...d, age: e.target.value }))}>{AGE_OPTIONS.map(o => <option key={o}>{o}</option>)}</select>
                  : <span className="val">{event?.age ?? '0+'}</span>}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}
