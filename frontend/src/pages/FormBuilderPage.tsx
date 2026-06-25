import { useState } from 'react'
import { Icon } from '../components/Icon'
import { api, type QStepType, type QuestionInput } from '../lib/api'

type QType = 'scale' | 'multi' | 'single' | 'text' | 'short' | 'stars' | 'section'

// The builder has 7 visual types; the backend stores 4. Sections are layout-only
// and are skipped on save (null). short→text, stars→scale.
const BACKEND_TYPE: Record<QType, QStepType | null> = {
  single: 'single', multi: 'multi', scale: 'scale', text: 'text',
  short: 'text', stars: 'scale', section: null,
}

interface LogicRule { optionIndex: number; jumpTo: number | 'end' }

interface Question {
  id: number
  type: QType
  title: string
  hint: string
  options: string[]
  required: boolean
  logic?: LogicRule[]
}

const TYPE_LABEL: Record<QType, string> = {
  scale: 'Шкала 1–10',
  multi: 'Несколько вариантов',
  single: 'Один из вариантов',
  text: 'Длинный текст',
  short: 'Короткий ответ',
  stars: 'Звёзды 1–5',
  section: 'Секция / разделитель',
}
const TYPE_ICON: Record<QType, string> = {
  scale: 'i-scale', multi: 'i-square', single: 'i-circle',
  text: 'i-list', short: 'i-text', stars: 'i-star', section: 'i-grid',
}

const INITIAL: Question[] = [
  { id: 1, type: 'scale', title: 'Насколько полезной была Welcome Week в целом?', hint: '1 — совсем бесполезно, 10 — изменило, как я смотрю на университет', options: [], required: true },
  { id: 2, type: 'multi', title: 'Какие события Welcome Week запомнились?', hint: 'Можно выбрать несколько', options: ['Гид по корпусам с Тимуром Карповым', 'Вечер знакомств в Sport Tower', 'Лекция «Как устроен IU за пределами лекций»', 'Ярмарка клубов и кружков'], required: false },
  { id: 3, type: 'single', title: 'Хотели бы вы помочь со следующей Welcome Week?', hint: '', options: ['Да, готов(а) быть buddy для первого курса', 'Да, помогу с логистикой / точечно', 'Не уверен(а), нужно подумать', 'Нет, спасибо'], required: true },
  { id: 4, type: 'text', title: 'Что обязательно нужно поменять / убрать?', hint: 'Конкретные пожелания и идеи. Ответ читают вручную.', options: [], required: false },
]

let nextId = 10

