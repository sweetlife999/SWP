import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { api, type Member as ApiMember } from '../lib/api'
import { useAdmin } from '../lib/AdminContext'

type TabKey = 'members' | 'history' | 'roadmap'

const DEP_KEYS = ['', 'core', 'active', 'media']

type Member = ApiMember

const DEP_TAG_PREFIX: Record<Member['dep'], string> = {
  core: 'SU:Core', active: 'SU:Active', media: 'SU:Media',
}

const PHOTO_BG: Record<Member['dep'], string> = {
  core:   'linear-gradient(135deg, #d1efd8, #88c595)',
  active: 'linear-gradient(135deg, #c1d6f8, #6b89b3)',
  media:  'linear-gradient(135deg, #f6c1da, #d65fa3)',
}

const DEFAULT_ROADMAP_HTML = `<p style="font-size:17px;color:var(--muted);margin-bottom:24px">Цели студсовета на 2026 учебный год по четырём квартальным блокам.</p><div class="q-block"><div class="q-title">Q1 · ЯНВ–МАР</div><div class="q-body"><h3>Запуск SU Portal v1</h3><p>Единая точка входа для студсовета: новости, ивенты, опросы, донаты, внутренние модули команды. Заменить разрозненные Google-документы и табличные опросы.</p><ul><li>5 публичных модулей и 3 внутренних</li><li>Перевод опросов с Google Forms на собственный конструктор</li><li>Адаптив для мобильных устройств</li></ul></div></div><div class="q-block"><div class="q-title">Q2 · АПР–ИЮН</div><div class="q-body"><h3>Прозрачные финансы и расширение донат-системы</h3><p>Все траты студсовета — публично, с привязкой к цели и чеками. Добавить инструмент быстрого донат-кампейна для конкретных задач (спорт, мерч, ивенты).</p><ul><li>Категории трат и публикация транзакций</li><li>Интеграция с ЮMoney / СБП</li><li>Месячные финансовые отчёты на портале</li></ul></div></div><div class="q-block"><div class="q-title">Q3 · ИЮЛ–СЕН</div><div class="q-body"><h3>Сообщество и онбординг новых студентов</h3><p>Welcome-программа для нового набора с гайдом по университету, кампусу и SU. Запуск buddy-программы для студентов-первокурсников.</p><ul><li>Welcome-неделя: 12 событий, печатный гайдбук</li><li>Buddy-программа: 80 пар по интересам</li><li>Первая сессия открытого набора в SU</li></ul></div></div><div class="q-block" style="border-bottom:0"><div class="q-title">Q4 · ОКТ–ДЕК</div><div class="q-body"><h3>Институциональная стабильность</h3><p>Передача знаний, документация процессов, выборы нового состава SU:Core. Цель — чтобы любой человек, который придёт в SU, мог войти в работу за неделю.</p><ul><li>Хендбук SU: процессы, шаблоны, история решений</li><li>Открытые выборы co-leads с публичной презентацией</li><li>Архивирование 2026: ивенты, бюджеты, опросы</li></ul></div></div>`

