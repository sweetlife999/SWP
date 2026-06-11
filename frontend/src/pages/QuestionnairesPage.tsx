import { useState } from 'react'
import { Icon } from '../components/Icon'

export default function QuestionnairesPage() {
  const [step, setStep] = useState(0)
  const [scaleVal, setScaleVal] = useState(7)
  const totalSteps = 4

  const progress = ((step + 1) / totalSteps) * 100

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

        {/* Left: list of questionnaires */}
        <section>
          <div className="row sb mb-4">
            <h3 style={{ fontSize: 14 }}>Открыто <span className="text-muted text-mono" style={{ fontSize: 11, marginLeft: 4 }}>3</span></h3>
            <button className="btn ghost sm">Архив</button>
          </div>
          <div className="q-list">

            <div className="q-list-card active">
              <div className="meta">
                <span className="tag blue" style={{ height: 18, fontSize: 10, padding: '0 6px' }}>SU:Active</span>
                <span>Опрос #024</span>
              </div>
              <h4>Программа Summer Days 2026 — какие активности добавить</h4>
              <p className="desc">8 вопросов · ваш ответ повлияет на финальную программу с 20 июня по 5 июля.</p>
              <div className="foot">
                <span className="pill-time">2 МИН</span>
                <span>×</span>
                <span>осталось 4 дня</span>
                <span style={{ marginLeft: 'auto', color: 'var(--accent-700)' }}>▶ Сейчас открыт</span>
              </div>
            </div>

            <div className="q-list-card">
              <div className="meta">
                <span className="tag green" style={{ height: 18, fontSize: 10, padding: '0 6px' }}>SU:Core</span>
                <span>Опрос #023</span>
              </div>
              <h4>Голосование по бюджету Q3</h4>
              <p className="desc">5 вопросов · распределение ₽ 380,000 по направлениям студсовета на третий квартал.</p>
              <div className="foot">
                <span className="pill-time">3 МИН</span>
                <span>×</span>
                <span>осталось 9 дней</span>
              </div>
            </div>

            <div className="q-list-card">
              <div className="meta">
                <span className="tag purple" style={{ height: 18, fontSize: 10, padding: '0 6px' }}>SU:Media</span>
                <span>Опрос #022</span>
              </div>
              <h4>Мерч студсовета — финальный выбор</h4>
              <p className="desc">4 вопроса · какой мерч хотите видеть в осенней коллекции.</p>
              <div className="foot">
                <span className="pill-time ending">1 МИН</span>
                <span>×</span>
                <span>осталось 16 часов</span>
              </div>
            </div>

          </div>

          <div className="row sb mt-6" style={{ padding: '14px 16px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', fontSize: 12, color: 'var(--muted)' }}>
            <div>
              <div style={{ color: 'var(--fg)', fontWeight: 500, marginBottom: 2 }}>Пройдено вами</div>
              <span>9 из 24 за всё время</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 600, color: 'var(--accent-700)' }}>38%</div>
          </div>
        </section>

        {/* Right: active questionnaire flow */}
        <section className="q-flow">

          <header className="q-flow-head">
            <div className="topbar">
              <div>
                <span className="eyebrow" style={{ color: 'var(--accent-700)' }}>SU:Active · опрос #024</span>
                <h2 style={{ marginTop: 6 }}>Программа Summer Days 2026</h2>
              </div>
              <div className="row gap-2">
                <span className="tag outline"><Icon id="i-clock" style={{ width: 11, height: 11 }} />2 мин</span>
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

            {/* Step 1: single choice */}
            {step === 0 && (
              <div className="q-step">
                <div className="num">Вопрос 01 · одиночный выбор</div>
                <h3>Какой формат открытия Summer Days вам ближе?</h3>
                <p className="hint">Выберите один вариант. От ответов SU:Active соберёт финальную программу первого дня.</p>
                <div className="col gap-3">
                  {[
                    { key: 'A', text: 'Концерт студенческих групп на campus square' },
                    { key: 'B', text: 'Open BBQ у Волги с играми и активностями', selected: true },
                    { key: 'C', text: 'Кино под открытым небом + after-party' },
                    { key: 'D', text: 'Спортивная олимпиада между корпусами' },
                  ].map(opt => (
                    <div key={opt.key} className={`opt-card${opt.selected ? ' selected' : ''}`}>
                      <span className="opt-key">{opt.key}</span>
                      <span className="opt-text">{opt.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: multi-choice */}
            {step === 1 && (
              <div className="q-step">
                <div className="num">Вопрос 02 · множественный выбор</div>
                <h3>Какие активности обязательно должны быть в программе?</h3>
                <p className="hint">Выберите до 4 вариантов. Учитываем при планировании конкретных дней.</p>
                <div className="col gap-3">
                  {[
                    { text: 'Гребля на Волге', checked: true },
                    { text: 'Кино под открытым небом', checked: true },
                    { text: 'Турнир по настольным играм', checked: false },
                    { text: 'Stand-up evening', checked: false },
                    { text: 'Фотопрогулка на закате', checked: true },
                    { text: 'Йога на свежем воздухе', checked: false },
                  ].map((opt, i) => (
                    <div key={i} className={`opt-card${opt.checked ? ' selected' : ''}`}>
                      <span className="opt-key">
                        {opt.checked && <Icon id="i-check" style={{ width: 12, height: 12, color: '#fff' }} />}
                      </span>
                      <span className="opt-text">{opt.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: scale */}
            {step === 2 && (
              <div className="q-step">
                <div className="num">Вопрос 03 · шкала 1–10</div>
                <h3>Насколько вам важно, чтобы события были вечерние (после 18:00)?</h3>
                <p className="hint">Помогает спланировать слоты, чтобы не пересекаться с лекциями и работой.</p>
                <div className="scale-row">
                  <div className="scale-cell label-cell">Не важно</div>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                    <div
                      key={n}
                      className={`scale-cell${scaleVal === n ? ' active' : ''}`}
                      onClick={() => setScaleVal(n)}
                    >{n}</div>
                  ))}
                  <div className="scale-cell label-cell" style={{ justifyContent: 'flex-end', textAlign: 'right' }}>Критично</div>
                </div>
                <div className="row sb mt-6" style={{ padding: 16, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', fontSize: 13, color: 'var(--muted)' }}>
                  <span>Ваш ответ: <b style={{ color: 'var(--fg)' }}>{scaleVal} / 10</b> — скорее важно</span>
                  <span className="text-mono" style={{ fontSize: 11, letterSpacing: '0.04em' }}>МЕДИАНА ПО ОПРОСУ: 8</span>
                </div>
              </div>
            )}

            {/* Step 4: open text */}
            {step === 3 && (
              <div className="q-step">
                <div className="num">Вопрос 04 · текстовый ответ</div>
                <h3>Что вы добавили бы или поменяли в формате Summer Days?</h3>
                <p className="hint">Опционально. SU:Active читает все ответы вручную.</p>
                <textarea className="textarea" placeholder="Напишите свободно. Если есть конкретная идея, опишите место и формат — это поможет нам быстрее реализовать." style={{ minHeight: 160, fontSize: 15 }}></textarea>
                <div className="row sb mt-4" style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
                  <span>0 / 1500 символов</span>
                  <label className="checkbox" style={{ fontSize: 12, fontFamily: 'var(--font-sans)' }}>
                    <input type="checkbox" />
                    <span className="box"><Icon id="i-check" style={{ width: 12, height: 12, color: '#fff' }} /></span>
                    Готов(а) обсудить идею голосом
                  </label>
                </div>
              </div>
            )}

          </div>

          <div className="q-footer">
            <button
              className="btn ghost"
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              <Icon id="i-chevron-l" style={{ width: 14, height: 14 }} />Назад
            </button>
            <div className="row gap-2">
              <button className="btn secondary">Сохранить и выйти</button>
              {step < totalSteps - 1 ? (
                <button className="btn primary" onClick={() => setStep(s => s + 1)}>Next →</button>
              ) : (
                <button className="btn primary"><Icon id="i-check" style={{ width: 14, height: 14 }} />Отправить ответ</button>
              )}
            </div>
          </div>

        </section>

      </div>
    </>
  )
}
