import { useState, useEffect } from 'react'
import { Icon } from '../components/Icon'
import { api, type Survey, type QStep } from '../lib/api'
import { useFetch } from '../hooks/useFetch'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { ErrorBanner } from '../components/ErrorBanner'

const KEYS = ['A', 'B', 'C', 'D', 'E', 'F']

export default function QuestionnairesPage() {
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [answers, setAnswers] = useState<Record<number, number[] | number | string>>({})

  const { data: fetchedSurveys, loading, error, retry } = useFetch<Survey[]>('/api/surveys');

  useEffect(() => {
    if (fetchedSurveys) {
      setSurveys(fetchedSurveys);
      if (fetchedSurveys.length > 0) setActiveId(fetchedSurveys[0].id);
    }
  }, [fetchedSurveys]);

  const active = surveys.find(q => q.id === activeId) ?? null

  function selectQ(id: string) {
    if (id === activeId) return
    setActiveId(id)
    setStep(0)
    setAnswers({})
    setSubmitted(false)
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
          <div style={{ maxWidth: '650px', width: '100%' }}>
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
            <h3 style={{ fontSize: 14 }}>Открыто</h3>
          </div>

          {loading && (
            <div className="q-list">
              <LoadingSkeleton type="questionnaire" count={4} />
            </div>
          )}

          {!loading && surveys.length === 0 && (
            <p className="text-muted" style={{ padding: '24px 0', fontSize: 14 }}>
              Нет активных опросов
            </p>
          )}

          {!loading && surveys.length > 0 && (
            <>
              <div className="q-list">
                {surveys.map(q => (
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
            </>
          )}
        </section>

        {!loading && active && surveys.length > 0 && (
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
                <div className="progress"><div className="bar" style={{ width: `${((step + 1) / active.steps.length) * 100}%` }}></div></div>
                <span>{step + 1} / {active.steps.length}</span>
              </div>
              <div className="q-dots">
                {Array.from({ length: active.steps.length }).map((_, i) => (
                  <div key={i} className={`q-dot${i === step ? ' active' : i < step ? ' done' : ''}`}></div>
                ))}
              </div>
            </header>

            <div className="q-body">
              <div className="q-step">
                <div className="num">Вопрос {String(step + 1).padStart(2, '0')} · {active.steps[step].type === 'single' ? 'одиночный выбор' : active.steps[step].type === 'multi' ? 'множественный выбор' : active.steps[step].type === 'scale' ? 'шкала 1–10' : 'текстовый ответ'}</div>
                <h3>{active.steps[step].title}</h3>
                <p className="hint">{active.steps[step].hint}</p>

                {active.steps[step].type === 'single' && (
                  <div className="col gap-3">
                    {(active.steps[step].options ?? []).map((opt, i) => {
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

                {active.steps[step].type === 'multi' && (
                  <div className="col gap-3">
                    {(active.steps[step].options ?? []).map((opt, i) => {
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

                {active.steps[step].type === 'scale' && (() => {
                  const val = getScale(step)
                  return (
                    <>
                      <div className="scale-row">
                        <div className="scale-cell label-cell">{active.steps[step].low}</div>
                        {[1,2,3,4,5,6,7,8,9,10].map(n => (
                          <div key={n} className={`scale-cell${val === n ? ' active' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setAnswers(a => ({ ...a, [step]: n }))}>{n}</div>
                        ))}
                        <div className="scale-cell label-cell" style={{ justifyContent: 'flex-end', textAlign: 'right' }}>{active.steps[step].high}</div>
                      </div>
                      <div className="row sb mt-6" style={{ padding: 16, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', fontSize: 13, color: 'var(--muted)' }}>
                        <span>Ваш ответ: <b style={{ color: 'var(--fg)' }}>{val} / 10</b></span>
                        {active.steps[step].median && <span className="text-mono" style={{ fontSize: 11, letterSpacing: '0.04em' }}>МЕДИАНА: {active.steps[step].median}</span>}
                      </div>
                    </>
                  )
                })()}

                {active.steps[step].type === 'text' && (
                  <textarea className="textarea" placeholder="Напишите свободно…" style={{ minHeight: 160, fontSize: 15 }}
                    value={getText(step)} onChange={e => setAnswers(a => ({ ...a, [step]: e.target.value }))} />
                )}
              </div>
            </div>

            <div className="q-footer">
              <button className="btn ghost" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>
                <Icon id="i-chevron-l" style={{ width: 14, height: 14 }} />Назад
              </button>
              <div className="row gap-2">
                <button className="btn secondary" onClick={() => { setStep(0); setAnswers({}) }}>Сохранить и выйти</button>
                {step < active.steps.length - 1 ? (
                  <button className="btn primary" onClick={() => setStep(s => s + 1)}>Далее →</button>
                ) : submitted ? (
                  <button className="btn secondary" disabled><Icon id="i-check" style={{ width: 14, height: 14 }} />Ответ отправлен</button>
                ) : (
                  <button className="btn primary" onClick={() => setSubmitted(true)}><Icon id="i-check" style={{ width: 14, height: 14 }} />Отправить ответ</button>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  )
}
