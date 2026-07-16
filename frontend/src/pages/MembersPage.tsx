import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { api, photoUrl, type Member as ApiMember } from '../lib/api'
import { useAdmin } from '../lib/AdminContext'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { ErrorBanner } from '../components/ErrorBanner'
import { EmptyState } from '../components/EmptyState'
import { sanitizeHtml } from '../lib/sanitize'
import { useModalA11y, MODAL_A11Y_PROPS } from '../hooks/useModalA11y'

type TabKey = 'members' | 'history' | 'roadmap'

const DEP_KEYS = ['', 'core', 'active', 'media', 'support']

type Member = ApiMember

const PHOTO_BG: Record<Member['dep'], string> = {
  core:    'linear-gradient(135deg, #d1efd8, #88c595)',
  active:  'linear-gradient(135deg, #c1d6f8, #6b89b3)',
  media:   'linear-gradient(135deg, #f6c1da, #d65fa3)',
  support: 'linear-gradient(135deg, #fde8c8, #d9a441)',
}

const DEFAULT_ROADMAP_HTML = `<p style="font-size:17px;color:var(--muted);margin-bottom:24px">Цели студсовета на 2026 учебный год по четырём квартальным блокам.</p><div class="q-block"><div class="q-title">Q1 · ЯНВ–МАР</div><div class="q-body"><h3>Запуск SU Portal v1</h3><p>Единая точка входа для студсовета: новости, ивенты, опросы, донаты, внутренние модули команды. Заменить разрозненные Google-документы и табличные опросы.</p><ul><li>5 публичных модулей и 3 внутренних</li><li>Перевод опросов с Google Forms на собственный конструктор</li><li>Адаптив для мобильных устройств</li></ul></div></div><div class="q-block"><div class="q-title">Q2 · АПР–ИЮН</div><div class="q-body"><h3>Прозрачные финансы и расширение донат-системы</h3><p>Все траты студсовета — публично, с привязкой к цели и чеками. Добавить инструмент быстрого донат-кампейна для конкретных задач (спорт, мерч, ивенты).</p><ul><li>Категории трат и публикация транзакций</li><li>Интеграция с ЮMoney / СБП</li><li>Месячные финансовые отчёты на портале</li></ul></div></div><div class="q-block"><div class="q-title">Q3 · ИЮЛ–СЕН</div><div class="q-body"><h3>Сообщество и онбординг новых студентов</h3><p>Welcome-программа для нового набора с гайдом по университету, кампусу и SU. Запуск buddy-программы для студентов-первокурсников.</p><ul><li>Welcome-неделя: 12 событий, печатный гайдбук</li><li>Buddy-программа: 80 пар по интересам</li><li>Первая сессия открытого набора в SU</li></ul></div></div><div class="q-block" style="border-bottom:0"><div class="q-title">Q4 · ОКТ–ДЕК</div><div class="q-body"><h3>Институциональная стабильность</h3><p>Передача знаний, документация процессов, выборы нового состава SU:Core. Цель — чтобы любой человек, который придёт в SU, мог войти в работу за неделю.</p><ul><li>Хендбук SU: процессы, шаблоны, история решений</li><li>Открытые выборы co-leads с публичной презентацией</li><li>Архивирование 2026: ивенты, бюджеты, опросы</li></ul></div></div>`

