import { useState } from 'react'
import { Icon } from '../components/Icon'

type ColKey = 'backlog' | 'next' | 'doing' | 'review' | 'done'
type Priority = 'p-low' | 'p-mid' | 'p-high'

interface Tag { label: string; cls: string; style?: React.CSSProperties; dot?: boolean }
interface MetaItem { icon: string; text: string; urgent?: boolean; soon?: boolean }
interface Assignee { initials: string; bg: string; offset?: boolean }
interface CardData {
  id: string; col: ColKey; blocker?: boolean
  tags: Tag[]; title: string; desc?: string
  attachment?: { icon: string; bold: string; rest: string }
  progressPct?: number; progressLabel?: string
  meta?: MetaItem[]
  priority: Priority; pLabel: string; assignees: Assignee[]
}

// Left-border urgency colors (from legacy theme)
const PRIORITY_BORDER: Record<Priority, string> = {
  'p-high': '#EF4444',
  'p-mid':  '#F97316',
  'p-low':  '#10B981',
}
const PRIORITY_LABEL: Record<Priority, string> = {
  'p-high': 'Urgent',
  'p-mid':  'High',
  'p-low':  'Low',
}

const CARDS: CardData[] = [
  // --- Backlog ---
  { id: 'kb-1', col: 'backlog',
    tags: [{ label: 'SU:Active', cls: 'tag blue' }, { label: 'research', cls: 'tag outline' }],
    title: 'Опросить деканаты по слотам для Open Day 2026',
    desc: 'Собрать у трёх деканатов окна для родительских встреч и лабораторных туров. Сравнить с расписанием экзаменов.',
    meta: [{ icon: 'i-clock', text: '22 июня' }, { icon: 'i-text', text: '4' }],
    priority: 'p-low', pLabel: 'P2',
    assignees: [{ initials: 'ЕВ', bg: 'linear-gradient(135deg,#c7dfa9,#74a55c)' }] },
  { id: 'kb-2', col: 'backlog',
    tags: [{ label: 'SU:Core', cls: 'tag purple' }, { label: 'policy', cls: 'tag outline' }],
    title: 'Положение об общежитии — внести правки от ректората',
    desc: 'Прислали 6 комментариев к §3 и §7. Пройтись построчно, обсудить на ближайшем созвоне.',
    meta: [{ icon: 'i-clock', text: '28 июня' }],
    priority: 'p-mid', pLabel: 'P1',
    assignees: [{ initials: 'МР', bg: 'linear-gradient(135deg,#a3e0ad,#32b247)' }] },
  { id: 'kb-3', col: 'backlog',
    tags: [{ label: 'SU:Media', cls: 'tag', style: { background: '#FCE7F3', color: '#9D174D' } }],
    title: 'Закупить SD-карты 256GB для съёмочных дней лета',
    desc: 'Запросить три варианта у Citilink и DNS, сравнить по скорости записи. Бюджет ~ ₽ 14k.',
    meta: [{ icon: 'i-coin', text: '₽ 14 000' }],
    priority: 'p-low', pLabel: 'P3',
    assignees: [{ initials: 'АС', bg: 'linear-gradient(135deg,#a8c0e0,#3868b8)' }] },
  { id: 'kb-4', col: 'backlog',
    tags: [{ label: 'SU:Active', cls: 'tag blue' }, { label: 'scheduling', cls: 'tag outline' }],
    title: 'Бронь спортзала на турнир по бадминтону',
    desc: 'Договориться с кампусной службой о слотах вт/чт 19:00–21:00 на июль.',
    meta: [{ icon: 'i-clock', text: '4 июля' }, { icon: 'i-text', text: '2' }],
    priority: 'p-low', pLabel: 'P2',
    assignees: [{ initials: 'КЛ', bg: 'linear-gradient(135deg,#b9c8e0,#5481c5)' }] },
  { id: 'kb-5', col: 'backlog',
    tags: [{ label: 'infra', cls: 'tag outline' }],
    title: 'Перейти с Notion на SU portal для протоколов',
    desc: 'Сравнить экспорт MD. Решить, нужен ли версионник внутри портала.',
    meta: [{ icon: 'i-text', text: '1' }],
    priority: 'p-low', pLabel: 'P3',
    assignees: [{ initials: 'ТК', bg: 'linear-gradient(135deg,#a8dba8,#3da152)' }] },

  // --- Up next ---
  { id: 'kb-6', col: 'next',
    tags: [{ label: 'Open Day', cls: 'tag green' }, { label: 'SU:Media', cls: 'tag', style: { background: '#FCE7F3', color: '#9D174D' } }],
    title: 'Снять промо-видео департамента SU:Active',
    desc: '5 коротких интервью + b-roll с ивентов весны. Драфт сценария готов — нужно прогнать с co-lead.',
    attachment: { icon: 'i-image', bold: 'script-v3.md', rest: ' · обновлено вчера' },
    meta: [{ icon: 'i-clock', text: '14 июня', soon: true }, { icon: 'i-text', text: '7' }],
    priority: 'p-mid', pLabel: 'P1',
    assignees: [{ initials: 'АС', bg: 'linear-gradient(135deg,#a8c0e0,#3868b8)' }, { initials: 'ИС', bg: 'linear-gradient(135deg,#c8d3e6,#7290c9)', offset: true }] },
  { id: 'kb-7', col: 'next',
    tags: [{ label: 'Open Day', cls: 'tag green' }, { label: 'printables', cls: 'tag outline' }],
    title: 'Раздаточные брошюры — макет в типографию',
    desc: '2000 шт., 4 разворота, мелованная 130 г/м². Цена и срок согласованы.',
    meta: [{ icon: 'i-coin', text: '₽ 38 200' }, { icon: 'i-clock', text: '11 июня' }],
    priority: 'p-mid', pLabel: 'P1',
    assignees: [{ initials: 'ДА', bg: 'linear-gradient(135deg,#b3d5a8,#5fa44f)' }] },
  { id: 'kb-8', col: 'next',
    tags: [{ label: 'SU:Core', cls: 'tag purple' }, { label: 'people', cls: 'tag outline' }],
    title: 'Найти 12 студентов-волонтёров на день регистрации',
    desc: '9:30–14:00, нужны бейджи и инструктаж за день до. Открыть пост в telegram-канале SU.',
    meta: [{ icon: 'i-users', text: '4 / 12' }],
    priority: 'p-mid', pLabel: 'P1',
    assignees: [{ initials: 'ЕВ', bg: 'linear-gradient(135deg,#c7dfa9,#74a55c)' }] },
  { id: 'kb-9', col: 'next',
    tags: [{ label: 'SU:Active', cls: 'tag blue' }],
    title: 'Лекторий «AI & ML in Industry» — собрать спикеров',
    desc: '2 спикера готовы, нужно ещё 2. Запросить контакты у Школы IT.',
    meta: [{ icon: 'i-clock', text: '30 июня' }],
    priority: 'p-low', pLabel: 'P2',
    assignees: [{ initials: 'КЛ', bg: 'linear-gradient(135deg,#b9c8e0,#5481c5)' }] },

  // --- In progress ---
  { id: 'kb-10', col: 'doing', blocker: true,
    tags: [{ label: 'blocker', cls: 'tag red', dot: true }, { label: 'Open Day', cls: 'tag green' }],
    title: 'Согласовать программу Open Day с проректором',
    desc: 'Сидим у Алексея Михайловича второй день — ждём правок по таймингам.',
    meta: [{ icon: 'i-clock', text: 'сегодня', urgent: true }, { icon: 'i-text', text: '12' }],
    priority: 'p-high', pLabel: 'P0',
    assignees: [{ initials: 'МР', bg: 'linear-gradient(135deg,#a3e0ad,#32b247)' }] },
  { id: 'kb-11', col: 'doing',
    tags: [{ label: 'SU:Media', cls: 'tag', style: { background: '#FCE7F3', color: '#9D174D' } }, { label: 'design', cls: 'tag outline' }],
    title: 'Сделать визуальный гайд для Open Day',
    desc: 'Постер, баннеры для соц-сетей, шаблон сторис, обложка для канала. Готовность ≈ 70%.',
    progressPct: 70, progressLabel: '7 / 10',
    meta: [{ icon: 'i-clock', text: '13 июня', soon: true }],
    priority: 'p-mid', pLabel: 'P1',
    assignees: [{ initials: 'АС', bg: 'linear-gradient(135deg,#a8c0e0,#3868b8)' }] },
  { id: 'kb-12', col: 'doing',
    tags: [{ label: 'SU:Core', cls: 'tag purple' }, { label: 'finance', cls: 'tag outline' }],
    title: 'Закрыть отчётность за май, оформить акты',
    desc: '3 акта собраны, осталось от типографии и кейтеринга. Бухгалтерия ждёт до 12 июня.',
    meta: [{ icon: 'i-clock', text: '12 июня', soon: true }],
    priority: 'p-mid', pLabel: 'P1',
    assignees: [{ initials: 'ДА', bg: 'linear-gradient(135deg,#b3d5a8,#5fa44f)' }] },
  { id: 'kb-13', col: 'doing',
    tags: [{ label: 'SU:Active', cls: 'tag blue' }, { label: 'Open Day', cls: 'tag green' }],
    title: 'Согласовать кейтеринг на 250 человек',
    desc: 'Два варианта: «Своя кофейня» и «InnoCafe» — отправили запросы, ждём прайс.',
    meta: [{ icon: 'i-coin', text: '≈ ₽ 62k' }, { icon: 'i-clock', text: '15 июня' }],
    priority: 'p-mid', pLabel: 'P1',
    assignees: [{ initials: 'ИС', bg: 'linear-gradient(135deg,#c8d3e6,#7290c9)' }] },
  { id: 'kb-14', col: 'doing', blocker: true,
    tags: [{ label: 'blocker', cls: 'tag red', dot: true }, { label: 'portal', cls: 'tag outline' }],
    title: 'Починить экспорт XLSX из Questionnaires',
    desc: 'Не выгружает «Multiple choice» в одну колонку — режет на N столбцов. Завести issue в репо.',
    meta: [{ icon: 'i-clock', text: 'завтра', urgent: true }, { icon: 'i-text', text: '4' }],
    priority: 'p-high', pLabel: 'P0',
    assignees: [{ initials: 'ТК', bg: 'linear-gradient(135deg,#a8dba8,#3da152)' }] },
  { id: 'kb-15', col: 'doing',
    tags: [{ label: 'Open Day', cls: 'tag green' }, { label: 'logistics', cls: 'tag outline' }],
    title: 'Согласовать пропускной режим с охраной',
    desc: 'Списки гостей — за 48 часов. Уточнить, нужен ли отдельный паспорт-контроль для родителей.',
    meta: [{ icon: 'i-clock', text: '16 июня' }],
    priority: 'p-mid', pLabel: 'P1',
    assignees: [{ initials: 'ЕВ', bg: 'linear-gradient(135deg,#c7dfa9,#74a55c)' }] },

  // --- Review ---
  { id: 'kb-16', col: 'review',
    tags: [{ label: 'SU:Core', cls: 'tag purple' }, { label: 'portal', cls: 'tag outline' }],
    title: 'Проверить контент страницы Donations',
    desc: 'Все суммы, цели, транзакции — сверить с экселем казначея. Опечатки в названиях статей.',
    attachment: { icon: 'i-link', bold: 'donations.html', rest: ' · v2' },
    priority: 'p-mid', pLabel: 'P1',
    assignees: [{ initials: 'МР', bg: 'linear-gradient(135deg,#a3e0ad,#32b247)' }] },
  { id: 'kb-17', col: 'review',
    tags: [{ label: 'SU:Active', cls: 'tag blue' }, { label: 'event', cls: 'tag outline' }],
    title: 'Финализировать список треков на хакатоне Inno Hack',
    desc: '5 треков предложили, нужно выбрать 3. Согласовать с менторами и партнёром (СберТех).',
    meta: [{ icon: 'i-text', text: '9' }, { icon: 'i-eye', text: '5' }],
    priority: 'p-mid', pLabel: 'P1',
    assignees: [{ initials: 'КЛ', bg: 'linear-gradient(135deg,#b9c8e0,#5481c5)' }, { initials: 'МР', bg: 'linear-gradient(135deg,#a3e0ad,#32b247)', offset: true }] },
  { id: 'kb-18', col: 'review',
    tags: [{ label: 'SU:Media', cls: 'tag', style: { background: '#FCE7F3', color: '#9D174D' } }],
    title: 'Корректура июньского newsletter',
    desc: 'Редактор прислала второй раунд правок — отсмотреть и собрать финал.',
    meta: [{ icon: 'i-text', text: '3' }],
    priority: 'p-low', pLabel: 'P2',
    assignees: [{ initials: 'ИС', bg: 'linear-gradient(135deg,#c8d3e6,#7290c9)' }] },

  // --- Done ---
  { id: 'kb-19', col: 'done',
    tags: [{ label: 'shipped', cls: 'tag green', dot: true }],
    title: 'Запустить лендинг Open Day 2026',
    meta: [{ icon: 'i-check', text: '6 июня' }],
    priority: 'p-mid', pLabel: 'P1',
    assignees: [{ initials: 'АС', bg: 'linear-gradient(135deg,#a8c0e0,#3868b8)' }] },
  { id: 'kb-20', col: 'done',
    tags: [{ label: 'shipped', cls: 'tag green', dot: true }, { label: 'portal', cls: 'tag outline' }],
    title: 'Опубликовать опрос «Качество кафедральной столовой»',
    meta: [{ icon: 'i-users', text: '248 ответов' }],
    priority: 'p-low', pLabel: 'P2',
    assignees: [{ initials: 'ДА', bg: 'linear-gradient(135deg,#b3d5a8,#5fa44f)' }] },
  { id: 'kb-21', col: 'done',
    tags: [{ label: 'shipped', cls: 'tag green', dot: true }],
    title: 'Закрыть цель «Канцелярия и принтер» — собрано 102%',
    meta: [{ icon: 'i-coin', text: '₽ 41 200' }],
    priority: 'p-low', pLabel: 'P2',
    assignees: [{ initials: 'МР', bg: 'linear-gradient(135deg,#a3e0ad,#32b247)' }] },
  { id: 'kb-22', col: 'done',
    tags: [{ label: 'shipped', cls: 'tag green', dot: true }, { label: 'comms', cls: 'tag outline' }],
    title: 'Майский пост-отчёт в telegram-канале',
    meta: [{ icon: 'i-eye', text: '1.9k' }],
    priority: 'p-low', pLabel: 'P3',
    assignees: [{ initials: 'ИС', bg: 'linear-gradient(135deg,#c8d3e6,#7290c9)' }] },
  { id: 'kb-23', col: 'done',
    tags: [{ label: 'shipped', cls: 'tag green', dot: true }],
    title: 'Положение о SU:Media — финальная редакция',
    priority: 'p-mid', pLabel: 'P1',
    assignees: [{ initials: 'ЕВ', bg: 'linear-gradient(135deg,#c7dfa9,#74a55c)' }] },
  { id: 'kb-24', col: 'done',
    tags: [{ label: 'shipped', cls: 'tag green', dot: true }],
    title: 'Брендинг для турнира по настолке',
    meta: [{ icon: 'i-check', text: '3 июня' }],
    priority: 'p-low', pLabel: 'P3',
    assignees: [{ initials: 'АС', bg: 'linear-gradient(135deg,#a8c0e0,#3868b8)' }] },
]

