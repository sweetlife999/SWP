import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'

type Ev = {
  id: number; date: string; dd: string; mm: string; cover: string
  featured?: boolean; status?: 'live' | 'passed'; statusText?: string
  tag: string; tagCls: string; time?: string; title: string; desc: string
  foot: string; footLabel?: string; avatars?: boolean; past?: boolean
}

const EVENTS: Ev[] = [
  { id: 1, date: '2026-06-20', dd: '20', mm: 'ИЮН', cover: '', featured: true, status: 'live', statusText: 'live · регистрация открыта', tag: 'SU:Core', tagCls: 'green', time: '10:00–10:00 (24 ч)', title: 'Hackathon Summer 24h — open hack под открытым небом', desc: '24 часа, любая тема, любое количество людей в команде. Финал и презентация — в воскресенье вечером.', foot: '32 заявки · 12 мест свободно', avatars: true },
  { id: 2, date: '2026-06-14', dd: '14', mm: 'ИЮН', cover: 'a', tag: 'SU:Active', tagCls: 'blue', time: '19:00', title: 'Open Mic: stand-up evening', desc: 'Студенческий вечер открытого микрофона, 12 выступлений по 5 минут.', foot: '48 / 80 регистраций' },
  { id: 3, date: '2026-06-25', dd: '25', mm: 'ИЮН', cover: 'c', tag: 'SU:Media', tagCls: 'purple', time: '17:30 · Волга', title: 'Photo walk · Volga shore', desc: 'Фотопрогулка на закате с разбором кадров от Анны Лебедевой. Уровень — любой.', foot: '14 / 20 мест' },
  { id: 4, date: '2026-07-02', dd: '02', mm: 'ИЮЛ', cover: 'b', tag: 'SU:Active', tagCls: 'blue', time: '21:30 · campus square', title: 'Movie under the sky · La La Land', desc: 'Большой проектор, экран на 12 метров, пледы и попкорн. Бесплатно.', foot: '67 регистраций' },
  { id: 5, date: '2026-07-05', dd: '05', mm: 'ИЮЛ', cover: 'd', tag: 'SU:Active', tagCls: 'blue', time: '12:00 · pier', title: 'Гребля и BBQ · закрытие Summer Days', desc: 'Гребные лодки на Волге, BBQ на берегу, награждение участников Summer Days.', foot: '28 / 60 регистраций' },
  { id: 6, date: '2026-07-12', dd: '12', mm: 'ИЮЛ', cover: 'f', tag: 'SU:Core', tagCls: 'green', time: '15:00 · аудитория 408', title: 'Open meeting Q3: бюджет, ивенты, вопросы', desc: 'Открытая встреча студсовета: распределение бюджета на третий квартал, ответы на вопросы.', foot: '21 регистрация' },
  { id: 7, date: '2026-05-28', dd: '28', mm: 'МАЙ', cover: 'e', status: 'passed', statusText: 'завершён', tag: 'SU:Core', tagCls: 'green', title: 'Innopolis Open 2026 — итоги', desc: 'Главное событие весны: 14 проектов, восемь команд, два дня. Призовой фонд от партнёров — ₽ 450,000.', foot: '14 проектов · 3 победителя', footLabel: 'Репортаж', past: true },
  { id: 8, date: '2026-05-12', dd: '12', mm: 'МАЙ', cover: 'a', status: 'passed', statusText: 'завершён', tag: 'SU:Active', tagCls: 'blue', title: 'Весенний турнир по настольному теннису', desc: '28 участников, 6 призёров. Победитель — Дмитрий Карпов (B23-CS).', foot: '28 участников', footLabel: 'Фотографии', past: true },
  { id: 9, date: '2026-04-20', dd: '20', mm: 'АПР', cover: 'c', status: 'passed', statusText: 'завершён', tag: 'SU:Media', tagCls: 'purple', title: 'Как снимать кампусный лонгрид: лекция от Sasha Reka', desc: 'Открытая лекция приглашённого фотожурналиста. Видеозапись доступна в архиве SU:Media.', foot: '56 участников', footLabel: 'Видео', past: true },
]

function EventCard({ ev }: { ev: Ev }) {
  return (
    <Link className={`event-card${ev.featured ? ' featured' : ''}${ev.past ? ' passed' : ''}`} to="/events/1">
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
          {ev.avatars ? (
            <div className="row gap-2">
              <div className="avatars">
                <div className="avatar sm" style={{ background: '#a3e0ad' }}>МР</div>
                <div className="avatar sm" style={{ background: '#a8c0e0' }}>АГ</div>
                <div className="avatar sm" style={{ background: '#e0a8c8' }}>АЛ</div>
              </div>
              <span>{ev.foot}</span>
            </div>
          ) : (
            <span>{ev.foot}</span>
          )}
          <span className="open">{ev.footLabel ?? 'Подробнее'} <Icon id="i-arrow-r" style={{ width: 12, height: 12 }} /></span>
        </div>
      </div>
    </Link>
  )
}

export default function EventsPage() {
  const [seg1, setSeg1] = useState(0)
  const [search, setSearch] = useState('')
  const [showCal, setShowCal] = useState(false)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  function applyFilter(list: Ev[]) {
    return list.filter(ev => {
      if (search && !ev.title.toLowerCase().includes(search.toLowerCase())) return false
      if (dateFrom && ev.date < dateFrom) return false
      if (dateTo && ev.date > dateTo) return false
      return true
    })
  }

  const current = applyFilter(EVENTS.filter(ev => !ev.past))
  const past = applyFilter(EVENTS.filter(ev => !!ev.past))
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
          {['Текущие · 7', 'Прошедшие · 24', 'Мои регистрации · 3'].map((label, i) => (
            <button key={i} className={seg1 === i ? 'active' : ''} onClick={() => setSeg1(i)}>{label}</button>
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
              <p className="text-muted" style={{ gridColumn: '1/-1', padding: '24px 0' }}>Мероприятия не найдены</p>
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
              <p className="text-muted" style={{ gridColumn: '1/-1', padding: '24px 0' }}>Мероприятия не найдены</p>
            )}
          </div>
        </>
      )}

      {seg1 === 2 && (
        <div style={{ padding: '48px 0', textAlign: 'center' }}>
          <Icon id="i-calendar" style={{ width: 40, height: 40, color: 'var(--border-2)', margin: '0 auto 16px' }} />
          <p style={{ fontSize: 15, color: 'var(--muted)' }}>Войдите, чтобы увидеть свои регистрации</p>
        </div>
      )}

      <div className="row" style={{ justifyContent: 'center', marginTop: 32 }}>
        <button className="btn secondary">Загрузить ещё <Icon id="i-chevron-d" style={{ width: 14, height: 14 }} /></button>
      </div>
    </>
  )
}
