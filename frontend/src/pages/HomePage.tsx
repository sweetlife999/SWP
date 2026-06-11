import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'

export default function HomePage() {
  const [newsSeg, setNewsSeg] = useState('all')

  return (
    <>

      {/* Hero */}
      <section className="hero" aria-label="Featured story">
        <div>
          <span className="eyebrow">SU · TOP STORY · 9 ИЮНЯ 2026</span>
          <h1 style={{ marginTop: 8 }}>Innopolis Open 2026 — итоги и победители всех треков</h1>
          <p className="lead">
            Восемь команд за два дня собрали 14 проектов: от ML-judging для дебатных
            клубов до open-source CRM для IT-кафедр. Подробности, фото, презентации —
            в полном репортаже от SU:Media.
          </p>
          <div className="actions">
            <button className="btn primary">
              Читать репортаж <Icon id="i-arrow-r" style={{ width: 14, height: 14 }} />
            </button>
            <button className="btn secondary">Все новости</button>
          </div>
        </div>
        <div className="hero-photo">
          <div className="caption">SU:Media · open hack 2026 · фото Алии Газизовой</div>
        </div>
      </section>

      {/* Departments */}
      <div className="page-head" style={{ marginTop: 36 }}>
        <div className="title">
          <span className="eyebrow">Команда</span>
          <h2>Три департамента, одно сообщество</h2>
        </div>
        <Link className="btn ghost" to="/members">
          Все участники <Icon id="i-arrow-r" style={{ width: 14, height: 14 }} />
        </Link>
      </div>

      <div className="deps">
        <article className="dep-card dep-core">
          <div className="dep-name">SU:Core</div>
          <h3>Стратегия, инфраструктура, переговоры с университетом.</h3>
          <p className="text-muted" style={{ fontSize: 13 }}>Координирует политики, бюджет студсовета, ведёт коммуникацию с деканатами и кампусной службой.</p>
          <div className="stats">
            <span><b>8</b> участников</span>
            <span><b>3</b> активных проекта</span>
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
            <span>Открыть профиль департамента</span>
            <span className="arrow"><Icon id="i-arrow-r" /></span>
          </div>
        </article>

        <article className="dep-card dep-active">
          <div className="dep-name">SU:Active</div>
          <h3>Мероприятия, культура, спорт — всё, что собирает кампус.</h3>
          <p className="text-muted" style={{ fontSize: 13 }}>Организует тематические недели, лекции, спортивные турниры. Главные люди за back-of-house ивентов.</p>
          <div className="stats">
            <span><b>14</b> участников</span>
            <span><b>7</b> ивентов в плане</span>
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
            <span>Открыть профиль департамента</span>
            <span className="arrow"><Icon id="i-arrow-r" /></span>
          </div>
        </article>

        <article className="dep-card dep-media">
          <div className="dep-name">SU:Media</div>
          <h3>Контент, дизайн, лента кампуса — фронт студсовета.</h3>
          <p className="text-muted" style={{ fontSize: 13 }}>Снимает ивенты, ведёт ленту в IU Connect, делает плакаты, пишет лонгриды для портала.</p>
          <div className="stats">
            <span><b>6</b> участников</span>
            <span><b>34</b> публикации</span>
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
            <span>Открыть профиль департамента</span>
            <span className="arrow"><Icon id="i-arrow-r" /></span>
          </div>
        </article>
      </div>

      {/* News + side widgets */}
      <div className="home-grid">
        <section>
          <div className="page-head" style={{ marginBottom: 18 }}>
            <div className="title">
              <span className="eyebrow">Лента</span>
              <h2 style={{ fontSize: 20 }}>Свежие новости студсовета</h2>
            </div>
            <div className="seg">
              <button className={newsSeg === 'all' ? 'active' : ''} onClick={() => setNewsSeg('all')}>Все</button>
              <button className={newsSeg === 'core' ? 'active' : ''} onClick={() => setNewsSeg('core')}>SU:Core</button>
              <button className={newsSeg === 'active' ? 'active' : ''} onClick={() => setNewsSeg('active')}>SU:Active</button>
              <button className={newsSeg === 'media' ? 'active' : ''} onClick={() => setNewsSeg('media')}>SU:Media</button>
            </div>
          </div>

          <div className="news-list">
            <article className="news-row">
              <div className="thumb a"></div>
              <div className="news-body">
                <div className="meta">
                  <span className="tag green"><span className="dot"></span>SU:Core</span>
                  <span>9 июня · 8 мин</span>
                </div>
                <h3>Новый формат общих собраний — каждый второй четверг</h3>
                <p>Решили после прошлогоднего голосования: open meetings раз в две недели в коворкинге Sport Tower, всегда с повесткой и трансляцией.</p>
              </div>
            </article>

            <article className="news-row">
              <div className="thumb b"></div>
              <div className="news-body">
                <div className="meta">
                  <span className="tag blue"><span className="dot"></span>SU:Active</span>
                  <span>7 июня · 4 мин</span>
                </div>
                <h3>Программа Summer Days объявлена: гребля, кино под открытым небом, барбекю</h3>
                <p>Шесть событий с 20 июня по 5 июля. Регистрация в разделе Events, на каждое — лимит мест и Innopoints за участие.</p>
              </div>
            </article>

            <article className="news-row">
              <div className="thumb c"></div>
              <div className="news-body">
                <div className="meta">
                  <span className="tag purple"><span className="dot"></span>SU:Media</span>
                  <span>5 июня · 12 мин</span>
                </div>
                <h3>Лонгрид: как первый набор SU начинался в 2019-м</h3>
                <p>Тимур Каримов, основатель студсовета, рассказывает про первые комнаты, странную бюрократию и почему всё это работает шесть лет.</p>
              </div>
            </article>
          </div>

          <div className="row" style={{ justifyContent: 'center', marginTop: 24 }}>
            <button className="btn secondary">
              Загрузить ещё <Icon id="i-chevron-d" style={{ width: 14, height: 14 }} />
            </button>
          </div>
        </section>

        <aside className="col" style={{ gap: 20 }}>
          {/* Upcoming events */}
          <div className="widget">
            <div className="row sb">
              <h4><Icon id="i-calendar" className="ic" />Ближайшие ивенты</h4>
              <Link to="/events" className="text-mono" style={{ fontSize: 11, color: 'var(--accent-700)', letterSpacing: '0.04em' }}>ВСЕ →</Link>
            </div>
            <div>
              {[
                { d: '14', m: 'ИЮН', t: 'Open Mic: stand-up evening', tag: 'blue', tagLabel: 'SU:Active', s: '19:00 · Sport Tower' },
                { d: '20', m: 'ИЮН', t: 'Hackathon Summer 24h', tag: 'green', tagLabel: 'SU:Core', s: '10:00 · 519' },
                { d: '25', m: 'ИЮН', t: 'Photo walk · Volga shore', tag: 'purple', tagLabel: 'SU:Media', s: '17:30' },
                { d: '02', m: 'ИЮЛ', t: 'Movie under the sky · La La Land', tag: 'blue', tagLabel: 'SU:Active', s: '21:30 · campus square' },
              ].map((e, i) => (
                <div className="event-row" key={i}>
                  <div className="date"><div><div className="d">{e.d}</div><div className="m">{e.m}</div></div></div>
                  <div className="event-info">
                    <div className="t">{e.t}</div>
                    <div className="s">
                      <span className={`tag ${e.tag}`} style={{ height: 18, fontSize: 10, padding: '0 6px' }}>{e.tagLabel}</span>
                      <span>{e.s}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active poll */}
          <div className="widget">
            <div className="row sb">
              <h4><Icon id="i-clipboard" className="ic" />Открытый опрос</h4>
              <span className="tag outline">2 мин</span>
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.4 }}>Какой формат корпоративного мерча студсовета вы бы взяли?</p>
              <div className="col gap-2" style={{ marginTop: 14 }}>
                <label className="radio"><input type="radio" name="merch" /><span className="box"></span>Худи с тонкой айдентикой</label>
                <label className="radio"><input type="radio" name="merch" /><span className="box"></span>Тоут-сумка</label>
                <label className="radio"><input type="radio" name="merch" /><span className="box"></span>Шопер + стикерпак</label>
                <label className="radio"><input type="radio" name="merch" /><span className="box"></span>Только цифровые наклейки</label>
              </div>
              <button className="btn primary mt-4" style={{ width: '100%' }}>Проголосовать</button>
            </div>
          </div>

          {/* Active donation */}
          <div className="widget donate-block">
            <div className="row sb">
              <h4><Icon id="i-heart" className="ic" />Текущая цель донатов</h4>
              <Link to="/donations" className="text-mono" style={{ fontSize: 11, color: 'var(--accent-700)', letterSpacing: '0.04em' }}>ВСЕ →</Link>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Спортинвентарь для лагеря Summer Days</div>
              <div className="row sb mb-2">
                <span className="amount">₽ 64,200<span className="pct">64%</span></span>
                <span className="goal">из ₽ 100,000</span>
              </div>
              <div className="progress lg"><div className="bar" style={{ width: '64%' }}></div></div>
              <div className="row sb mt-2" style={{ fontSize: 12, color: 'var(--muted)' }}>
                <span>87 студентов поддержали</span>
                <span>осталось 11 дней</span>
              </div>
              <button className="btn primary mt-4" style={{ width: '100%' }}>
                Поддержать <Icon id="i-heart" style={{ width: 14, height: 14 }} />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}
