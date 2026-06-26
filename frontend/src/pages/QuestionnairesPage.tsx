import { useState } from 'react'
import { Icon } from '../components/Icon'
import { api, type Survey, type QStep, type SurveyAnswer } from '../lib/api'
import { useFetch } from '../hooks/useFetch'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { ErrorBanner } from '../components/ErrorBanner'

const KEYS = ['A', 'B', 'C', 'D', 'E', 'F']

export default function QuestionnairesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [answers, setAnswers] = useState<Record<number, number[] | number | string>>({})
  // Ids the user already submitted (server also blocks re-submit via cookie, but the
  // cookie is httponly so we track locally to hide answered surveys from the list).
  const [answered, setAnswered] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('su_answered_surveys') ?? '[]') } catch { return [] }
  })

  const { data: fetchedSurveys, loading, error, retry } = useFetch<Survey[]>('/api/questionnaires');

  const surveys = fetchedSurveys ?? []
  // Hide already-answered surveys from the list and default selection.
  const visibleSurveys = surveys.filter(q => !answered.includes(q.id))
  const activeId = selectedId ?? visibleSurveys[0]?.id ?? null
  const active = surveys.find(q => q.id === activeId) ?? null

  function markAnswered(id: string) {
    setAnswered(prev => {
      const next = [...new Set([...prev, id])]
      localStorage.setItem('su_answered_surveys', JSON.stringify(next))
      return next
    })
  }

  function selectQ(id: string) {
    if (id === activeId) return
    setSelectedId(id)
    setStep(0)
    setAnswers({})
    setSubmitted(false)
    setSubmitError('')
  }

  // Build the payload keyed by question id (the value shapes the stats views expect):
  // single → option text, multi → array of option texts, scale → number, text → string.
  async function handleSubmit() {
    if (!active) return
    const payload: Record<string, SurveyAnswer> = {}
    active.steps.forEach((s, i) => {
      const v = answers[i]
      if (v === undefined) return
      if (s.type === 'single' && Array.isArray(v) && s.options) {
        const opt = s.options[v[0]]
        if (opt !== undefined) payload[s.id] = opt
      } else if (s.type === 'multi' && Array.isArray(v) && s.options) {
        const picked = v.map(j => s.options![j]).filter(Boolean)
        if (picked.length) payload[s.id] = picked
      } else if (s.type === 'scale' && typeof v === 'number') {
        payload[s.id] = v
      } else if (s.type === 'text' && typeof v === 'string' && v.trim()) {
        payload[s.id] = v.trim()
      }
    })
    setSubmitting(true)
    setSubmitError('')
    try {
      await api.questionnaires.submit(active.id, payload)
      setSubmitted(true)
      markAnswered(active.id)
    } catch (e) {
      // 409 = the one-response-per-student cookie guard already fired.
      setSubmitError(e instanceof Error && e.message === '409' ? 'Вы уже проходили этот опрос' : 'Не удалось отправить ответ')
    } finally {
      setSubmitting(false)
    }
  }

  function getSelected(i: number): number[] {
    const v = answers[i]
    return Array.isArray(v) ? v : []
  }
  function getScale(i: number): number {
    const v = answers[i]
    return typeof v === 'number' ? v : 7
  }
  function getText(i: number): string {
    const v = answers[i]
    return typeof v === 'string' ? v : ''
  }

  function toggleSingle(optIdx: number) {
    setAnswers(a => ({ ...a, [step]: [optIdx] }))
  }
  function toggleMulti(optIdx: number) {
    const cur = getSelected(step)
    setAnswers(a => ({ ...a, [step]: cur.includes(optIdx) ? cur.filter(x => x !== optIdx) : [...cur, optIdx] }))
  }

  if (error) {
    return (
      <>
        <div className="page-head">
          <div className="title">
            <span className="eyebrow">Студсовет</span>
            <h1>Questionnaires</h1>
            <p className="lead" style={{ fontSize: 14, marginTop: 6 }}>Открытые опросы от SU. Ваш голос помогает планировать ивенты, бюджет и работу департаментов.</p>
          </div>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '300px',
          width: '100%'
        }}>
          <div style={{ maxWidth: '600px', width: '100%' }}>
            <ErrorBanner 
              message="Failed to load questionnaires. Please try again." 
              onRetry={retry}
              stack={error}
            />
          </div>
        </div>
      </>
    )
  }

  if (!active) {
    return (
      <>
        <div className="page-head">
          <div className="title">
            <span className="eyebrow">Студсовет</span>
            <h1>Questionnaires</h1>
            <p className="lead" style={{ fontSize: 14, marginTop: 6 }}>Открытые опросы от SU. Ваш голос помогает планировать ивенты, бюджет и работу департаментов.</p>
          </div>
        </div>
        <div className="q-layout">
          <section>
            <div className="row sb mb-4">
              <h3 style={{ fontSize: 14 }}>Открыто <span className="text-muted text-mono" style={{ fontSize: 11, marginLeft: 4 }}>{visibleSurveys.length}</span></h3>
            </div>
            {loading && (
              <div className="q-list">
                <LoadingSkeleton type="questionnaire" count={4} />
              </div>
            )}
            {!loading && visibleSurveys.length === 0 && (
              <p className="text-muted" style={{ padding: '24px 0', fontSize: 14 }}>
                Нет активных опросов
              </p>
            )}
          </section>
        </div>
      </>
    )
  }

  const totalSteps = active.steps.length
  // Guard: a published survey could (briefly) have no questions — don't crash.
  if (totalSteps === 0) {
    return (
      <>
        <div className="page-head">
          <div className="title">
            <span className="eyebrow">Студсовет</span>
            <h1>Questionnaires</h1>
          </div>
        </div>
        <p className="text-muted" style={{ padding: '24px 0' }}>У этого опроса пока нет вопросов.</p>
      </>
    )
  }
  // Clamp the step so switching to a shorter survey never indexes out of range.
  const stepIdx = step < totalSteps ? step : 0
  const progress = ((stepIdx + 1) / totalSteps) * 100
  const currentStep = active.steps[stepIdx] as QStep

  return (
    <>
      <div className="page-head">
        <div className="title">
          <span className="eyebrow">Студсовет</span>
          <h1>Questionnaires</h1>
          <p className="lead" style={{ fontSize: 14, marginTop: 6 }}>Открытые опросы от SU. Ваш голос помогает планировать ивенты, бюджет и работу департаментов.</p>
        </div>
      </div>

      <div className="q-layout">
        <section>
          <div className="row sb mb-4">
            <h3 style={{ fontSize: 14 }}>Открыто <span className="text-muted text-mono" style={{ fontSize: 11, marginLeft: 4 }}>{visibleSurveys.length}</span></h3>
          </div>

          <div className="q-list">
            {visibleSurveys.map(q => (
              <div key={q.id} className={`q-list-card${q.id === activeId ? ' active' : ''}`} style={{ cursor: 'pointer' }} onClick={() => selectQ(q.id)}>
                <div className="meta">
                  <span className={`tag ${q.tagCls}`} style={{ height: 18, fontSize: 10, padding: '0 6px' }}>{q.tag}</span>
                  <span>Опрос #{q.id}</span>
                </div>
                <h4>{q.title}</h4>
                <p className="desc">{q.desc}</p>
                <div className="foot">
                  <span className={`pill-time${q.timeEnding ? ' ending' : ''}`}>{q.time}</span>
                  <span>×</span>
                  <span>{q.left}</span>
                  {q.id === activeId && <span style={{ marginLeft: 'auto', color: 'var(--accent-700)' }}>▶ Сейчас открыт</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="row sb mt-6" style={{ padding: '14px 16px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', fontSize: 12, color: 'var(--muted)' }}>
            <div>
              <div style={{ color: 'var(--fg)', fontWeight: 500, marginBottom: 2 }}>Пройдено вами</div>
              <span>9 из 24 за всё время</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 600, color: 'var(--accent-700)' }}>38%</div>
          </div>
        </section>

        <section className="q-flow">
          <header className="q-flow-head">
            <div className="topbar">
              <div>
                <span className="eyebrow" style={{ color: 'var(--accent-700)' }}>{active.eyebrow}</span>
                <h2 style={{ marginTop: 6 }}>{active.flowTitle}</h2>
              </div>
              <div className="row gap-2">
                <span className="tag outline"><Icon id="i-clock" style={{ width: 11, height: 11 }} />{active.time}</span>
                <span className="tag green"><span className="dot"></span>Открыт</span>
              </div>
            </div>
            <div className="progress-wrap">
              <div className="progress"><div className="bar" style={{ width: `${progress}%` }}></div></div>
              <span>{step + 1} / {totalSteps}</span>
            </div>
            <div className="q-dots">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div key={i} className={`q-dot${i === step ? ' active' : i < step ? ' done' : ''}`}></div>
              ))}
            </div>
          </header>

          <div className="q-body">
            <div className="q-step">
              <div className="num">Вопрос {String(step + 1).padStart(2, '0')} · {currentStep.type === 'single' ? 'одиночный выбор' : currentStep.type === 'multi' ? 'множественный выбор' : currentStep.type === 'scale' ? 'шкала 1–10' : 'текстовый ответ'}</div>
              <h3>{currentStep.title}</h3>
              <p className="hint">{currentStep.hint}</p>

              {currentStep.type === 'single' && (
                <div className="col gap-3">
                  {(currentStep.options ?? []).map((opt, i) => {
                    const sel = getSelected(step)
                    const isSelected = sel.includes(i)
                    return (
                      <div key={i} className={`opt-card${isSelected ? ' selected' : ''}`} style={{ cursor: 'pointer' }} onClick={() => toggleSingle(i)}>
                        <span className="opt-key">{KEYS[i]}</span>
                        <span className="opt-text">{opt}</span>
                      </div>
                    )
                  })}
                </div>
              )}

              {currentStep.type === 'multi' && (
                <div className="col gap-3">
                  {(currentStep.options ?? []).map((opt, i) => {
                    const sel = getSelected(step)
                    const isChecked = sel.includes(i)
                    return (
                      <div key={i} className={`opt-card${isChecked ? ' selected' : ''}`} style={{ cursor: 'pointer' }} onClick={() => toggleMulti(i)}>
                        <span className="opt-key">
                          {isChecked && <Icon id="i-check" style={{ width: 12, height: 12, color: '#fff' }} />}
                        </span>
                        <span className="opt-text">{opt}</span>
                      </div>
                    )
                  })}
                </div>
              )}

              {currentStep.type === 'scale' && (() => {
                const val = getScale(step)
                return (
                  <>
                    <div className="scale-row">
                      <div className="scale-cell label-cell">{currentStep.low}</div>
                      {[1,2,3,4,5,6,7,8,9,10].map(n => (
                        <div key={n} className={`scale-cell${val === n ? ' active' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setAnswers(a => ({ ...a, [step]: n }))}>{n}</div>
                      ))}
                      <div className="scale-cell label-cell" style={{ justifyContent: 'flex-end', textAlign: 'right' }}>{currentStep.high}</div>
                    </div>
                    <div className="row sb mt-6" style={{ padding: 16, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', fontSize: 13, color: 'var(--muted)' }}>
                      <span>Ваш ответ: <b style={{ color: 'var(--fg)' }}>{val} / 10</b></span>
                      {currentStep.median && <span className="text-mono" style={{ fontSize: 11, letterSpacing: '0.04em' }}>МЕДИАНА: {currentStep.median}</span>}
                    </div>
                  </>
                )
              })()}

              {currentStep.type === 'text' && (
                <textarea className="textarea" placeholder="Напишите свободно…" style={{ minHeight: 160, fontSize: 15 }}
                  value={getText(step)} onChange={e => setAnswers(a => ({ ...a, [step]: e.target.value }))} />
              )}
            </div>
          </div>

          {submitError && (
            <div role="alert" style={{ margin: '0 16px', color: '#B91C1C', fontSize: 13 }}>{submitError}</div>
          )}
          {submitted && (
            <div style={{ margin: '0 16px', color: '#15803D', fontSize: 13 }}>Спасибо! Ваш ответ записан.</div>
          )}
          <div className="q-footer">
            <button className="btn ghost" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>
              <Icon id="i-chevron-l" style={{ width: 14, height: 14 }} />Назад
            </button>
            <div className="row gap-2">
              {step < totalSteps - 1 ? (
                <button className="btn primary" onClick={() => setStep(s => s + 1)}>Далее →</button>
              ) : submitted ? (
                <button className="btn secondary" disabled><Icon id="i-check" style={{ width: 14, height: 14 }} />Ответ отправлен</button>
              ) : (
                <button className="btn primary" disabled={submitting} onClick={handleSubmit}><Icon id="i-check" style={{ width: 14, height: 14 }} />{submitting ? 'Отправка…' : 'Отправить ответ'}</button>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
