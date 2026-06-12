import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'

export default function EventsPage() {
  const [seg1, setSeg1] = useState(0)
  const [seg2, setSeg2] = useState(0)

  return (
    <>

      <div className="page-head">
        <div className="title">
          <span className="eyebrow">Жизнь кампуса</span>
          <h1>Events</h1>
          <p className="lead" style={{ fontSize: 14, marginTop: 6 }}>Ближайшие и прошедшие мероприятия от SU. За участие — Innopoints.</p>
        </div>
        <div className="row gap-2">
          <button className="btn secondary"><Icon id="i-calendar" style={{ width: 14, height: 14 }} />Календарь</button>
        </div>
      </div>

      <div className="filters-bar">
        <div className="seg">
          {['Текущие · 7', 'Прошедшие · 24', 'Мои регистрации · 3'].map((label, i) => (
            <button key={i} className={seg1 === i ? 'active' : ''} onClick={() => setSeg1(i)}>{label}</button>
          ))}
        </div>
        <div className="seg" style={{ marginLeft: 'auto' }}>
          {['Все', 'SU:Core', 'SU:Active', 'SU:Media'].map((label, i) => (
            <button key={i} className={seg2 === i ? 'active' : ''} onClick={() => setSeg2(i)}>{label}</button>
          ))}
        </div>
        <button className="btn secondary"><Icon id="i-filter" style={{ width: 14, height: 14 }} />Фильтры</button>
      </div>

      <div className="section-head-row">
        <h3>Текущие <span className="count">07</span></h3>
        <a className="text-mono" style={{ fontSize: 11, letterSpacing: '0.04em', color: 'var(--accent-700)' }} href="#">ВСЕ ТЕКУЩИЕ →</a>
      </div>

      <div className="events-grid">
        <Link className="event-card featured" to="/events/1">
          <div className="ec-cover">
            <div className="date-badge"><div className="d">20</div><div className="m">ИЮН</div></div>
            <span className="status-badge live">live · регистрация открыта</span>
            <span className="points"><Icon id="i-coin" style={{ width: 11, height: 11 }} />+120 IP</span>
          </div>
          <div className="ec-body">
            <div className="ec-meta">
              <span className="tag green"><span className="dot"></span>SU:Core</span>
              <span>10:00–10:00 (24 ч)</span>
              <span>· 519 Sport Tower</span>
            </div>
            <h3>Hackathon Summer 24h — open hack под открытым небом</h3>
            <p className="desc">24 часа, любая тема, любое количество людей в команде. Финал и презентация — в воскресенье вечером, призы от партнёров.</p>
            <div className="ec-foot">
              <div className="row gap-2">
                <div className="avatars">
                  <div className="avatar sm" style={{ background: '#a3e0ad' }}>МР</div>
                  <div className="avatar sm" style={{ background: '#a8c0e0' }}>АГ</div>
                  <div className="avatar sm" style={{ background: '#e0a8c8' }}>АЛ</div>
                </div>
                <span>32 заявки · 12 мест свободно</span>
              </div>
              <span className="open">Подробнее <Icon id="i-arrow-r" style={{ width: 12, height: 12 }} /></span>
            </div>
          </div>
        </Link>

        <Link className="event-card" to="#">
          <div className="ec-cover a">
            <div className="date-badge"><div className="d">14</div><div className="m">ИЮН</div></div>
            <span className="points"><Icon id="i-coin" style={{ width: 11, height: 11 }} />+30 IP</span>
          </div>
          <div className="ec-body">
            <div className="ec-meta"><span className="tag blue"><span className="dot"></span>SU:Active</span><span>19:00</span></div>
            <h3>Open Mic: stand-up evening</h3>
            <p className="desc">Студенческий вечер открытого микрофона, 12 выступлений по 5 минут.</p>
            <div className="ec-foot">
              <span>48 / 80 регистраций</span>
              <span className="open">Подробнее <Icon id="i-arrow-r" style={{ width: 12, height: 12 }} /></span>
            </div>
          </div>
        </Link>

        <Link className="event-card" to="#">
          <div className="ec-cover c">
            <div className="date-badge"><div className="d">25</div><div className="m">ИЮН</div></div>
            <span className="points"><Icon id="i-coin" style={{ width: 11, height: 11 }} />+25 IP</span>
          </div>
          <div className="ec-body">
            <div className="ec-meta"><span className="tag purple"><span className="dot"></span>SU:Media</span><span>17:30 · Волга</span></div>
            <h3>Photo walk · Volga shore</h3>
            <p className="desc">Фотопрогулка на закате с разбором кадров от Анны Лебедевой. Уровень — любой.</p>
            <div className="ec-foot">
              <span>14 / 20 мест</span>
              <span className="open">Подробнее <Icon id="i-arrow-r" style={{ width: 12, height: 12 }} /></span>
            </div>
          </div>
        </Link>

        <Link className="event-card" to="#">
          <div className="ec-cover b">
            <div className="date-badge"><div className="d">02</div><div className="m">ИЮЛ</div></div>
            <span className="points"><Icon id="i-coin" style={{ width: 11, height: 11 }} />+20 IP</span>
          </div>
          <div className="ec-body">
            <div className="ec-meta"><span className="tag blue"><span className="dot"></span>SU:Active</span><span>21:30 · campus square</span></div>
            <h3>Movie under the sky · La La Land</h3>
            <p className="desc">Большой проектор, экран на 12 метров, пледы и попкорн. Бесплатно.</p>
            <div className="ec-foot">
              <span>67 регистраций</span>
              <span className="open">Подробнее <Icon id="i-arrow-r" style={{ width: 12, height: 12 }} /></span>
            </div>
          </div>
        </Link>

        <Link className="event-card" to="#">
          <div className="ec-cover d">
            <div className="date-badge"><div className="d">05</div><div className="m">ИЮЛ</div></div>
            <span className="points"><Icon id="i-coin" style={{ width: 11, height: 11 }} />+40 IP</span>
          </div>
          <div className="ec-body">
            <div className="ec-meta"><span className="tag blue"><span className="dot"></span>SU:Active</span><span>12:00 · pier</span></div>
            <h3>Гребля и BBQ · закрытие Summer Days</h3>
            <p className="desc">Гребные лодки на Волге, BBQ на берегу, награждение участников Summer Days.</p>
            <div className="ec-foot">
              <span>28 / 60 регистраций</span>
              <span className="open">Подробнее <Icon id="i-arrow-r" style={{ width: 12, height: 12 }} /></span>
            </div>
          </div>
        </Link>

        <Link className="event-card" to="#">
          <div className="ec-cover f">
            <div className="date-badge"><div className="d">12</div><div className="m">ИЮЛ</div></div>
            <span className="points"><Icon id="i-coin" style={{ width: 11, height: 11 }} />+15 IP</span>
          </div>
          <div className="ec-body">
            <div className="ec-meta"><span className="tag green"><span className="dot"></span>SU:Core</span><span>15:00 · аудитория 408</span></div>
            <h3>Open meeting Q3: бюджет, ивенты, вопросы</h3>
            <p className="desc">Открытая встреча студсовета: распределение бюджета на третий квартал, ответы на вопросы.</p>
            <div className="ec-foot">
              <span>21 регистрация</span>
              <span className="open">Подробнее <Icon id="i-arrow-r" style={{ width: 12, height: 12 }} /></span>
            </div>
          </div>
        </Link>
      </div>

      <div className="section-head-row">
        <h3>Прошедшие <span className="count">24</span></h3>
        <a className="text-mono" style={{ fontSize: 11, letterSpacing: '0.04em', color: 'var(--accent-700)' }} href="#">АРХИВ →</a>
      </div>

      <div className="events-grid">
        <Link className="event-card passed" to="#">
          <div className="ec-cover e passed-cover">
            <div className="date-badge"><div className="d">28</div><div className="m">МАЙ</div></div>
            <span className="status-badge">завершён</span>
          </div>
          <div className="ec-body">
            <div className="ec-meta"><span className="tag green"><span className="dot"></span>SU:Core</span><span>2026 · 320 участников</span></div>
            <h3>Innopolis Open 2026 — итоги</h3>
            <p className="desc">Главное событие весны: 14 проектов, восемь команд, два дня. Призовой фонд от партнёров — ₽ 450,000.</p>
            <div className="ec-foot">
              <span>14 проектов · 3 победителя</span>
              <span className="open">Репортаж <Icon id="i-arrow-r" style={{ width: 12, height: 12 }} /></span>
            </div>
          </div>
        </Link>

        <Link className="event-card passed" to="#">
          <div className="ec-cover a passed-cover">
            <div className="date-badge"><div className="d">12</div><div className="m">МАЙ</div></div>
            <span className="status-badge">завершён</span>
          </div>
          <div className="ec-body">
            <div className="ec-meta"><span className="tag blue"><span className="dot"></span>SU:Active</span><span>120 человек</span></div>
            <h3>Весенний турнир по настольному теннису</h3>
            <p className="desc">28 участников, 6 призёров. Победитель — Дмитрий Карпов (B23-CS).</p>
            <div className="ec-foot">
              <span>28 участников</span>
              <span className="open">Фотографии <Icon id="i-arrow-r" style={{ width: 12, height: 12 }} /></span>
            </div>
          </div>
        </Link>

        <Link className="event-card passed" to="#">
          <div className="ec-cover c passed-cover">
            <div className="date-badge"><div className="d">20</div><div className="m">АПР</div></div>
            <span className="status-badge">завершён</span>
          </div>
          <div className="ec-body">
            <div className="ec-meta"><span className="tag purple"><span className="dot"></span>SU:Media</span><span>лекция</span></div>
            <h3>Как снимать кампусный лонгрид: лекция от Sasha Reka</h3>
            <p className="desc">Открытая лекция приглашённого фотожурналиста. Видео-запись доступна в архиве SU:Media.</p>
            <div className="ec-foot">
              <span>56 участников</span>
              <span className="open">Видео <Icon id="i-arrow-r" style={{ width: 12, height: 12 }} /></span>
            </div>
          </div>
        </Link>
      </div>

      <div className="row" style={{ justifyContent: 'center', marginTop: 32 }}>
        <button className="btn secondary">Загрузить ещё <Icon id="i-chevron-d" style={{ width: 14, height: 14 }} /></button>
      </div>
    </>
  )
}
