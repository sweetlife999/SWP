import { useState } from 'react'
import { Icon } from '../components/Icon'

type QStep =
  | { type: 'single'; title: string; hint: string; options: string[] }
  | { type: 'multi';  title: string; hint: string; options: string[] }
  | { type: 'scale';  title: string; hint: string; low: string; high: string; median?: number }
  | { type: 'text';   title: string; hint: string }

const QUESTS = [
  {
    id: '024', tag: 'SU:Active', tagCls: 'blue',
    title: 'Программа Summer Days 2026 — какие активности добавить',
    desc: '4 вопроса · ваш ответ повлияет на финальную программу с 20 июня по 5 июля.',
    time: '2 МИН', timeEnding: false, left: 'осталось 4 дня',
    flowTitle: 'Программа Summer Days 2026',
    eyebrow: 'SU:Active · опрос #024',
    steps: [
      { type: 'single' as const, title: 'Какой формат открытия Summer Days вам ближе?', hint: 'Выберите один вариант. SU:Active соберёт финальную программу первого дня.',
        options: ['Концерт студенческих групп на campus square', 'Open BBQ у Волги с играми и активностями', 'Кино под открытым небом + after-party', 'Спортивная олимпиада между корпусами'] },
      { type: 'multi' as const, title: 'Какие активности обязательно должны быть в программе?', hint: 'Выберите до 4 вариантов.',
        options: ['Гребля на Волге', 'Кино под открытым небом', 'Турнир по настольным играм', 'Stand-up evening', 'Фотопрогулка на закате', 'Йога на свежем воздухе'] },
      { type: 'scale' as const, title: 'Насколько вам важно, чтобы события были вечерние (после 18:00)?', hint: 'Помогает спланировать слоты.', low: 'Не важно', high: 'Критично', median: 8 },
      { type: 'text' as const, title: 'Что вы добавили бы или поменяли?', hint: 'Опционально. SU читает все ответы вручную.' },
    ] as QStep[],
  },
  {
    id: '023', tag: 'SU:Core', tagCls: 'green',
    title: 'Голосование по бюджету Q3',
    desc: '5 вопросов · распределение ₽ 380,000 по направлениям студсовета на третий квартал.',
    time: '3 МИН', timeEnding: false, left: 'осталось 9 дней',
    flowTitle: 'Голосование по бюджету Q3',
    eyebrow: 'SU:Core · опрос #023',
    steps: [
      { type: 'single' as const, title: 'Какое направление студсовета вы считаете приоритетным?', hint: 'Выберите один вариант.',
        options: ['SU:Core — стратегия и университет', 'SU:Active — ивенты и спорт', 'SU:Media — контент и дизайн', 'Распределить поровну между всеми'] },
      { type: 'multi' as const, title: 'На какие категории трат вложить больше всего?', hint: 'Можно выбрать несколько.',
        options: ['Ивенты и мероприятия', 'Спорт и инвентарь', 'Медиаоборудование', 'IT и инфраструктура', 'Печать и полиграфия', 'Мерч студсовета'] },
      { type: 'scale' as const, title: 'Насколько вы довольны текущим распределением бюджета?', hint: '1 — совсем не доволен, 10 — полностью устраивает.', low: 'Не доволен', high: 'Полностью доволен', median: 7 },
      { type: 'single' as const, title: 'Какую статью расходов вы бы урезали при нехватке средств?', hint: 'Выберите наименее приоритетную для вас.',
        options: ['Печать и полиграфия', 'Аренда оборудования', 'Мерч студсовета', 'Ничего — все статьи важны'] },
      { type: 'text' as const, title: 'Комментарий и предложения по бюджету', hint: 'Опционально. Все комментарии передаются в SU:Core.' },
    ] as QStep[],
  },
  {
    id: '022', tag: 'SU:Media', tagCls: 'purple',
    title: 'Мерч студсовета — финальный выбор',
    desc: '4 вопроса · какой мерч хотите видеть в осенней коллекции.',
    time: '1 МИН', timeEnding: true, left: 'осталось 16 часов',
    flowTitle: 'Мерч студсовета — финальный выбор',
    eyebrow: 'SU:Media · опрос #022',
    steps: [
      { type: 'single' as const, title: 'Какой мерч вы хотите видеть в осенней коллекции?', hint: 'Выберите один вариант.',
        options: ['Футболка с логотипом SU', 'Худи оверсайз', 'Кепка с вышивкой', 'Сумка-шоппер'] },
      { type: 'multi' as const, title: 'Какие цвета предпочитаете?', hint: 'Можно выбрать несколько.',
        options: ['Белый', 'Чёрный', 'Серый меланж', 'Тёмно-зелёный', 'Синий IU'] },
      { type: 'scale' as const, title: 'Оцените качество мерча прошлого года', hint: '1 — разочарован, 10 — очень доволен.', low: 'Разочарован', high: 'Очень доволен', median: 7 },
      { type: 'text' as const, title: 'Пожелания по дизайну или надписям', hint: 'Опционально. Дизайнер SU:Media читает все ответы.' },
    ] as QStep[],
  },
]

const KEYS = ['A', 'B', 'C', 'D', 'E', 'F']

export default function QuestionnairesPage() {
  const [activeId, setActiveId] = useState('024')
  const [step, setStep] = useState(0)
  const [archived, setArchived] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [answers, setAnswers] = useState<Record<number, number[] | number | string>>({})

  const active = QUESTS.find(q => q.id === activeId)!
  const totalSteps = active.steps.length
  const progress = ((step + 1) / totalSteps) * 100
  const currentStep = active.steps[step]

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

  return (
    <>
      <div className="page-head">
        <div className="title">
          <span className="eyebrow">Опросы студсовета</span>
          <h1>Questionnaires</h1>
          <p className="lead" style={{ fontSize: 14, marginTop: 6 }}>Открытые опросы от SU. Ваш голос помогает планировать ивенты, бюджет и работу департаментов.</p>
        </div>
      </div>

      <div className="q-layout">

        <section>
          <div className="row sb mb-4">
            <h3 style={{ fontSize: 14 }}>Открыто <span className="text-muted text-mono" style={{ fontSize: 11, marginLeft: 4 }}>{QUESTS.length}</span></h3>
            <button className="btn ghost sm" onClick={() => setArchived(v => !v)}>{archived ? 'Скрыть архив' : 'Архив'}</button>
          </div>
          <div className="q-list">
            {QUESTS.map(q => (
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
                  {currentStep.options.map((opt, i) => {
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
                  {currentStep.options.map((opt, i) => {
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

          <div className="q-footer">
            <button className="btn ghost" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>
              <Icon id="i-chevron-l" style={{ width: 14, height: 14 }} />Назад
            </button>
            <div className="row gap-2">
              <button className="btn secondary" onClick={() => { setStep(0); setAnswers({}) }}>Сохранить и выйти</button>
              {step < totalSteps - 1 ? (
                <button className="btn primary" onClick={() => setStep(s => s + 1)}>Далее →</button>
              ) : submitted ? (
                <button className="btn secondary" disabled><Icon id="i-check" style={{ width: 14, height: 14 }} />Ответ отправлен</button>
              ) : (
                <button className="btn primary" onClick={() => setSubmitted(true)}><Icon id="i-check" style={{ width: 14, height: 14 }} />Отправить ответ</button>
              )}
            </div>
          </div>

        </section>
      </div>
    </>
  )
}
