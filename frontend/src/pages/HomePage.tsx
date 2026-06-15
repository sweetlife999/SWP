import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'

const DEP_INFO = {
  core: {
    name: 'SU:Core',
    tagline: 'Стратегия, инфраструктура, переговоры с университетом',
    desc: 'SU:Core — административный хребет студсовета. Договаривается с университетом по вопросам расписания, кампусной инфраструктуры и студенческих правил. Ведёт бюджет, координирует работу других департаментов и проводит открытые собрания каждые две недели.',
    recent: [
      'Запуск SU Portal v1 — июнь 2026',
      'Согласование бюджета Q3 — ₽ 240 000',
      'Open meeting Q2: итоги и вопросы',
    ],
    dep: 'core' as const,
    cls: 'dep-core',
    count: 8,
  },
  active: {
    name: 'SU:Active',
    tagline: 'Мероприятия, спорт, культура кампуса',
    desc: 'SU:Active организует всё, что собирает кампус вместе: хакатоны, спортивные турниры, тематические недели, кино под открытым небом. Главные люди за кулисами любого ивента — логистика, еда, звук и атмосфера.',
    recent: [
      'Hackathon Summer 24h — июнь 2026',
      'Movie under the sky · La La Land — июль',
      'Гребля и BBQ · закрытие Summer Days',
    ],
    dep: 'active' as const,
    cls: 'dep-active',
    count: 14,
  },
  media: {
    name: 'SU:Media',
    tagline: 'Контент, дизайн, голос студсовета',
    desc: 'SU:Media — публичный фронт студсовета. Снимает фото и видео с мероприятий, ведёт ленту в IU Connect, делает плакаты и печатные материалы, пишет лонгриды и репортажи о жизни кампуса.',
    recent: [
      'Репортаж с Innopolis Open 2026 — 320 участников',
      'Photo walk · Volga shore — июнь 2026',
      'Серия лонгридов «Как мы делали хакатон»',
    ],
    dep: 'media' as const,
    cls: 'dep-media',
    count: 6,
  },
}

type DepKey = keyof typeof DEP_INFO