function QuestionCard({ q, num, total, onDelete, onChange }: {
  q: Question; num: number; total: number
  onDelete: () => void; onChange: (q: Question) => void
}) {
  const [showLogic, setShowLogic] = useState(false)

  function addOption() { onChange({ ...q, options: [...q.options, ''] }) }
  function setOption(i: number, val: string) { const o = [...q.options]; o[i] = val; onChange({ ...q, options: o }) }
  function removeOption(i: number) { onChange({ ...q, options: q.options.filter((_, idx) => idx !== i) }) }

  function setLogicRule(optIdx: number, jumpTo: number | 'end' | '') {
    const existing = (q.logic ?? []).filter(r => r.optionIndex !== optIdx)
    const next: LogicRule[] = jumpTo === '' ? existing : [...existing, { optionIndex: optIdx, jumpTo: jumpTo as number | 'end' }]
    onChange({ ...q, logic: next.length ? next : undefined })
  }

  function getJumpTo(optIdx: number): number | 'end' | '' {
    return q.logic?.find(r => r.optionIndex === optIdx)?.jumpTo ?? ''
  }

  const hasOptions = q.type === 'single' || q.type === 'multi'
  const canHaveLogic = q.type === 'single'

  if (q.type === 'section') {
    return (
      <article className="question" style={{ background: 'var(--surface-2)', borderStyle: 'dashed' }}>
        <header className="q-head">
          <span className="grip"><Icon id="i-grip" style={{ width: 14, height: 14 }} /></span>
          <span className="type-tag"><Icon id={TYPE_ICON[q.type]} style={{ width: 11, height: 11 }} />{TYPE_LABEL[q.type]}</span>
          <span className="text-mono text-muted" style={{ fontSize: 11 }}>{String(num).padStart(2, '0')}</span>
          <div className="q-actions"><button className="icon-btn" onClick={onDelete}><Icon id="i-trash" /></button></div>
        </header>
        <div className="q-body">
          <input className="q-title-input" value={q.title} placeholder="Заголовок секции…" onChange={e => onChange({ ...q, title: e.target.value })} />
          <input className="q-hint-input" value={q.hint} placeholder="Подзаголовок / описание (опционально)…" onChange={e => onChange({ ...q, hint: e.target.value })} />
        </div>
      </article>
    )
  }

  return (
    <article className="question">
      <header className="q-head">
        <span className="grip"><Icon id="i-grip" style={{ width: 14, height: 14 }} /></span>
        <span className="type-tag">
          <Icon id={TYPE_ICON[q.type]} style={{ width: 11, height: 11 }} />
          {TYPE_LABEL[q.type]}
        </span>
        <span className="text-mono text-muted" style={{ fontSize: 11 }}>{String(num).padStart(2, '0')}</span>
        <div className="q-actions">
          {canHaveLogic && (
            <button
              className="icon-btn"
              title="Условные переходы"
              style={q.logic?.length ? { color: 'var(--accent)' } : {}}
              onClick={() => setShowLogic(v => !v)}
            >
              <Icon id="i-share" style={{ width: 14, height: 14 }} />
            </button>
          )}
          <button className="icon-btn" onClick={onDelete}><Icon id="i-trash" /></button>
        </div>
      </header>
      <div className="q-body">
        <input className="q-title-input" value={q.title} placeholder="Текст вопроса…" onChange={e => onChange({ ...q, title: e.target.value })} />
        {q.type !== 'scale' && q.type !== 'stars' && (
          <input className="q-hint-input" value={q.hint} placeholder="Подсказка для респондента (опционально)…" onChange={e => onChange({ ...q, hint: e.target.value })} />
        )}

        {q.type === 'scale' && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
            <div style={{ flexShrink: 0, color: 'var(--muted)', fontSize: 11, fontFamily: 'var(--font-mono)', minWidth: 60, display: 'grid', placeItems: 'start center', letterSpacing: '0.04em' }}>НЕ ПОЛЕЗНО</div>
            <div style={{ flex: 1, display: 'flex', gap: 4 }}>
              {[1,2,3,4,5,6,7,8,9,10].map(n => (
                <div key={n} style={{ flex: 1, height: 40, border: '1px solid var(--border)', borderRadius: 6, display: 'grid', placeItems: 'center', fontSize: 13, color: 'var(--muted)' }}>{n}</div>
              ))}
            </div>
            <div style={{ flexShrink: 0, color: 'var(--muted)', fontSize: 11, fontFamily: 'var(--font-mono)', minWidth: 60, display: 'grid', placeItems: 'start center', letterSpacing: '0.04em' }}>ОЧЕНЬ</div>
          </div>
        )}
        {q.type === 'stars' && (
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            {[1,2,3,4,5].map(n => <span key={n} style={{ fontSize: 28, color: 'var(--border-2)' }}>★</span>)}
          </div>
        )}
        {q.type === 'short' && (
          <input className="input" placeholder="Короткий ответ респондента…" disabled style={{ marginTop: 8, background: 'var(--surface-2)', color: 'var(--muted)', fontStyle: 'italic' }} />
        )}
        {q.type === 'text' && (
          <textarea className="textarea" placeholder="Длинный ответ респондента…" disabled style={{ marginTop: 8, background: 'var(--surface-2)', minHeight: 80, color: 'var(--muted)', fontStyle: 'italic' }} />
        )}

        {hasOptions && (
          <div style={{ marginTop: 8 }}>
            {q.options.map((opt, i) => (
              <div key={i} className={`opt-row${q.type === 'multi' ? ' checkbox' : ''}`}>
                <span className="opt-dot"></span>
                <input className="opt-input" value={opt} placeholder="Вариант ответа…" onChange={e => setOption(i, e.target.value)} />
                <button className="icon-btn" onClick={() => removeOption(i)}><Icon id="i-x" /></button>
              </div>
            ))}
            <button className="q-add-option" onClick={addOption}>
              <Icon id="i-plus" />Добавить вариант
            </button>
          </div>
        )}

        {canHaveLogic && showLogic && q.options.length > 0 && (
          <div style={{ marginTop: 12, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 8, letterSpacing: '0.05em' }}>УСЛОВНЫЕ ПЕРЕХОДЫ</div>
            {q.options.map((opt, i) => (
              <div key={i} className="row gap-2" style={{ marginBottom: 6, alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--muted)', minWidth: 16, fontFamily: 'var(--font-mono)' }}>{i + 1}</span>
                <span style={{ fontSize: 13, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{opt || `Вариант ${i + 1}`}</span>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>→</span>
                <select
                  style={{ fontSize: 12, border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', background: 'var(--surface)', color: 'var(--text)', minWidth: 140 }}
                  value={getJumpTo(i)}
                  onChange={e => setLogicRule(i, e.target.value === '' ? '' : e.target.value === 'end' ? 'end' : Number(e.target.value))}
                >
                  <option value="">Следующий вопрос</option>
                  {Array.from({ length: total }, (_, j) => j + 1).filter(j => j !== num).map(j => (
                    <option key={j} value={j}>Вопрос {j}</option>
                  ))}
                  <option value="end">Завершить опрос</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
      <footer className="q-footer">
        <label className="switch required-toggle">
          <input type="checkbox" checked={q.required} onChange={e => onChange({ ...q, required: e.target.checked })} />
          <span className="track"></span>
          <span>Обязательный</span>
        </label>
        {q.logic?.length ? (
          <span style={{ fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--font-mono)', marginLeft: 12 }}>
            {q.logic.length} условие{q.logic.length > 1 ? 'й' : ''}
          </span>
        ) : null}
      </footer>
    </article>
  )
}

export default function FormBuilderPage() {
  const [preview, setPreview] = useState(false)
  const [questions, setQuestions] = useState<Question[]>(INITIAL)
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [toast, setToast] = useState('')
  const [saving, setSaving] = useState(false)
  const [formTitle, setFormTitle] = useState('Фидбек Welcome Week 2026')
  const [formDesc, setFormDesc] = useState('Помогите оценить программу Welcome Week и понять, что улучшить к следующему набору. Опрос анонимный, около 2 минут.')

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  function mapQuestion(q: Question): QuestionInput {
    const type = BACKEND_TYPE[q.type] as QStepType
    const input: QuestionInput = { type, title: q.title.trim() || '(без названия)', hint: q.hint }
    if (type === 'single' || type === 'multi') input.options = q.options.filter(Boolean)
    if (q.type === 'stars') { input.scale_low = '1'; input.scale_high = '5' }
    return input
  }

  function resetBuilder() {
    setQuestions([{ id: nextId++, type: 'single', title: '', hint: '', options: ['Вариант 1', 'Вариант 2'], required: false }])
    setFormTitle('Новый опрос')
    setFormDesc('')
    setStatus('draft')
  }

  // Persists the builder to the backend: create questionnaire → add each (non-section)
  // question → optionally open it. Each save creates a SEPARATE questionnaire, then the
  // builder resets so the next one is independent.
  async function saveQuestionnaire(publishIt: boolean) {
    const real = questions.filter(q => BACKEND_TYPE[q.type] !== null)
    if (!formTitle.trim()) { showToast('Укажите название опроса'); return }
    if (real.length === 0) { showToast('Добавьте хотя бы один вопрос'); return }
    setSaving(true)
    try {
      const created = await api.admin.questionnaires.create({
        department: 'core',
        title: formTitle.trim(),
        description: formDesc.trim(),
        est_minutes: 2,
      })
      for (const q of real) {
        await api.admin.questionnaires.addQuestion(created.id, mapQuestion(q))
      }
      if (publishIt) await api.admin.questionnaires.setStatus(created.id, 'open')
      showToast(publishIt ? 'Опрос опубликован — открыт в Questionnaires' : 'Черновик сохранён')
      resetBuilder()
    } catch {
      showToast('Не удалось сохранить опрос')
    } finally {
      setSaving(false)
    }
  }

  function exportCsv() {
    const rows = questions.map((q, i) => [`${i + 1}`, q.type, q.title, q.hint, q.options.join(' | ')])
    const csv = [['#', 'Type', 'Title', 'Hint', 'Options'], ...rows].map(r => r.map(v => `"${v.replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'form-questions.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  function addQuestion(type: QType) {
    const defaultOptions = (type === 'single' || type === 'multi') ? ['Вариант 1', 'Вариант 2'] : []
    setQuestions(qs => [...qs, { id: nextId++, type, title: '', hint: '', options: defaultOptions, required: false }])
  }

  function deleteQuestion(id: number) { setQuestions(qs => qs.filter(q => q.id !== id)) }
  function updateQuestion(updated: Question) { setQuestions(qs => qs.map(q => q.id === updated.id ? updated : q)) }

  const nonSectionCount = questions.filter(q => q.type !== 'section').length

  return (
    <>
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: 'var(--fg)', color: 'var(--bg)', padding: '10px 20px', borderRadius: 8, fontSize: 13, zIndex: 9999, pointerEvents: 'none' }}>
          {toast}
        </div>
      )}
      <div className="page-head">
        <div className="title">
          <div className="row gap-2 mb-2">
            <span className={`tag ${status === 'published' ? 'blue' : 'green'}`}><span className="dot"></span>{status === 'published' ? 'Опубликован' : 'Черновик'}</span>
            <span className="tag outline"><Icon id="i-clock" style={{ width: 11, height: 11 }} />автосохранение 12 сек назад</span>
          </div>
          <h1>Конструктор опроса</h1>
        </div>
        <div className="row gap-2">
          <button className="btn ghost" onClick={() => setPreview(p => !p)}>
            <Icon id="i-eye" style={{ width: 14, height: 14 }} />
            {preview ? 'Редактировать' : 'Preview'}
          </button>
          <button className="btn ghost" disabled={saving} onClick={resetBuilder}><Icon id="i-plus" style={{ width: 14, height: 14 }} />Новый опрос</button>
          <button className="btn secondary" disabled={saving} onClick={() => saveQuestionnaire(false)}>Сохранить как черновик</button>
          <button className="btn primary" disabled={saving} onClick={() => saveQuestionnaire(true)}><Icon id="i-rocket" style={{ width: 14, height: 14 }} />{saving ? 'Сохранение…' : 'Опубликовать'}</button>
        </div>
      </div>

      <div className="builder-toolbar">
        <span className="stat-pill"><Icon id="i-clipboard" style={{ width: 12, height: 12 }} />{nonSectionCount} вопросов</span>
        <span className="stat-pill"><Icon id="i-clock" style={{ width: 12, height: 12 }} />~ 2 мин</span>
        <span className="stat-pill"><Icon id="i-users" style={{ width: 12, height: 12 }} />видит: All students</span>
      </div>

      <div className={`builder-layout${preview ? ' preview-on' : ''}`}>

        <aside className="palette">
          <h4>Типы вопросов</h4>
          <div className="pal-list">
            {(['short', 'text', 'single', 'multi', 'scale', 'stars'] as QType[]).map(type => (
              <button key={type} className="pal-item" onClick={() => addQuestion(type)}>
                <Icon id={TYPE_ICON[type]} className="ic" />{TYPE_LABEL[type]}
              </button>
            ))}
          </div>
          <div className="pal-divider"></div>
          <h4>Структура</h4>
          <div className="pal-list">
            <button className="pal-item" onClick={() => addQuestion('section')}>
              <Icon id="i-grid" className="ic" />Секция / разделитель
            </button>
          </div>
          <div className="pal-divider"></div>
          <h4>Логика</h4>
          <div className="pal-list">
            <button className="pal-item" style={{ color: 'var(--muted)', fontSize: 12 }}>
              <Icon id="i-share" className="ic" />Нажмите <Icon id="i-share" style={{ width: 11, height: 11 }} /> у вопроса типа «Один из вариантов»
            </button>
          </div>
        </aside>

        <section className="canvas">
          <header className="form-head">
            <div className="badge-row">
              <span className="tag green" style={{ height: 18, fontSize: 10, padding: '0 6px' }}>SU:Core</span>
              <span>ОПРОС #025 · {status === 'published' ? 'ОПУБЛИКОВАН' : 'ЧЕРНОВИК'}</span>
            </div>
            <input
              className="form-title"
              value={formTitle}
              onChange={e => setFormTitle(e.target.value)}
              placeholder="Название опроса…"
            />
            <textarea
              className="form-desc"
              value={formDesc}
              onChange={e => setFormDesc(e.target.value)}
              placeholder="Описание опроса…"
            />
          </header>

          <div className="questions-list">
            {questions.map((q, i) => (
              <QuestionCard
                key={q.id}
                q={q}
                num={i + 1}
                total={questions.length}
                onDelete={() => deleteQuestion(q.id)}
                onChange={updateQuestion}
              />
            ))}
          </div>

          <div className="add-bar">
            Добавить вопрос:
            <button onClick={() => addQuestion('single')}>+ Один вариант</button>
            <button onClick={() => addQuestion('multi')}>+ Несколько</button>
            <button onClick={() => addQuestion('scale')}>+ Шкала</button>
            <button onClick={() => addQuestion('text')}>+ Текст</button>
            <button onClick={() => addQuestion('section')}>+ Секция</button>
          </div>
        </section>

        <aside className="builder-settings">
          <div className="settings-card">
            <h4><Icon id="i-shield" className="ic" />Доступ</h4>
            <div className="row sb"><span>Открыт для</span><span className="text-mono" style={{ fontSize: 12 }}>All students</span></div>
            <div className="row sb"><span>Анонимные ответы</span><label className="switch"><input type="checkbox" defaultChecked /><span className="track"></span></label></div>
            <div className="row sb"><span>1 ответ на студента</span><label className="switch"><input type="checkbox" defaultChecked /><span className="track"></span></label></div>
          </div>
          <div className="settings-card">
            <h4><Icon id="i-calendar" className="ic" />Сроки</h4>
            <div className="field" style={{ marginBottom: 12 }}>
              <label>Открыть</label>
              <input className="input" type="datetime-local" defaultValue="2026-06-12T09:00" />
            </div>
            <div className="field">
              <label>Закрыть</label>
              <input className="input" type="datetime-local" defaultValue="2026-06-30T23:59" />
            </div>
          </div>
          <div className="settings-card">
            <h4><Icon id="i-bell" className="ic" />Уведомления</h4>
            <div className="row sb"><span>Email при новом ответе</span><label className="switch"><input type="checkbox" /><span className="track"></span></label></div>
            <div className="row sb"><span>Daily digest</span><label className="switch"><input type="checkbox" defaultChecked /><span className="track"></span></label></div>
          </div>
          <div className="export-card">
            <h4><Icon id="i-download" style={{ width: 16, height: 16 }} />Экспорт результатов</h4>
            <p>Скачать ответы в .xlsx, .csv или скопировать ссылку на дашборд после публикации.</p>
            <button className="btn" onClick={exportCsv}>Экспорт в .csv</button>
          </div>
        </aside>
      </div>
    </>
  )
}