const DEFAULT_HISTORY_HTML = `<div class="meta-line">SU IU · оригинал — 2019 · последняя редакция: апрель 2026</div><h1 style="font-size:36px;letter-spacing:-0.025em;line-height:1.1;margin-bottom:12px">Шесть лет студенческого самоуправления.</h1><p class="lead" style="font-size:17px">Как студсовет Иннополиса вырос из чата в Telegram-беседе в три департамента с собственной кассой, ивентами, продакшеном и матрицей прав.</p><p class="lede">В сентябре 2019 года восемь человек собрались в комнате 320 и решили, что коммуникации между кампусом и Учёным советом нужен формат поудобнее, чем выходить лично в деканат. Тимур Каримов записал в Notion первые правила — три абзаца, без департаментов, без выборов. На следующей неделе к чату подключились ещё 12 человек.</p><p>За первый год SU занимался в основном переговорами: переноса дедлайнов из-за хакатонов, расписания душевых в общежитии, расширения окон столовой. Бюджета не было — его проводили через университетскую административку. Структуры тоже не было: один человек делал и фотки, и расписание, и говорил с проректором.</p><h2>2021 — раздел на департаменты</h2><p>Команда выросла до 23 человек. Главная боль: один и тот же человек разрывался между организацией Halloween-вечера и переговорами по новому корпусу. Решение пришло в феврале — разделить SU на три департамента с co-leads. Так появились SU:Core (стратегия + университет), SU:Active (события), SU:Media (контент).</p><p>Тогда же ввели первые открытые собрания и голосования за бюджет — раз в семестр выкладывали в общий чат, кто на что хочет потратить.</p><div class="history-photo"><div class="caption">Первое общее собрание после раздела на департаменты · март 2021 · фото SU:Media архив</div></div><h2>2023 — формат, который остался</h2><p>Утвердили роли, описали процессы, ввели Innopoints — внутреннюю систему за участие в активностях. Ввели регулярные открытые митинги раз в две недели и публичный backlog SU:Core.</p><p>С 2024 студсовет начал собирать донаты на конкретные цели — мерч, кофе на собраниях, спортинвентарь — с публичной отчётностью трат. К 2026-му через систему прошло чуть больше миллиона рублей.</p><h2>Ключевые вехи</h2><ul class="timeline"><li><b>сентябрь 2019</b>Восемь основателей. Чат, Notion-страница, никакой иерархии.</li><li><b>октябрь 2020</b>Первый формальный бюджет: ₽ 47,000 на Halloween и зимние посиделки.</li><li><b>февраль 2021</b>Раздел на три департамента, появление co-leads.</li><li><b>сентябрь 2022</b>Запуск Innopoints за участие.</li><li><b>март 2023</b>Открытый backlog SU:Core, публикация повестки и решений.</li><li><b>декабрь 2024</b>Первая прозрачная донат-кампания (₽ 320,000 на спортинвентарь).</li><li><b>апрель 2026</b>Запуск этого портала — единая точка входа во все модули SU.</li></ul><h2>Что осталось важно</h2><p>SU не парламент. Это рабочая команда студентов, которая закрывает три задачи: договариваться с университетом, организовывать жизнь кампуса и держать публичную ленту. Всё остальное — производное.</p>`

const BLANK_MEMBER: Omit<Member, 'id'> = { dep: 'core', tag: '', name: '', role: '', meta: '', bio: '', recent: ['', '', ''] }