// Column metadata with distinct colors (from legacy color scheme)
const COLS: { key: ColKey; cls: string; label: string; color: string; eyeBtn?: boolean }[] = [
  { key: 'backlog', cls: 'c-backlog', label: 'Backlog',         color: '#9CA3AF' },
  { key: 'next',    cls: 'c-next',    label: 'Up next',         color: '#60A5FA' },
  { key: 'doing',   cls: 'c-doing',   label: 'In progress',     color: '#F59E0B' },
  { key: 'review',  cls: 'c-review',  label: 'Review',          color: '#A78BFA' },
  { key: 'done',    cls: 'c-done',    label: 'Done · sprint 14', color: '#22C55E', eyeBtn: true },
]

const FACES = [
  { i: 'МР', bg: 'linear-gradient(135deg,#a3e0ad,#32b247)' },
  { i: 'ДА', bg: 'linear-gradient(135deg,#b3d5a8,#5fa44f)' },
  { i: 'ЕВ', bg: 'linear-gradient(135deg,#c7dfa9,#74a55c)' },
  { i: 'ТК', bg: 'linear-gradient(135deg,#a8dba8,#3da152)' },
  { i: 'АС', bg: 'linear-gradient(135deg,#a8c0e0,#3868b8)' },
]

// ── Card Detail Panel ───────────────────────────────────────────────────────