export default function HomePage() {
  const [openDep, setOpenDep] = useState<DepKey | null>(null)
  const info = openDep ? DEP_INFO[openDep] : null

  return (
    <>
      <section className="intro" aria-label="О студсовете">
        <span className="eyebrow">О студсовете</span>
        <h1>Студенческий совет<br />Университета Иннополис</h1>
        <p className="lead">
          Представляем интересы студентов, организуем кампусную жизнь и помогаем
          университету становиться лучше — с 2019 года. Три департамента, одна команда.
        </p>
      </section>

      <section aria-label="Команда">
        <div className="section-rule">
          <div className="sr-left">
            <span className="eyebrow">Команда</span>
            <h2>Три департамента, одно сообщество</h2>
          </div>
          <Link className="more" to="/members">
            Все участники
            <Icon id="i-arrow-r" style={{ width: 14, height: 14 }} />
          </Link>
        </div>

        <div className="deps">
          <div className="dep-tint dep-core" onClick={() => setOpenDep('core')} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && setOpenDep('core')}>
            <span className="dep-name">SU:Core</span>
            <h3>Стратегия, инфраструктура, переговоры с университетом.</h3>
            <p className="desc">Координирует политики, бюджет студсовета, ведёт коммуникацию с деканатами и кампусной службой.</p>
            <div className="meta">
              <span><b>8</b> участников</span>
              <span className="dot" />
              <span><b>3</b> активных проекта</span>
              <span className="dot" />
              <span><b>2</b> co-leads</span>
            </div>
            <div className="avatars">
              <div className="avatar" style={{ background: 'linear-gradient(135deg,#a3e0ad,#32b247)' }}>МР</div>
              <div className="avatar" style={{ background: 'linear-gradient(135deg,#b3d5a8,#5fa44f)' }}>ДА</div>
              <div className="avatar" style={{ background: 'linear-gradient(135deg,#c7dfa9,#74a55c)' }}>ЕВ</div>
              <div className="avatar" style={{ background: 'linear-gradient(135deg,#a8dba8,#3da152)' }}>ТК</div>
              <div className="more">+4</div>
            </div>
            <div className="open-row">
              <span>Подробнее о департаменте</span>
              <span className="arrow"><Icon id="i-arrow-r" style={{ width: 14, height: 14 }} /></span>
            </div>
          </div>

          <div className="dep-tint dep-active" onClick={() => setOpenDep('active')} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && setOpenDep('active')}>
            <span className="dep-name">SU:Active</span>
            <h3>Мероприятия, культура, спорт — всё, что собирает кампус.</h3>
            <p className="desc">Организует тематические недели, лекции, спортивные турниры. Главные люди за back-of-house ивентов.</p>
            <div className="meta">
              <span><b>14</b> участников</span>
              <span className="dot" />
              <span><b>7</b> ивентов в плане</span>
              <span className="dot" />
              <span><b>3</b> co-leads</span>
            </div>
            <div className="avatars">
              <div className="avatar" style={{ background: 'linear-gradient(135deg,#a8c0e0,#3868b8)' }}>АГ</div>
              <div className="avatar" style={{ background: 'linear-gradient(135deg,#b9c8e0,#5481c5)' }}>КЛ</div>
              <div className="avatar" style={{ background: 'linear-gradient(135deg,#c8d3e6,#7290c9)' }}>ИС</div>
              <div className="avatar" style={{ background: 'linear-gradient(135deg,#9eb6db,#2c5ba8)' }}>МЯ</div>
              <div className="more">+10</div>
            </div>
            <div className="open-row">
              <span>Подробнее о департаменте</span>
              <span className="arrow"><Icon id="i-arrow-r" style={{ width: 14, height: 14 }} /></span>
            </div>
          </div>

          <div className="dep-tint dep-media" onClick={() => setOpenDep('media')} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && setOpenDep('media')}>
            <span className="dep-name">SU:Media</span>
            <h3>Контент, дизайн, лента кампуса — фронт студсовета.</h3>
            <p className="desc">Снимает ивенты, ведёт ленту в IU Connect, делает плакаты, пишет лонгриды для портала.</p>
            <div className="meta">
              <span><b>6</b> участников</span>
              <span className="dot" />
              <span><b>34</b> публикации</span>
              <span className="dot" />
              <span><b>1</b> co-lead</span>
            </div>
            <div className="avatars">
              <div className="avatar" style={{ background: 'linear-gradient(135deg,#e0a8c8,#c93f8b)' }}>АЛ</div>
              <div className="avatar" style={{ background: 'linear-gradient(135deg,#e6b9d3,#d65fa3)' }}>ПК</div>
              <div className="avatar" style={{ background: 'linear-gradient(135deg,#dbb3d8,#b85eb0)' }}>ОН</div>
              <div className="avatar" style={{ background: 'linear-gradient(135deg,#e8c5db,#dc7eb3)' }}>СВ</div>
              <div className="more">+2</div>
            </div>
            <div className="open-row">
              <span>Подробнее о департаменте</span>
              <span className="arrow"><Icon id="i-arrow-r" style={{ width: 14, height: 14 }} /></span>
            </div>
          </div>
        </div>
      </section>

      {info && (
        <div className="modal-overlay" onClick={() => setOpenDep(null)}>
          <div className={`dep-modal ${info.cls}`} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setOpenDep(null)}>
              <Icon id="i-x" style={{ width: 14, height: 14 }} />
            </button>
            <div className="dep-modal-header">
              <div className="dep-name">{info.name}</div>
              <h2 style={{ margin: '6px 0 4px' }}>{info.name}</h2>
              <p className="tagline">{info.tagline}</p>
            </div>
            <div className="dep-modal-body">
              <p>{info.desc}</p>
              <h4>Недавние активности</h4>
              <ul>
                {info.recent.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
            <div className="dep-modal-foot">
              <Link
                className="btn primary"
                style={{ width: '100%', justifyContent: 'center' }}
                to={`/members?dep=${info.dep}`}
                onClick={() => setOpenDep(null)}
              >
                Посмотреть участников ({info.count} чел.)
                <Icon id="i-arrow-r" style={{ width: 14, height: 14 }} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
