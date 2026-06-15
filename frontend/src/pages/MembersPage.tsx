import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Icon } from '../components/Icon'

type TabKey = 'members' | 'history' | 'roadmap'

const DEP_KEYS = ['', 'core', 'active', 'media']

type Member = {
  dep: 'core' | 'active' | 'media'
  tag: string; name: string; role: string; meta: string
  bio: string; recent: string[]
}

const MEMBERS: Member[] = [
  { dep: 'core',   tag: 'SU:Core · LEAD',   name: 'Михаил Раянов',      role: 'CO-LEAD · B21-AI', meta: '3 года в SU · 14 проектов',
    bio: 'Третий год в студсовете. Веду переговоры с деканатами, координирую бюджет Q1–Q3 и запустил SU Portal.',
    recent: ['Запуск SU Portal v1 — июнь 2026', 'Согласование бюджета Q3 — ₽ 240 000', 'Hackathon Summer 24h — lead organizer'] },
  { dep: 'core',   tag: 'SU:Core',           name: 'Дарья Андреева',     role: 'CO-LEAD · B22-SE', meta: '2 года в SU',
    bio: 'Отвечаю за внутреннюю коммуникацию и документооборот SU:Core. Организую открытые собрания.',
    recent: ['Open meeting Q2: итоги апреля', 'Координация Welcome Week 2026', 'Подготовка Roadmap 2026'] },
  { dep: 'core',   tag: 'SU:Core',           name: 'Егор Воронов',       role: 'FINANCE · B23-DS', meta: '1 год в SU',
    bio: 'Слежу за бюджетом студсовета: веду таблицы трат, готовлю финансовые отчёты.',
    recent: ['Публикация финотчёта Q1 2026', 'Интеграция T-Bank для донат-системы', 'Аудит трат за 2025'] },
  { dep: 'core',   tag: 'SU:Core',           name: 'Тимур Камалов',      role: 'PROCESS · M24-CS', meta: '2 года в SU',
    bio: 'Занимаюсь внутренними процессами и инструментами SU. Поддерживаю Notion-базу и оптимизирую потоки.',
    recent: ['Документирование процессов для Handbook SU', 'Настройка нотификаций Telegram-бота', 'Архивирование решений Q1–Q2'] },
  { dep: 'active', tag: 'SU:Active · LEAD',  name: 'Алия Газизова',      role: 'CO-LEAD · B21-CS', meta: '3 года в SU · ивенты',
    bio: 'Главная по ивентам в SU:Active. Три года организую мероприятия — от камерных лекций до 300-человечных хакатонов.',
    recent: ['Hackathon Summer 24h — BBQ и закрытие', 'Summer Days 2026 — 7 событий', 'Open Mic: stand-up evening'] },
  { dep: 'active', tag: 'SU:Active',         name: 'Кирилл Логинов',     role: 'SPORTS · B22-IS',  meta: '2 года в SU',
    bio: 'Отвечаю за спортивный трек: турниры, командные активности и партнёрство с кампусным спорткомплексом.',
    recent: ['Весенний турнир по настольному теннису', 'Организация Гребля и BBQ', 'Переговоры по аренде Sports Tower'] },
  { dep: 'active', tag: 'SU:Active',         name: 'Илья Соколов',       role: 'CULTURE · B23-RO', meta: '1 год в SU',
    bio: 'Веду культурное направление: тематические вечера, кино и творческие активности.',
    recent: ['Movie under the sky · La La Land', 'Планирование Cinema Night Q3', 'Поиск площадки для open air'] },
  { dep: 'active', tag: 'SU:Active',         name: 'Майя Якушева',       role: 'CO-LEAD · B22-DS', meta: '2 года в SU',
    bio: 'Координирую команду SU:Active и слежу за тем, чтобы все ивенты шли по плану.',
    recent: ['Summer Days 2026 — координация', 'Онбординг новых участников', 'Ретроспектива ивентов за полугодие'] },
  { dep: 'media',  tag: 'SU:Media · LEAD',   name: 'Анна Лебедева',      role: 'CO-LEAD · B21-DS', meta: '2 года в SU · фото',
    bio: 'Возглавляю SU:Media и снимаю все крупные события кампуса. Фотожурналистика и работа с архивом.',
    recent: ['Репортаж: Innopolis Open 2026 (320 участников)', 'Photo walk · Volga shore', 'Лекция «Как снимать кампусный лонгрид»'] },
  { dep: 'media',  tag: 'SU:Media',          name: 'Полина Котова',       role: 'DESIGN · B22-CS',  meta: '1 год в SU',
    bio: 'Делаю весь визуал студсовета: афиши, баннеры, иллюстрации для IU Connect и фирменные материалы.',
    recent: ['Редизайн плакатной системы SU', 'Серия афиш Summer Days 2026', 'Верстка Handbook SU 2026'] },
  { dep: 'media',  tag: 'SU:Media',          name: 'Ольга Никитина',     role: 'EDITOR · B23-IS',  meta: '1 год в SU',
    bio: 'Пишу тексты для портала и IU Connect: новости, лонгриды, анонсы ивентов и интервью.',
    recent: ['Серия «Как мы делали хакатон»', 'Интервью с победителями Innopolis Open', 'Редактирование Roadmap 2026'] },
  { dep: 'media',  tag: 'SU:Media',          name: 'Сергей Васильев',    role: 'VIDEO · B22-RO',   meta: '2 года в SU',
    bio: 'Снимаю и монтирую видео с ивентов. Веду YouTube-архив и стримы открытых собраний.',
    recent: ['Видеоотчёт: Innopolis Open 2026', 'Стрим Open meeting Q2', 'Монтаж highlight Hackathon 24h'] },
  { dep: 'active', tag: 'SU:Active',         name: 'Никита Орлов',       role: 'LOGISTICS · B22-AI', meta: '1 год в SU',
    bio: 'Занимаюсь логистикой мероприятий: аренда оборудования, закупка расходников, координация доставки.',
    recent: ['Hackathon 24h: закупка оборудования', 'BBQ логистика для Summer Days', 'Инвентаризация склада SU'] },
  { dep: 'active', tag: 'SU:Active',         name: 'Светлана Журавлёва', role: 'EVENTS · B23-DS',  meta: '1 год в SU',
    bio: 'Помогаю организовывать ивенты: работаю с регистрациями, отвечаю гостям.',
    recent: ['Регистрация на Hackathon Summer 24h', 'Поддержка Open Mic evening', 'Планирование Welcome Week Q3'] },
  { dep: 'active', tag: 'SU:Active',         name: 'Артём Беляков',      role: 'ADVENTURE · B21-CS', meta: '3 года в SU',
    bio: 'Отвечаю за приключенческий трек: выезды, экскурсии и активности на природе.',
    recent: ['Гребля на Волге + BBQ — организация', 'Планирование горного трека Q3', 'Летние ночные прогулки'] },
]

