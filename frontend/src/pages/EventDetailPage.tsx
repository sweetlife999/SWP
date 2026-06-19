import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { api, type Event } from '../lib/api'
import { useAdmin } from '../lib/AdminContext'

export default function EventDetailPage() {
  const { id } = useParams()

  return <EventDetailPageInner key={id} id={id} />
}

function EventDetailPageInner({ id }: { id?: string }) {
  const { isAdmin } = useAdmin()
  const [toast, setToast] = useState('')
  const [event, setEvent] = useState<Event | null>(null)
  const [editingDesc, setEditingDesc] = useState(false)
  const [descDraft, setDescDraft] = useState('')

  useEffect(() => {
    if (!id) return
    api.events.get(id)
      .then(ev => {
        setEvent(ev)
        setDescDraft(ev.desc)
      })
      .catch(() => {
        const mockEvent: Event = {
          id: Number(id),
          title: 'Hackathon Summer 24h',
          desc: '24 часа открытого хакатона: любая идея, любой стек, любые команды. Финал — презентации в воскресенье вечером.',
          date: '2026-06-20',
          dd: '20',
          mm: 'JUN',
          cover: '',
          tag: 'SU:Core',
          tagCls: 'green',
          time: '10:00',
          foot: '32 участника',
          past: false,
          status: 'published',
          statusText: 'live',
        }
        setEvent(mockEvent)
        setDescDraft(mockEvent.desc)
      })
  }, [id])

  async function handleDescSave() {
    if (!id) return
    try {
      const updated = await api.admin.events.update(id, { desc: descDraft })
      setEvent(updated)
      setDescDraft(updated.desc)
      showToast('Сохранено')
    } catch {
      showToast('Ошибка сохранения')
    }
    setEditingDesc(false)
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  function handleCalendar() {
    const title = event?.title ?? 'Hackathon Summer 24h'
    const datePart = (event?.date ?? '2026-06-20').replace(/-/g, '')
    const startTime = (event?.time ?? '10:00').replace(':', '')
    const ics = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nSUMMARY:${title}\r\nDTSTART:${datePart}T${startTime}\r\nDTEND:20260621T180000\r\nLOCATION:Sport Tower 519, Иннополис\r\nDESCRIPTION:${event?.desc ?? '24 часа открытого хакатона. SU:Core.'}\r\nEND:VEVENT\r\nEND:VCALENDAR`
    const blob = new Blob([ics], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'hackathon-summer-24h.ics'; a.click()
    URL.revokeObjectURL(url)
    showToast('Файл .ics скачан')
  }

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
              <span className="b">{event?.tag ?? 'SU:Core'} · TOP</span>
              <span className={`b${event?.status === 'published' ? ' live' : ''}`}>{event?.statusText ?? (event?.status === 'published' ? 'live' : event?.status ?? 'draft')}</span>
            </div>
            <h1>{event?.title ?? 'Hackathon Summer 24h'}</h1>
            <p className="sub">{event?.desc ?? '24 часа открытого хакатона: любая идея, любой стек, любые команды. Финал — презентации в воскресенье вечером.'}</p>
          </div>
          <div className="quick-meta">
            <div className="qm"><span className="qm-label">КОГДА</span><span className="qm-value">{event ? `${event.dd} ${event.mm}` : '20–21 ИЮН'}</span></div>
            <div className="qm"><span className="qm-label">ГДЕ</span><span className="qm-value">{event?.footLabel ?? '519 Sport Tower'}</span></div>
          </div>
        </div>
      </section>

      <div className="detail-grid">
        <div>
          <article className="content-block">
            <div className="row sb" style={{ marginBottom: 12 }}>
              <h2 style={{ marginBottom: 0 }}>О мероприятии</h2>
              {isAdmin && !editingDesc && (
                <button className="btn ghost" style={{ fontSize: 12 }} onClick={() => {
                  setDescDraft(event?.desc ?? '')
                  setEditingDesc(true)
                }}>
                  <Icon id="i-edit" style={{ width: 12, height: 12 }} /> Редактировать
                </button>
              )}
              {editingDesc && (
                <div className="row gap-2">
                  <button className="btn ghost" onClick={() => {
                    setDescDraft(event?.desc ?? '')
                    setEditingDesc(false)
                  }}>Отмена</button>
                  <button className="btn primary" style={{ fontSize: 12 }} onClick={handleDescSave}>
                    <Icon id="i-check" style={{ width: 12, height: 12 }} /> Сохранить
                  </button>
                </div>
              )}
            </div>
            {editingDesc ? (
              <textarea
                className="textarea"
                rows={10}
                value={descDraft}
                onChange={e => setDescDraft(e.target.value)}
                style={{ width: '100%', minHeight: 240, resize: 'vertical' }}
              />
            ) : (
              <article>
                {event?.desc ? <p style={{ whiteSpace: 'pre-wrap' }}>{event.desc}</p> : <p style={{ whiteSpace: 'pre-wrap' }}>{descDraft}</p>}
              </article>
            )}
          </article>

          <article className="content-block">
            <div className="row sb mb-4">
              <h2 style={{ marginBottom: 0 }}>Расписание</h2>
              <span className="text-mono text-muted" style={{ fontSize: 11, letterSpacing: '0.04em' }}>11 ПУНКТОВ · 24 Ч</span>
            </div>
            {[
              { time: '20.06 · 10:00', end: '11:00', title: 'Открытие, регистрация, приветственный кофе', where: 'фойе 519 Sport Tower', tag: <span className="tag green tag-cell"><span className="dot"></span>Required</span> },
              { time: '20.06 · 11:00', end: '12:00', title: 'Презентация треков, team matching и Q&A', where: 'amphitheatre 519', tag: <span className="tag outline tag-cell">Optional</span> },
              { time: '20.06 · 12:00', title: 'Старт хакатона — кодинг начинается', where: 'по командам, столы в open-space' },
              { time: '20.06 · 19:00', title: 'Пицца + chill-checkpoint #1', where: 'общий зал' },
              { time: '20.06 · 22:00', title: 'Менторская консультация (slot booking)', where: 'переговорные 408 / 410', tag: <span className="tag yellow tag-cell">Слоты ограничены</span> },
              { time: '21.06 · 08:00', end: '10:00', title: 'Завтрак и chill-checkpoint #2', where: 'общий зал' },
              { time: '21.06 · 09:00', title: 'Опциональный workshop: «как готовить демо за 3 минуты»', where: 'aula 519', tag: <span className="tag outline tag-cell">Optional</span> },
              { time: '21.06 · 12:00', title: 'Стоп-кодинг и финальная сдача проектов', where: 'через форму', tag: <span className="tag red tag-cell"><span className="dot"></span>Deadline</span> },
              { time: '21.06 · 14:00', end: '16:30', title: 'Презентации команд (5 мин + 3 мин Q&A)', where: 'amphitheatre 519' },
              { time: '21.06 · 17:00', title: 'Голосование жюри + выбор зрительских призов', where: 'онлайн через портал' },
              { time: '21.06 · 18:00', title: 'Награждение, групповое фото, BBQ на берегу', where: 'pier', tag: <span className="tag green tag-cell"><span className="dot"></span>Featured</span> },
            ].map((row, i) => (
              <div className="schedule-row" key={i}>
                <div className="time">{row.time}{row.end && <span className="end">{row.end}</span>}</div>
                <div>
                  <div className="title">{row.title}</div>
                  <div className="where">{row.where}</div>
                </div>
                {row.tag && row.tag}
              </div>
            ))}
          </article>

          <article className="content-block">
            <h2>Кто за это отвечает</h2>
            <div className="org-list" style={{ marginTop: 8 }}>
              {[
                { init: 'МР', bg: 'linear-gradient(135deg,#a3e0ad,#32b247)', name: 'Михаил Раянов', role: 'SU:Core · Co-lead · Lead organizer' },
                { init: 'ДА', bg: 'linear-gradient(135deg,#b3d5a8,#5fa44f)', name: 'Дарья Андреева', role: 'SU:Core · Co-lead · Logistics' },
                { init: 'АГ', bg: 'linear-gradient(135deg,#a8c0e0,#3868b8)', name: 'Алия Газизова', role: 'SU:Active · BBQ + закрытие' },
                { init: 'АЛ', bg: 'linear-gradient(135deg,#e0a8c8,#c93f8b)', name: 'Анна Лебедева', role: 'SU:Media · фото и репортаж' },
              ].map((o, i) => (
                <div className="org" key={i}>
                  <div className="avatar" style={{ background: o.bg }}>{o.init}</div>
                  <div className="info"><div className="name">{o.name}</div><div className="role">{o.role}</div></div>
                </div>
              ))}
            </div>
          </article>

          <article className="content-block">
            <h2>Локация</h2>
            <div className="row gap-3 mb-4">
              <Icon id="i-pin" style={{ width: 18, height: 18, color: 'var(--accent)' }} />
              <div>
                <div style={{ fontWeight: 500 }}>Sport Tower · 519 · open-space</div>
                <div className="text-muted" style={{ fontSize: 13 }}>Университетская 1, Иннополис · 5 минут пешком от общежитий</div>
              </div>
            </div>
            <div className="map-card"></div>
            <div className="row gap-2 mt-4">
              <a className="btn secondary" href="https://yandex.ru/maps/?text=Иннополис+Университет+519+Sport+Tower" target="_blank" rel="noopener noreferrer"><Icon id="i-map" style={{ width: 14, height: 14 }} />Открыть в Яндекс.Картах</a>
              <button className="btn ghost" onClick={() => navigator.clipboard.writeText('Университетская 1, Иннополис, Sport Tower 519')}><Icon id="i-copy" style={{ width: 14, height: 14 }} />Скопировать адрес</button>
            </div>
          </article>

          <article className="content-block">
            <h2>Похожие мероприятия</h2>
            <div className="related-grid">
              <Link className="related-card" to="/events/1">
                <div className="img"></div>
                <div className="body"><div className="meta">12 ИЮЛ · SU:CORE</div><h4>Open meeting Q3: бюджет и ивенты</h4></div>
              </Link>
              <Link className="related-card" to="/events/1">
                <div className="img a"></div>
                <div className="body"><div className="meta">14 ИЮН · SU:ACTIVE</div><h4>Open Mic: stand-up evening</h4></div>
              </Link>
              <Link className="related-card" to="/events/1">
                <div className="img b"></div>
                <div className="body"><div className="meta">5 ИЮЛ · SU:ACTIVE</div><h4>Гребля и BBQ · закрытие Summer Days</h4></div>
              </Link>
            </div>
          </article>
        </div>

        <aside>
          <div className="reg-card">
            <div>
              <div className="row sb mb-2">
                <span className="eyebrow">УЧАСТИЕ</span>
                <span className="tag green"><span className="dot"></span>Открыта</span>
              </div>
              <div className="price-row">
                <span className="price">Бесплатно</span>
                <span className="price-label">для всех IU студентов</span>
              </div>
            </div>
            <div className="reg-status">
              <span className="num">32 / 44</span>
              <div className="progress" style={{ flex: 1 }}><div className="bar" style={{ width: '72%' }}></div></div>
            </div>
            <span className="text-muted" style={{ fontSize: 12, marginTop: -8 }}>осталось 12 свободных мест</span>
            <button className="btn primary lg" onClick={handleCalendar}>Сохранить в календарь</button>
            <div className="key-meta">
              <div className="row sb"><span className="lbl">Категория</span><span className="val">Hackathon</span></div>
              <div className="row sb"><span className="lbl">Департамент</span><span className="val">SU:Core</span></div>
              <div className="row sb"><span className="lbl">Длительность</span><span className="val">24 ч</span></div>
              <div className="row sb"><span className="lbl">Формат</span><span className="val">Оффлайн</span></div>
              <div className="row sb"><span className="lbl">Возраст</span><span className="val">18+</span></div>
              <div className="row sb"><span className="lbl">Команды</span><span className="val">до 5 чел</span></div>
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}
