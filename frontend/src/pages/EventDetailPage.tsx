import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'

export default function EventDetailPage() {
  return (
    <>

      <section className="event-banner">
        <div className="banner-inner">
          <div>
            <div className="badges">
              <span className="b">SU:Core · TOP</span>
              <span className="b live">live · регистрация открыта</span>
            </div>
            <h1>Hackathon Summer 24h</h1>
            <p className="sub">24 часа открытого хакатона: любая идея, любой стек, любые команды. Финал — презентации в воскресенье вечером.</p>
          </div>
          <div className="quick-meta">
            <div className="qm"><span className="qm-label">КОГДА</span><span className="qm-value">20–21 ИЮН</span></div>
            <div className="qm"><span className="qm-label">ГДЕ</span><span className="qm-value">519 Sport Tower</span></div>
            <div className="qm"><span className="qm-label">ОЧКИ</span><span className="qm-value">+120 IP</span></div>
          </div>
        </div>
      </section>

      <div className="detail-grid">
        <div>
          <article className="content-block">
            <h2>О мероприятии</h2>
            <p>Hackathon Summer 24h — открытый летний хакатон от SU:Core. За 24 часа команды до 5 человек проходят путь от идеи до прототипа: вечер пятницы → защита в воскресенье. Темы свободные, главное — собрать что-то работающее, показать видеодемо и получить фидбек от менторов.</p>
            <p>Мы намеренно не задаём строгие track-ограничения. Если ваша идея — про студенческую жизнь, образование, кампус, общение или просто весёлый side-project — это подходит. Цель — провести 24 часа, в которые не страшно собрать неидеальное MVP и научиться разрабатывать вместе.</p>
            <p><b>Что нужно взять с собой:</b> ноутбук, удлинитель, спальный мешок если планируете спать. Кофе, чай, печеньки, пиццу в субботу вечером и завтрак в воскресенье — обеспечивает SU.</p>
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
              <button className="btn secondary"><Icon id="i-map" style={{ width: 14, height: 14 }} />Открыть в Яндекс.Картах</button>
              <button className="btn ghost"><Icon id="i-copy" style={{ width: 14, height: 14 }} />Скопировать адрес</button>
            </div>
          </article>

          <article className="content-block">
            <h2>Похожие мероприятия</h2>
            <div className="related-grid">
              <a className="related-card" href="#">
                <div className="img"></div>
                <div className="body"><div className="meta">12 ИЮЛ · SU:CORE</div><h4>Open meeting Q3: бюджет и ивенты</h4></div>
              </a>
              <a className="related-card" href="#">
                <div className="img a"></div>
                <div className="body"><div className="meta">14 ИЮН · SU:ACTIVE</div><h4>Open Mic: stand-up evening</h4></div>
              </a>
              <a className="related-card" href="#">
                <div className="img b"></div>
                <div className="body"><div className="meta">5 ИЮЛ · SU:ACTIVE</div><h4>Гребля и BBQ · закрытие Summer Days</h4></div>
              </a>
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
            <div className="points-block">
              <Icon id="i-coin" style={{ width: 20, height: 20 }} />
              <div>
                <b>+120 Innopoints</b><br />
                <span style={{ fontSize: 11, color: 'var(--accent-700)', opacity: 0.8 }}>+50 если довести проект до защиты</span>
              </div>
            </div>
            <div className="reg-status">
              <span className="num">32 / 44</span>
              <div className="progress" style={{ flex: 1 }}><div className="bar" style={{ width: '72%' }}></div></div>
            </div>
            <span className="text-muted" style={{ fontSize: 12, marginTop: -8 }}>осталось 12 свободных мест · регистрация до 19 июня 18:00</span>
            <button className="btn primary lg">Зарегистрироваться <Icon id="i-arrow-r" style={{ width: 14, height: 14 }} /></button>
            <button className="btn secondary">Сохранить в календарь</button>
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