const PHOTO_BG: Record<Member['dep'], string> = {
  core:   'linear-gradient(135deg, #d1efd8, #88c595)',
  active: 'linear-gradient(135deg, #c1d6f8, #6b89b3)',
  media:  'linear-gradient(135deg, #f6c1da, #d65fa3)',
}

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2)
}

export default function MembersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const depParam = searchParams.get('dep') ?? ''
  const initialSeg = DEP_KEYS.indexOf(depParam) >= 0 ? DEP_KEYS.indexOf(depParam) : 0

  const [tab, setTab] = useState<TabKey>('members')
  const [memberSeg, setMemberSeg] = useState(initialSeg)
  const [editing, setEditing] = useState(false)
  const [selected, setSelected] = useState<Member | null>(null)

  function handleSeg(i: number) {
    setMemberSeg(i)
    if (DEP_KEYS[i]) setSearchParams({ dep: DEP_KEYS[i] })
    else setSearchParams({})
  }

  const visibleMembers = memberSeg === 0 ? MEMBERS : MEMBERS.filter(p => p.dep === DEP_KEYS[memberSeg])

  return (
    <>
      <div className="page-head">
        <div className="title">
          <span className="eyebrow">Команда и история</span>
          <h1>Members · History · Roadmap</h1>
        </div>
        <div className="row gap-2">
          <a className="btn secondary" href="mailto:su@innopolis.university"><Icon id="i-mail" style={{ width: 14, height: 14 }} />Связаться с SU</a>
        </div>
      </div>

      <div className="tabs">
        {(['members', 'history', 'roadmap'] as TabKey[]).map((t) => (
          <button key={t} className={`tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t === 'members' && <>Members <span className="text-muted text-mono" style={{ fontSize: 11, marginLeft: 6 }}>28</span></>}
            {t === 'history' && 'History'}
            {t === 'roadmap' && 'Roadmap 2026'}
          </button>
        ))}
      </div>

      {/* Members pane */}
      {tab === 'members' && (
        <div>
          <div className="members-filters-bar">
            <div className="seg">
              {['Все · 28', 'SU:Core · 8', 'SU:Active · 14', 'SU:Media · 6'].map((l, i) => (
                <button key={i} className={memberSeg === i ? 'active' : ''} onClick={() => handleSeg(i)}>{l}</button>
              ))}
            </div>
            <div className="input-group" style={{ width: 280, marginLeft: 'auto' }}>
              <Icon id="i-search" className="ic" />
              <input placeholder="Найти по имени, направлению…" />
            </div>
            <button className="btn secondary"><Icon id="i-filter" style={{ width: 14, height: 14 }} />Фильтры</button>
          </div>

          <div className="members-grid">
            {visibleMembers.map((p, i) => (
              <article key={i} className={`person dep-${p.dep}`} style={{ cursor: 'pointer' }} onClick={() => setSelected(p)}>
                <div className="photo">
                  <span className="dep-tag">{p.tag}</span>
                  <div className="silhouette"></div>
                </div>
                <div className="body">
                  <div className="name">{p.name}</div>
                  <div className="role">{p.role}</div>
                  <div className="meta">{p.meta}</div>
                </div>
              </article>
            ))}
          </div>

          <div className="row" style={{ justifyContent: 'center', marginTop: 28 }}>
            <button className="btn secondary">Показать всех 28 участников <Icon id="i-chevron-d" style={{ width: 14, height: 14 }} /></button>
          </div>
        </div>
      )}

      {/* History pane */}
      {tab === 'history' && (
        <article className="history">
          <div className="meta-line">SU IU · оригинал — 2019 · последняя редакция: апрель 2026</div>
          <h1 style={{ fontSize: 36, letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 12 }}>Шесть лет студенческого самоуправления.</h1>
          <p className="lead" style={{ fontSize: 17 }}>Как студсовет Иннополиса вырос из чата в Telegram-беседе в три департамента с собственной кассой, ивентами, продакшеном и матрицей прав.</p>
          <p className="lede">В сентябре 2019 года восемь человек собрались в комнате 320 и решили, что коммуникации между кампусом и Учёным советом нужен формат поудобнее, чем выходить лично в деканат. Тимур Каримов записал в Notion первые правила — три абзаца, без департаментов, без выборов. На следующей неделе к чату подключились ещё 12 человек.</p>
          <p>За первый год SU занимался в основном переговорами: переноса дедлайнов из-за хакатонов, расписания душевых в общежитии, расширения окон столовой. Бюджета не было — его проводили через университетскую административку. Структуры тоже не было: один человек делал и фотки, и расписание, и говорил с проректором.</p>
          <h2>2021 — раздел на департаменты</h2>
          <p>Команда выросла до 23 человек. Главная боль: один и тот же человек разрывался между организацией Halloween-вечера и переговорами по новому корпусу. Решение пришло в феврале — разделить SU на три департамента с co-leads. Так появились SU:Core (стратегия + университет), SU:Active (события), SU:Media (контент).</p>
          <p>Тогда же ввели первые открытые собрания и голосования за бюджет — раз в семестр выкладывали в IU Connect, кто на что хочет потратить.</p>
          <div className="history-photo">
            <div className="caption">Первое общее собрание после раздела на департаменты · март 2021 · фото SU:Media архив</div>
          </div>
          <h2>2023 — формат, который остался</h2>
          <p>Утвердили роли, описали процессы, ввели Innopoints — внутреннюю систему за участие в активностях. Ввели регулярные открытые митинги раз в две недели и публичный backlog SU:Core.</p>
          <p>С 2024 студсовет начал собирать донаты на конкретные цели — мерч, кофе на собраниях, спортинвентарь — с публичной отчётностью трат. К 2026-му через систему прошло чуть больше миллиона рублей.</p>
          <h2>Ключевые вехи</h2>
          <ul className="timeline">
            {[
              ['сентябрь 2019', 'Восемь основателей. Чат, Notion-страница, никакой иерархии.'],
              ['октябрь 2020', 'Первый формальный бюджет: ₽ 47,000 на Halloween и зимние посиделки.'],
              ['февраль 2021', 'Раздел на три департамента, появление co-leads.'],
              ['сентябрь 2022', 'Запуск Innopoints за участие.'],
              ['март 2023', 'Открытый backlog SU:Core, публикация повестки и решений.'],
              ['декабрь 2024', 'Первая прозрачная донат-кампания (₽ 320,000 на спортинвентарь).'],
              ['апрель 2026', 'Запуск этого портала — единая точка входа во все модули SU.'],
            ].map(([d, t], i) => (
              <li key={i}><b>{d}</b>{t}</li>
            ))}
          </ul>
          <h2>Что осталось важно</h2>
          <p>SU не парламент. Это рабочая команда студентов, которая закрывает три задачи: договариваться с университетом, организовывать жизнь кампуса и держать публичную ленту. Всё остальное — производное.</p>
        </article>
      )}

      {/* Roadmap pane */}
      {tab === 'roadmap' && (
        <div>
          <div className="row sb mb-4">
            <div>
              <span className="eyebrow">Roadmap 2026</span>
              <h2 style={{ fontSize: 22, marginTop: 4 }}>Что мы хотим закрыть в этом году</h2>
            </div>
            <div className="row gap-2 read-actions">
              <span className="tag green"><span className="dot"></span>Опубликовано · 4 июня</span>
            </div>
          </div>

          <section className={`roadmap-shell${editing ? ' editing' : ''}`}>
            <div className="rm-toolbar">
              <button className="tb-btn" title="Bold"><Icon id="i-bold" style={{ width: 14, height: 14 }} /></button>
              <button className="tb-btn" title="Italic"><Icon id="i-italic" style={{ width: 14, height: 14 }} /></button>
              <div className="tb-sep"></div>
              <button className="tb-btn" title="Heading"><span style={{ fontWeight: 700, fontSize: 13 }}>H</span></button>
              <button className="tb-btn" title="Paragraph"><Icon id="i-text" style={{ width: 14, height: 14 }} /></button>
              <div className="tb-sep"></div>
              <button className="tb-btn" title="List"><Icon id="i-list" style={{ width: 14, height: 14 }} /></button>
              <button className="tb-btn" title="Link"><Icon id="i-link" style={{ width: 14, height: 14 }} /></button>
              <button className="tb-btn" title="Divider"><span style={{ fontWeight: 600 }}>—</span></button>
              <div className="tb-spacer"></div>
              <div className="meta"><span className="text-mono">EDIT MODE</span> · автосохранение каждые 30 сек</div>
            </div>

            <div className="rm-edit" contentEditable={editing} suppressContentEditableWarning>
              <p style={{ fontSize: 17, color: 'var(--muted)', marginBottom: 24 }}>Цели студсовета на 2026 учебный год по четырём квартальным блокам. Поменять может только админ через «Редактировать».</p>
              {[
                { q: 'Q1 · ЯНВ–МАР', h: 'Запуск SU Portal v1', p: 'Единая точка входа для студсовета: новости, ивенты, опросы, донаты, внутренние модули команды. Заменить разрозненные Google-документы и табличные опросы.', items: ['5 публичных модулей и 3 внутренних', 'Перевод опросов с Google Forms на собственный конструктор', 'Адаптив для мобильных устройств'] },
                { q: 'Q2 · АПР–ИЮН', h: 'Прозрачные финансы и расширение донат-системы', p: 'Все траты студсовета — публично, с привязкой к цели и чеками. Добавить инструмент быстрого донат-кампейна для конкретных задач (спорт, мерч, ивенты).', items: ['Категории трат и публикация транзакций', 'Интеграция с ЮMoney / СБП', 'Месячные финансовые отчёты в IU Connect'] },
                { q: 'Q3 · ИЮЛ–СЕН', h: 'Сообщество и онбординг новых студентов', p: 'Welcome-программа для нового набора с гайдом по университету, кампусу и SU. Запуск buddy-программы для студентов-первокурсников.', items: ['Welcome-неделя: 12 событий, печатный гайдбук', 'Buddy-программа: 80 пар по интересам', 'Первая сессия открытого набора в SU'] },
                { q: 'Q4 · ОКТ–ДЕК', h: 'Институциональная стабильность', p: 'Передача знаний, документация процессов, выборы нового состава SU:Core. Цель — чтобы любой человек, который придёт в SU, мог войти в работу за неделю.', items: ['Хендбук SU: процессы, шаблоны, история решений', 'Открытые выборы co-leads с публичной презентацией', 'Архивирование 2026: ивенты, бюджеты, опросы'] },
              ].map((block, i, arr) => (
                <div className="q-block" key={i} style={i === arr.length - 1 ? { borderBottom: 0 } : {}}>
                  <div className="q-title">{block.q}</div>
                  <div className="q-body">
                    <h3>{block.h}</h3>
                    <p>{block.p}</p>
                    <ul>{block.items.map((item, j) => <li key={j}>{item}</li>)}</ul>
                  </div>
                </div>
              ))}
            </div>

            <div className="rm-foot">
              <button className="btn ghost" onClick={() => setEditing(false)}>Отмена</button>
              <button className="btn primary" onClick={() => setEditing(false)}><Icon id="i-check" style={{ width: 14, height: 14 }} />Сохранить изменения</button>
            </div>
          </section>

          <div className="row sb mt-4">
            <span className="text-muted" style={{ fontSize: 12 }}>Последнее изменение: Михаил Раянов · 4 июня 2026, 14:22</span>
            <div className={`row gap-2 read-actions${editing ? '' : ''}`}>
              <button className="btn secondary"><Icon id="i-eye" style={{ width: 14, height: 14 }} />История правок</button>
              <button className="btn primary" onClick={() => setEditing(true)}><Icon id="i-edit" style={{ width: 14, height: 14 }} />Редактировать</button>
            </div>
          </div>
        </div>
      )}

      {/* Member modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="member-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>
              <Icon id="i-x" style={{ width: 14, height: 14 }} />
            </button>
            <div className="member-modal-photo" style={{ background: PHOTO_BG[selected.dep] }}>
              <span className="dep-tag">{selected.tag}</span>
              <div className="silhouette-lg"></div>
            </div>
            <div className="member-modal-body">
              <div className="mm-name" style={{ marginTop: 16 }}>{selected.name}</div>
              <div className="mm-role">{selected.role}</div>
              <p className="mm-bio">{selected.bio}</p>
              <div className="mm-recent-label">Чем занимается</div>
              <ul className="mm-recent-list">
                {selected.recent.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