export default function MembersPage() {
  const { isAdmin } = useAdmin()
  const [searchParams, setSearchParams] = useSearchParams()
  const depParam = searchParams.get('dep') ?? ''
  const initialSeg = DEP_KEYS.indexOf(depParam) >= 0 ? DEP_KEYS.indexOf(depParam) : 0

  const [tab, setTab] = useState<TabKey>('members')
  const [memberSeg, setMemberSeg] = useState(initialSeg)
  const [editing, setEditing] = useState(false)
  const [editingHistory, setEditingHistory] = useState(false)
  const [selected, setSelected] = useState<Member | null>(null)
  const [search, setSearch] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [toast, setToast] = useState('')
  const [members, setMembers] = useState<Member[]>([])
  const [roadmapHtml, setRoadmapHtml] = useState(DEFAULT_ROADMAP_HTML)
  const [historyHtml, setHistoryHtml] = useState(DEFAULT_HISTORY_HTML)
  const [addingMember, setAddingMember] = useState(false)
  const [newMember, setNewMember] = useState<Omit<Member, 'id'>>(BLANK_MEMBER)
  const roadmapRef = useRef<HTMLDivElement>(null)
  const historyRef = useRef<HTMLElement>(null)

  useEffect(() => {
    api.members.list().then(setMembers).catch(() => {})
    api.content.get('roadmap').then(d => setRoadmapHtml(d.html)).catch(() => {})
    api.content.get('history').then(d => setHistoryHtml(d.html)).catch(() => {})
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
    const html = roadmapRef.current?.innerHTML ?? roadmapHtml
    try {
      await api.content.update('roadmap', html)
      setRoadmapHtml(html)
      showToast('Roadmap сохранён')
    } catch {
      showToast('Ошибка сохранения')
    }
    setEditing(false)
  }

  async function handleHistorySave() {
    const html = historyRef.current?.innerHTML ?? historyHtml
    try {
      await api.content.update('history', html)
      setHistoryHtml(html)
      showToast('История сохранена')
    } catch {
      showToast('Ошибка сохранения')
    }
    setEditingHistory(false)
  }

  async function handleAddMember() {
    const m = { ...newMember, tag: newMember.tag || DEP_TAG_PREFIX[newMember.dep], recent: newMember.recent.filter(Boolean) }
    try {
      const created = await api.members.create(m)
      setMembers(prev => [...prev, created])
    } catch {
      // optimistic: add with temp id
      setMembers(prev => [...prev, { ...m, id: `local-${Date.now()}` }])
    }
    setNewMember(BLANK_MEMBER)
    setAddingMember(false)
    showToast('Участник добавлен')
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
            {t === 'members' && <>Members <span className="text-muted text-mono" style={{ fontSize: 11, marginLeft: 6 }}>{members.length || ''}</span></>}
            {t === 'history' && 'History'}
            {t === 'roadmap' && 'Roadmap 2026'}
          </button>
        ))}
      </div>

      {/* Members pane */}
      {tab === 'members' && (
        <div>
          {isAdmin && (
            <div className="row gap-2" style={{ marginBottom: 16 }}>
              <button className="btn primary" onClick={() => setAddingMember(true)}>
                <Icon id="i-plus" style={{ width: 14, height: 14 }} />Добавить участника
              </button>
            </div>
          )}
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
        <div>
          {isAdmin && (
            <div className="row gap-2" style={{ justifyContent: 'flex-end', marginBottom: 12 }}>
              {editingHistory ? (
                <>
                  <button className="btn ghost" onClick={() => setEditingHistory(false)}>Отмена</button>
                  <button className="btn primary" onClick={handleHistorySave}><Icon id="i-check" style={{ width: 14, height: 14 }} />Сохранить</button>
                </>
              ) : (
                <button className="btn secondary" onClick={() => setEditingHistory(true)}><Icon id="i-edit" style={{ width: 14, height: 14 }} />Редактировать</button>
              )}
            </div>
          )}
          <article
            ref={historyRef}
            className="history"
            contentEditable={editingHistory}
            suppressContentEditableWarning
            dangerouslySetInnerHTML={{ __html: historyHtml }}
            style={editingHistory ? { outline: '2px solid var(--accent)', borderRadius: 8, padding: 16 } : {}}
          />
        </div>
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

            <div
              ref={roadmapRef}
              className="rm-edit"
              contentEditable={editing}
              suppressContentEditableWarning
              dangerouslySetInnerHTML={{ __html: roadmapHtml }}
            />

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

      {/* Add member modal */}
      {addingMember && (
        <div className="modal-overlay" onClick={() => setAddingMember(false)}>
          <div className="member-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <button className="modal-close" onClick={() => setAddingMember(false)}>
              <Icon id="i-x" style={{ width: 14, height: 14 }} />
            </button>
            <div className="member-modal-body" style={{ paddingTop: 24 }}>
              <h3 style={{ marginBottom: 20 }}>Новый участник</h3>
              <div className="col gap-3">
                <div className="field">
                  <label>Департамент</label>
                  <select className="input" value={newMember.dep} onChange={e => setNewMember(m => ({ ...m, dep: e.target.value as Member['dep'], tag: DEP_TAG_PREFIX[e.target.value as Member['dep']] }))}>
                    <option value="core">SU:Core</option>
                    <option value="active">SU:Active</option>
                    <option value="media">SU:Media</option>
                  </select>
                </div>
                <div className="field">
                  <label>Имя</label>
                  <input className="input" placeholder="Иван Иванов" value={newMember.name} onChange={e => setNewMember(m => ({ ...m, name: e.target.value }))} />
                </div>
                <div className="field">
                  <label>Роль (напр. CO-LEAD · B21-AI)</label>
                  <input className="input" placeholder="ROLE · B22-DS" value={newMember.role} onChange={e => setNewMember(m => ({ ...m, role: e.target.value }))} />
                </div>
                <div className="field">
                  <label>Тег (оставьте пустым для авто)</label>
                  <input className="input" placeholder={DEP_TAG_PREFIX[newMember.dep]} value={newMember.tag} onChange={e => setNewMember(m => ({ ...m, tag: e.target.value }))} />
                </div>
                <div className="field">
                  <label>Meta (напр. 2 года в SU)</label>
                  <input className="input" placeholder="1 год в SU" value={newMember.meta} onChange={e => setNewMember(m => ({ ...m, meta: e.target.value }))} />
                </div>
                <div className="field">
                  <label>Bio</label>
                  <textarea className="textarea" rows={2} placeholder="Чем занимается…" value={newMember.bio} onChange={e => setNewMember(m => ({ ...m, bio: e.target.value }))} />
                </div>
                <div className="field">
                  <label>Последние активности (до 3)</label>
                  {[0, 1, 2].map(i => (
                    <input key={i} className="input" style={{ marginBottom: 6 }} placeholder={`Активность ${i + 1}…`} value={newMember.recent[i] ?? ''} onChange={e => setNewMember(m => { const r = [...m.recent]; r[i] = e.target.value; return { ...m, recent: r } })} />
                  ))}
                </div>
                <div className="row gap-2" style={{ justifyContent: 'flex-end', marginTop: 8 }}>
                  <button className="btn ghost" onClick={() => setAddingMember(false)}>Отмена</button>
                  <button className="btn primary" disabled={!newMember.name.trim()} onClick={handleAddMember}>Добавить</button>
                </div>
              </div>
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