const DEFAULT_HISTORY_HTML = `<div class="meta-line">SU IU · оригинал — 2019 · последняя редакция: апрель 2026</div><h1 style="font-size:36px;letter-spacing:-0.025em;line-height:1.1;margin-bottom:12px">Шесть лет студенческого самоуправления.</h1><p class="lead" style="font-size:17px">Как студсовет Иннополиса вырос из чата в Telegram-беседе в три департамента с собственной кассой, ивентами, продакшеном и матрицей прав.</p><p class="lede">В сентябре 2019 года восемь человек собрались в комнате 320 и решили, что коммуникации между кампусом и Учёным советом нужен формат поудобнее, чем выходить лично в деканат. Тимур Каримов записал в Notion первые правила — три абзаца, без департаментов, без выборов. На следующей неделе к чату подключились ещё 12 человек.</p><p>За первый год SU занимался в основном переговорами: переноса дедлайнов из-за хакатонов, расписания душевых в общежитии, расширения окон столовой. Бюджета не было — его проводили через университетскую административку. Структуры тоже не было: один человек делал и фотки, и расписание, и говорил с проректором.</p><h2>2021 — раздел на департаменты</h2><p>Команда выросла до 23 человек. Главная боль: один и тот же человек разрывался между организацией Halloween-вечера и переговорами по новому корпусу. Решение пришло в феврале — разделить SU на три департамента с co-leads. Так появились SU:Core (стратегия + университет), SU:Active (события), SU:Media (контент).</p><p>Тогда же ввели первые открытые собрания и голосования за бюджет — раз в семестр выкладывали в общий чат, кто на что хочет потратить.</p><div class="history-photo"><div class="caption">Первое общее собрание после раздела на департаменты · март 2021 · фото SU:Media архив</div></div><h2>2023 — формат, который остался</h2><p>Утвердили роли, описали процессы, ввели Innopoints — внутреннюю систему за участие в активностях. Ввели регулярные открытые митинги раз в две недели и публичный backlog SU:Core.</p><p>С 2024 студсовет начал собирать донаты на конкретные цели — мерч, кофе на собраниях, спортинвентарь — с публичной отчётностью трат. К 2026-му через систему прошло чуть больше миллиона рублей.</p><h2>Ключевые вехи</h2><ul class="timeline"><li><b>сентябрь 2019</b>Восемь основателей. Чат, Notion-страница, никакой иерархии.</li><li><b>октябрь 2020</b>Первый формальный бюджет: ₽ 47,000 на Halloween и зимние посиделки.</li><li><b>февраль 2021</b>Раздел на три департамента, появление co-leads.</li><li><b>сентябрь 2022</b>Запуск Innopoints за участие.</li><li><b>март 2023</b>Открытый backlog SU:Core, публикация повестки и решений.</li><li><b>декабрь 2024</b>Первая прозрачная донат-кампания (₽ 320,000 на спортинвентарь).</li><li><b>апрель 2026</b>Запуск этого портала — единая точка входа во все модули SU.</li></ul><h2>Что осталось важно</h2><p>SU не парламент. Это рабочая команда студентов, которая закрывает три задачи: договариваться с университетом, организовывать жизнь кампуса и держать публичную ленту. Всё остальное — производное.</p>`

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
  const closeSelected = () => setSelected(null)
  const dialogRef = useModalA11y(Boolean(selected), closeSelected)
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState('')
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const retry = () => { setError(null); setLoading(true); setReloadKey(k => k + 1) }
  const [roadmapHtml, setRoadmapHtml] = useState(DEFAULT_ROADMAP_HTML)
  const [historyHtml, setHistoryHtml] = useState(DEFAULT_HISTORY_HTML)
  const [roadmapMeta, setRoadmapMeta] = useState<{ updatedAt?: string; updatedBy?: string }>({})
  const roadmapRef = useRef<HTMLDivElement>(null)
  const historyRef = useRef<HTMLElement>(null)

  // Refetch from the API whenever the ?dep= filter changes — the server returns
  // only matching members (US-05 AC2) rather than filtering client-side.
  // setState lives in async callbacks (not the effect body) to satisfy
  // react-hooks/set-state-in-effect; `cancelled` guards against a stale dep race.
  useEffect(() => {
    let cancelled = false
    const apiDep = depParam && DEP_KEYS.includes(depParam) ? (depParam as Member['dep']) : undefined
    api.members.list(apiDep)
      .then(data => { if (!cancelled) { setMembers(data); setError(null) } })
      .catch(e => { if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load members') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [depParam, reloadKey])

  useEffect(() => {
    api.content.get('roadmap').then(d => {
      // content_blocks rows are seeded empty with a real updated_at/updated_by
      // default, so those columns alone can't distinguish "never edited" from
      // "edited" — only trust them once there's actual saved html.
      if (d.html) {
        setRoadmapHtml(d.html)
        setRoadmapMeta({ updatedAt: d.updatedAt, updatedBy: d.updatedBy })
      }
    }).catch(() => {})
    api.content.get('history').then(d => { if (d.html) setHistoryHtml(d.html) }).catch(() => {})
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
    const html = sanitizeHtml(roadmapRef.current?.innerHTML ?? roadmapHtml)
    try {
      const saved = await api.content.update('roadmap', html)
      setRoadmapHtml(html)
      setRoadmapMeta({ updatedAt: saved.updatedAt, updatedBy: saved.updatedBy })
      showToast('Roadmap сохранён')
    } catch {
      showToast('Ошибка сохранения')
    }
    setEditing(false)
  }

  async function handleHistorySave() {
    const html = sanitizeHtml(historyRef.current?.innerHTML ?? historyHtml)
    try {
      await api.content.update('history', html)
      setHistoryHtml(html)
      showToast('История сохранена')
    } catch {
      showToast('Ошибка сохранения')
    }
    setEditingHistory(false)
  }

  const filteredMembers = (memberSeg === 0 ? members : members.filter(p => p.dep === DEP_KEYS[memberSeg]))
    .filter(p => p.is_active !== false)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.role.toLowerCase().includes(search.toLowerCase()))
  const visibleMembers = filteredMembers

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

      {tab === 'members' && (
        <div>
          <div className="members-filters-bar">
            <div className="seg">
              {['Все', 'SU:Core', 'SU:Active', 'SU:Media', 'SU:Support'].map((l, i) => (
                <button key={i} className={memberSeg === i ? 'active' : ''} onClick={() => handleSeg(i)}>{l}</button>
              ))}
            </div>
            <div className="input-group" style={{ width: 280, marginLeft: 'auto' }}>
              <Icon id="i-search" className="ic" />
              <input placeholder="Найти по имени, направлению…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="btn secondary" onClick={() => showToast('Расширенные фильтры — в разработке')}><Icon id="i-filter" style={{ width: 14, height: 14 }} />Фильтры</button>
          </div>

          {error ? (
            <ErrorBanner message="Не удалось загрузить участников." onRetry={retry} stack={error} />
          ) : loading ? (
            <div className="members-grid"><LoadingSkeleton type="member" count={8} /></div>
          ) : members.length === 0 ? (
            <EmptyState title="Участников пока нет" description="Состав студсовета скоро появится здесь." />
          ) : (
            <>
              <div className="members-grid">
                {visibleMembers.map((p, i) => (
                  <article key={i} className={`person dep-${p.dep}`} style={{ cursor: 'pointer' }} onClick={() => setSelected(p)}>
                    <div className="photo">
                      <span className="dep-tag">{p.tag}</span>
                      {p.photo_url
                        ? <img src={photoUrl(p.photo_url, '300x300')} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div className="silhouette"></div>}
                    </div>
                    <div className="body">
                      <div className="name">{p.name}</div>
                      <div className="role">{p.role}</div>
                      <div className="meta">{p.meta}</div>
                    </div>
                  </article>
                ))}
                {visibleMembers.length === 0 && (
                  <p className="text-muted" style={{ gridColumn: '1/-1', padding: '24px 0' }}>Участники не найдены</p>
                )}
              </div>

            </>
          )}
        </div>
      )}

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
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(historyHtml) }}
            style={editingHistory ? { outline: '2px solid var(--accent)', borderRadius: 8, padding: 16 } : {}}
          />
        </div>
      )}

      {tab === 'roadmap' && (
        <div>
          <div className="row sb mb-4">
            <div>
              <span className="eyebrow">Roadmap 2026</span>
              <h2 style={{ fontSize: 22, marginTop: 4 }}>Что мы хотим закрыть в этом году</h2>
            </div>
            <div className="row gap-2 read-actions">
              <span className="tag green">
                <span className="dot"></span>Опубликовано
                {roadmapMeta.updatedAt && ` · ${new Date(roadmapMeta.updatedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}`}
              </span>
            </div>
          </div>

          <section className={`roadmap-shell${editing ? ' editing' : ''}`}>
            {/* Formatting toolbar is edit-only — only admins enter edit mode. */}
            {editing && (
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
                <div className="meta"><span className="text-mono">EDIT MODE</span></div>
              </div>
            )}

            <div
              ref={roadmapRef}
              className="rm-edit"
              contentEditable={editing}
              suppressContentEditableWarning
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(roadmapHtml) }}
            />

            {editing && (
              <div className="rm-foot">
                <button className="btn ghost" onClick={() => setEditing(false)}>Отмена</button>
                <button className="btn primary" onClick={handleRoadmapSave}><Icon id="i-check" style={{ width: 14, height: 14 }} />Сохранить изменения</button>
              </div>
            )}
          </section>

          {isAdmin && (
            <div className="row sb mt-4">
              <span className="text-muted" style={{ fontSize: 12 }}>
                {roadmapMeta.updatedAt &&
                  `Последнее изменение: ${roadmapMeta.updatedBy ?? 'admin'} · ${new Date(roadmapMeta.updatedAt).toLocaleString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`}
              </span>
              <div className="row gap-2 read-actions">
                {!editing && <button className="btn primary" onClick={() => setEditing(true)}><Icon id="i-edit" style={{ width: 14, height: 14 }} />Редактировать</button>}
              </div>
            </div>
          )}
        </div>
      )}

      {selected && (
        <div className="modal-overlay" onClick={closeSelected}>
          <div
            className="member-modal"
            onClick={e => e.stopPropagation()}
            ref={dialogRef}
            {...MODAL_A11Y_PROPS}
            aria-label={selected.name}
          >
            <button className="modal-close" onClick={closeSelected} aria-label="Закрыть">
              <Icon id="i-x" style={{ width: 14, height: 14 }} />
            </button>
            <div className="member-modal-photo" style={{ background: PHOTO_BG[selected.dep] }}>
              <span className="dep-tag">{selected.tag}</span>
              {selected.photo_url
                ? <img src={photoUrl(selected.photo_url, '480x480')} alt={selected.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                : <div className="silhouette-lg"></div>}
            </div>
            <div className="member-modal-body">
              <div className="mm-name" style={{ marginTop: 16 }}>{selected.name}</div>
              <div className="mm-role">{selected.role}</div>
              <p className="mm-bio">{selected.bio}</p>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8, color: selected.is_active !== false ? 'var(--accent)' : 'var(--muted)' }}>
                {selected.is_active !== false ? 'Активный участник' : 'Неактивный участник'}
              </div>
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