interface CardDetailPanelProps { card: CardData; onClose: () => void }

function CardDetailPanel({ card, onClose }: CardDetailPanelProps) {
  const borderColor = card.blocker ? '#EF4444' : PRIORITY_BORDER[card.priority]
  return (
    <>
      <div className="kb-detail-backdrop" onClick={onClose} />
      <div className="kb-detail-panel">
        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 4, flexShrink: 0, borderRadius: 4, background: borderColor, alignSelf: 'stretch', minHeight: 52 }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
              {card.tags.map((t, i) => (
                <span key={i} className={t.cls} style={t.style}>
                  {t.dot && <span className="dot" />}{t.label}
                </span>
              ))}
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.4, color: 'var(--text)' }}>{card.title}</h3>
          </div>
          <button className="icon-btn" onClick={onClose} style={{ flexShrink: 0, marginTop: -2 }}>
            <Icon id="i-x" />
          </button>
        </div>

        {/* Body */}
        <div className="kb-detail-body">
          {/* Priority + assignees row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className={`kbc-priority ${card.priority}`}>
              <span className="bar" /><span className="bar" /><span className="bar" />
              {card.pLabel} · {PRIORITY_LABEL[card.priority]}
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
              {card.assignees.map((a, i) => (
                <div key={i} className="avatar" style={{ background: a.bg, ...(a.offset ? { marginLeft: -8, border: '2px solid var(--surface)' } : {}) }}>
                  {a.initials}
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          {card.desc && (
            <div>
              <div className="kb-detail-section-label">Описание</div>
              <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.65 }}>{card.desc}</p>
            </div>
          )}

          {/* Attachment */}
          {card.attachment && (
            <div>
              <div className="kb-detail-section-label">Файл</div>
              <div className="kbc-attachment">
                <Icon id={card.attachment.icon} />
                <span><b>{card.attachment.bold}</b>{card.attachment.rest}</span>
              </div>
            </div>
          )}

          {/* Progress */}
          {card.progressPct !== undefined && (
            <div>
              <div className="kb-detail-section-label">Прогресс — {card.progressLabel}</div>
              <div className="progress" style={{ height: 8 }}>
                <div className="bar" style={{ width: `${card.progressPct}%` }} />
              </div>
            </div>
          )}

          {/* Meta */}
          {card.meta && card.meta.length > 0 && (
            <div>
              <div className="kb-detail-section-label">Детали</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {card.meta.map((m, i) => (
                  <span key={i} className={`mi${m.urgent ? ' urgent' : m.soon ? ' soon' : ''}`} style={{ fontSize: 13 }}>
                    <Icon id={m.icon} /><span>{m.text}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="kb-detail-footer">
          <button className="btn secondary" style={{ flex: 1 }} onClick={onClose}>
            <Icon id="i-x" style={{ width: 14, height: 14 }} />Закрыть
          </button>
          <button className="btn primary" style={{ flex: 1 }}>
            <Icon id="i-check" style={{ width: 14, height: 14 }} />Отметить готово
          </button>
        </div>
      </div>
    </>
  )
}

// ── Kanban Card ─────────────────────────────────────────────────────────────

interface KbCardProps {
  card: CardData
  isDone: boolean
  isDragging: boolean
  onDragStart: (e: React.DragEvent) => void
  onDragEnd: () => void
  onSelect: (card: CardData) => void
}

function KbCard({ card, isDone, isDragging, onDragStart, onDragEnd, onSelect }: KbCardProps) {
  const [hovered, setHovered] = useState(false)
  const borderColor = card.blocker ? '#EF4444' : PRIORITY_BORDER[card.priority]

  return (
    <article
      className="kbc kbc-anim"
      draggable
      onDragStart={e => { e.dataTransfer.setData('cardId', card.id); e.dataTransfer.effectAllowed = 'move'; onDragStart(e) }}
      onDragEnd={onDragEnd}
      onClick={() => onSelect(card)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderLeft: `4px solid ${borderColor}`,
        opacity: isDragging ? 0.35 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        transform: hovered && !isDragging ? 'translateY(-2px)' : 'none',
        boxShadow: hovered && !isDragging ? '0 4px 16px rgba(0,0,0,0.09)' : undefined,
        transition: 'opacity 0.12s, transform 0.12s, box-shadow 0.12s',
      }}
    >
      <div className="kbc-tags">
        {card.tags.map((t, i) => (
          <span key={i} className={t.cls} style={t.style}>
            {t.dot && <span className="dot" />}{t.label}
          </span>
        ))}
      </div>
      <h4 className="kbc-title" style={isDone ? { textDecoration: 'line-through' } : undefined}>
        {card.title}
      </h4>
      {card.desc && <p className="kbc-desc">{card.desc}</p>}
      {card.attachment && (
        <div className="kbc-attachment">
          <Icon id={card.attachment.icon} />
          <span><b>{card.attachment.bold}</b>{card.attachment.rest}</span>
        </div>
      )}
      {card.progressPct !== undefined && (
        <div className="kbc-progress">
          <div className="progress"><div className="bar" style={{ width: `${card.progressPct}%` }} /></div>
          <span>{card.progressLabel}</span>
        </div>
      )}
      {card.meta && card.meta.length > 0 && (
        <div className="kbc-meta">
          {card.meta.map((m, i) => (
            <span key={i} className={`mi${m.urgent ? ' urgent' : m.soon ? ' soon' : ''}`}>
              <Icon id={m.icon} /><span>{m.text}</span>
            </span>
          ))}
        </div>
      )}
      <div className="kbc-foot">
        <span className={`kbc-priority ${card.priority}`}>
          <span className="bar" /><span className="bar" /><span className="bar" />{card.pLabel}
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          {card.assignees.map((a, i) => (
            <div key={i} className="avatar" style={{ background: a.bg, ...(a.offset ? { marginLeft: -8, border: '2px solid var(--surface)' } : {}) }}>
              {a.initials}
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function KanbanPage() {
  const [viewSeg, setViewSeg] = useState(0)
  const [search, setSearch] = useState('')
  const [cardCols, setCardCols] = useState<Record<string, ColKey>>(
    () => Object.fromEntries(CARDS.map(c => [c.id, c.col]))
  )
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<ColKey | null>(null)
  const [selected, setSelected] = useState<CardData | null>(null)

  function colCards(col: ColKey) {
    const q = search.trim().toLowerCase()
    return CARDS.filter(c => {
      if (cardCols[c.id] !== col) return false
      if (!q) return true
      return c.title.toLowerCase().includes(q) || c.desc?.toLowerCase().includes(q) || false
    })
  }

  function handleDrop(e: React.DragEvent, col: ColKey) {
    e.preventDefault()
    const cardId = e.dataTransfer.getData('cardId') || dragging
    if (cardId) setCardCols(prev => ({ ...prev, [cardId]: col }))
    setDragging(null)
    setDragOver(null)
  }

  return (
    <>
      <div className="page-head">
        <div className="title">
          <span className="eyebrow">SU:Core · Internal backlog</span>
          <h1>Core board · Sprint 14</h1>
          <p className="text-muted" style={{ fontSize: 13, marginTop: 2 }}>
            Только для команды SU:Core. Студенты эту страницу не видят.
          </p>
        </div>
        <div className="row gap-2">
          <button className="btn secondary">
            <Icon id="i-download" style={{ width: 14, height: 14 }} />Экспорт CSV
          </button>
          <button className="btn primary">
            <Icon id="i-plus" style={{ width: 14, height: 14 }} />Новая задача
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <section className="kb-toolbar">
        <label className="input-group" style={{ width: 260 }}>
          <Icon id="i-search" className="ic" />
          <input
            type="text"
            placeholder="Найти задачу или ассайни…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </label>
        <span className="divider" />
        <div className="row gap-2">
          <span className="text-mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Sprint</span>
          <select className="select" style={{ width: 'auto', minWidth: 180, height: 32, fontSize: 13, paddingRight: 28 }}>
            <option>Sprint 14 · текущий</option>
            <option>Sprint 13</option>
            <option>Sprint 12</option>
            <option>Backlog (без спринта)</option>
          </select>
        </div>
        <span className="divider" />
        <span className="text-mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Кто</span>
        <div className="kb-faces">
          {FACES.map(a => <div key={a.i} className="avatar" style={{ background: a.bg }}>{a.i}</div>)}
          <div className="more">+3</div>
        </div>
        <span className="divider" />
        <button className="filter-chip active">
          <Icon id="i-flag" style={{ width: 12, height: 12 }} />Priority: P0–P1<span className="x">×</span>
        </button>
        <button className="filter-chip">
          <Icon id="i-target" style={{ width: 12, height: 12 }} />Tag: Open Day
        </button>
        <div style={{ marginLeft: 'auto' }} className="row gap-2">
          <div className="seg">
            {['Board', 'List', 'Timeline'].map((l, i) => (
              <button key={i} className={viewSeg === i ? 'active' : ''} onClick={() => setViewSeg(i)}>{l}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Board */}
      <div className="board-wrap">
        <div className="board">
          {COLS.map(col => {
            const cards = colCards(col.key)
            const isOver = dragOver === col.key && dragging !== null && cardCols[dragging] !== col.key
            return (
              <section
                key={col.key}
                className={`kb-col ${col.cls}`}
                onDragOver={e => { e.preventDefault(); setDragOver(col.key) }}
                onDragLeave={() => setDragOver(null)}
                onDrop={e => handleDrop(e, col.key)}
              >
                {/* Column header with legacy-style colored dot + count badge */}
                <header className="col-head">
                  <span className="marker" style={{ background: col.color }} />
                  <span className="title">{col.label}</span>
                  <span
                    className="count"
                    style={cards.length > 0 ? {
                      color: col.color,
                      background: col.color + '18',
                    } : undefined}
                  >
                    {cards.length}
                  </span>
                  <button className="add"><Icon id={col.eyeBtn ? 'i-eye' : 'i-plus'} /></button>
                </header>

                <div
                  className="col-drop"
                  style={{
                    background: isOver ? col.color + '10' : undefined,
                    outline: isOver ? `2px dashed ${col.color}` : undefined,
                    outlineOffset: -2,
                    borderRadius: isOver ? 8 : undefined,
                    minHeight: isOver && cards.length === 0 ? 64 : undefined,
                    transition: 'background 0.12s',
                  }}
                >
                  {cards.map(card => (
                    <KbCard
                      key={card.id}
                      card={card}
                      isDone={col.key === 'done'}
                      isDragging={dragging === card.id}
                      onDragStart={() => setDragging(card.id)}
                      onDragEnd={() => { setDragging(null); setDragOver(null) }}
                      onSelect={setSelected}
                    />
                  ))}
                  {cards.length === 0 && !isOver && (
                    <div style={{ padding: '20px 10px', textAlign: 'center', color: 'var(--muted)', fontSize: 12.5 }}>
                      Нет задач · перетащи сюда
                    </div>
                  )}
                </div>

                {col.key !== 'done' && (
                  <button className="col-add-empty"><Icon id="i-plus" />Добавить задачу</button>
                )}
              </section>
            )
          })}
        </div>
      </div>

      <footer className="text-muted" style={{ fontSize: 12, textAlign: 'center', padding: '18px 0 8px', marginTop: 8, borderTop: '1px solid var(--border)' }}>
        Внутренний backlog · виден только команде SU:Core · <span className="text-mono">перетащи карточку ↔ чтобы изменить статус · нажми чтобы открыть детали</span>
      </footer>

      {/* Task detail panel */}
      {selected && <CardDetailPanel card={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
