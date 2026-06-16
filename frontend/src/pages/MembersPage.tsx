import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { api, type Member as ApiMember } from '../lib/api'
import { useAdmin } from '../lib/AdminContext'

type TabKey = 'members' | 'history' | 'roadmap'

const DEP_KEYS = ['', 'core', 'active', 'media']

type Member = ApiMember

const PHOTO_BG: Record<Member['dep'], string> = {
  core:   'linear-gradient(135deg, #d1efd8, #88c595)',
  active: 'linear-gradient(135deg, #c1d6f8, #6b89b3)',
  media:  'linear-gradient(135deg, #f6c1da, #d65fa3)',
}


export default function MembersPage() {
  const { isAdmin } = useAdmin()
  const [searchParams, setSearchParams] = useSearchParams()
  const depParam = searchParams.get('dep') ?? ''
  const initialSeg = DEP_KEYS.indexOf(depParam) >= 0 ? DEP_KEYS.indexOf(depParam) : 0

  const [tab, setTab] = useState<TabKey>('members')
  const [memberSeg, setMemberSeg] = useState(initialSeg)
  const [editing, setEditing] = useState(false)
  const [selected, setSelected] = useState<Member | null>(null)
  const [search, setSearch] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [toast, setToast] = useState('')
  const [members, setMembers] = useState<Member[]>([])
  const roadmapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    api.members.list().then(setMembers).catch(() => {})
  }, [])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  function handleSeg(i: number) {
    setMemberSeg(i)
    if (DEP_KEYS[i]) setSearchParams({ dep: DEP_KEYS[i] })
    else setSearchParams({})
  }

  async function handleRoadmapSave() {
    const html = roadmapRef.current?.innerHTML ?? ''
    try {
      await api.content.update('roadmap', html)
      showToast('Roadmap сохранён')
    } catch {
      showToast('Ошибка сохранения')
    }
    setEditing(false)
  }

  const filteredMembers = (memberSeg === 0 ? members : members.filter(p => p.dep === DEP_KEYS[memberSeg]))
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.role.toLowerCase().includes(search.toLowerCase()))
  const visibleMembers = showAll ? filteredMembers : filteredMembers.slice(0, 8)

  return (
    <>
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: 'var(--fg)', color: 'var(--bg)', padding: '10px 20px', borderRadius: 8, fontSize: 13, zIndex: 9999, pointerEvents: 'none' }}>
          {toast}
        </div>
      )}
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
              {['Все', 'SU:Core', 'SU:Active', 'SU:Media'].map((l, i) => (
                <button key={i} className={memberSeg === i ? 'active' : ''} onClick={() => handleSeg(i)}>{l}</button>
              ))}
            </div>
            <div className="input-group" style={{ width: 280, marginLeft: 'auto' }}>
              <Icon id="i-search" className="ic" />
              <input placeholder="Найти по имени, направлению…" value={search} onChange={e => { setSearch(e.target.value); setShowAll(true) }} />
            </div>
            <button className="btn secondary" onClick={() => showToast('Расширенные фильтры — в разработке')}><Icon id="i-filter" style={{ width: 14, height: 14 }} />Фильтры</button>
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

          {!showAll && filteredMembers.length > 8 && (
            <div className="row" style={{ justifyContent: 'center', marginTop: 28 }}>
              <button className="btn secondary" onClick={() => setShowAll(true)}>Показать всех {filteredMembers.length} участников <Icon id="i-chevron-d" style={{ width: 14, height: 14 }} /></button>
            </div>
          )}
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
          <p>Тогда же ввели первые открытые собрания и голосования за бюджет — раз в семестр выкладывали в общий чат, кто на что хочет потратить.</p>
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

            <div ref={roadmapRef} className="rm-edit" contentEditable={editing} suppressContentEditableWarning>
              <p style={{ fontSize: 17, color: 'var(--muted)', marginBottom: 24 }}>Цели студсовета на 2026 учебный год по четырём квартальным блокам. Поменять может только админ через «Редактировать».</p>
              {[
                { q: 'Q1 · ЯНВ–МАР', h: 'Запуск SU Portal v1', p: 'Единая точка входа для студсовета: новости, ивенты, опросы, донаты, внутренние модули команды. Заменить разрозненные Google-документы и табличные опросы.', items: ['5 публичных модулей и 3 внутренних', 'Перевод опросов с Google Forms на собственный конструктор', 'Адаптив для мобильных устройств'] },
                { q: 'Q2 · АПР–ИЮН', h: 'Прозрачные финансы и расширение донат-системы', p: 'Все траты студсовета — публично, с привязкой к цели и чеками. Добавить инструмент быстрого донат-кампейна для конкретных задач (спорт, мерч, ивенты).', items: ['Категории трат и публикация транзакций', 'Интеграция с ЮMoney / СБП', 'Месячные финансовые отчёты на портале'] },
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
              <button className="btn primary" onClick={handleRoadmapSave}><Icon id="i-check" style={{ width: 14, height: 14 }} />Сохранить изменения</button>
            </div>
          </section>

          <div className="row sb mt-4">
            <span className="text-muted" style={{ fontSize: 12 }}>Последнее изменение: Михаил Раянов · 4 июня 2026, 14:22</span>
            <div className={`row gap-2 read-actions${editing ? '' : ''}`}>
              <button className="btn secondary" onClick={() => showToast('История правок: последнее изменение — Михаил Раянов, 4 июня 2026')}><Icon id="i-eye" style={{ width: 14, height: 14 }} />История правок</button>
              {isAdmin && <button className="btn primary" onClick={() => setEditing(true)}><Icon id="i-edit" style={{ width: 14, height: 14 }} />Редактировать</button>}
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
