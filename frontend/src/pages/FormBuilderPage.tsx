import { useState } from 'react'
import { Icon } from '../components/Icon'

export default function FormBuilderPage() {
  const [preview, setPreview] = useState(false)

  return (
    <>

      <div className="page-head">
        <div className="title">
          <div className="row gap-2 mb-2">
            <span className="tag green"><span className="dot"></span>Черновик</span>
            <span className="tag outline"><Icon id="i-clock" style={{ width: 11, height: 11 }} />автосохранение 12 сек назад</span>
          </div>
          <h1>Конструктор опроса</h1>
        </div>
        <div className="row gap-2">
          <button className="btn ghost" onClick={() => setPreview(p => !p)}>
            <Icon id="i-eye" style={{ width: 14, height: 14 }} />
            {preview ? 'Редактировать' : 'Preview'}
          </button>
          <button className="btn secondary">Сохранить как черновик</button>
          <button className="btn primary"><Icon id="i-rocket" style={{ width: 14, height: 14 }} />Опубликовать</button>
        </div>
      </div>

      <div className="builder-toolbar">
        <span className="stat-pill"><Icon id="i-clipboard" style={{ width: 12, height: 12 }} />4 вопроса</span>
        <span className="stat-pill"><Icon id="i-clock" style={{ width: 12, height: 12 }} />~ 2 мин</span>
        <span className="stat-pill"><Icon id="i-users" style={{ width: 12, height: 12 }} />видит: All students</span>
      </div>

      <div className={`builder-layout${preview ? ' preview-on' : ''}`}>

        {/* Palette */}
        <aside className="palette">
          <h4>Типы вопросов</h4>
          <div className="pal-list">
            <button className="pal-item"><Icon id="i-text" className="ic" />Короткий ответ</button>
            <button className="pal-item"><Icon id="i-list" className="ic" />Длинный текст</button>
            <button className="pal-item"><Icon id="i-circle" className="ic" />Один из вариантов</button>
            <button className="pal-item"><Icon id="i-square" className="ic" />Несколько вариантов</button>
            <button className="pal-item"><Icon id="i-scale" className="ic" />Шкала 1–10</button>
            <button className="pal-item"><Icon id="i-star" className="ic" />Звёзды 1–5</button>
          </div>
          <div className="pal-divider"></div>
          <h4>Логика</h4>
          <div className="pal-list">
            <button className="pal-item"><Icon id="i-share" className="ic" />Условный переход</button>
            <button className="pal-item"><Icon id="i-grid" className="ic" />Секция / разделитель</button>
          </div>
        </aside>

        {/* Canvas */}
        <section className="canvas">
          <header className="form-head">
            <div className="badge-row">
              <span className="tag green" style={{ height: 18, fontSize: 10, padding: '0 6px' }}>SU:Core</span>
              <span>ОПРОС #025 · ЧЕРНОВИК</span>
            </div>
            <input className="form-title" defaultValue="Фидбек Welcome Week 2026" />
            <textarea className="form-desc" defaultValue="Помогите оценить программу Welcome Week и понять, что улучшить к следующему набору. Опрос анонимный, 4 вопроса, около 2 минут." />
          </header>

          <div className="questions-list">

            {/* Q1: scale */}
            <article className="question">
              <header className="q-head">
                <span className="grip"><Icon id="i-grip" style={{ width: 14, height: 14 }} /></span>
                <span className="type-tag"><Icon id="i-scale" style={{ width: 11, height: 11 }} />Шкала 1–10</span>
                <span className="text-mono text-muted" style={{ fontSize: 11 }}>01</span>
                <div className="q-actions">
                  <button className="icon-btn"><Icon id="i-copy" /></button>
                  <button className="icon-btn"><Icon id="i-trash" /></button>
                </div>
              </header>
              <div className="q-body">
                <input className="q-title-input" defaultValue="Насколько полезной была Welcome Week в целом?" />
                <input className="q-hint-input" defaultValue="1 — совсем бесполезно, 10 — изменило, как я смотрю на университет" />
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                  <div style={{ flexShrink: 0, color: 'var(--muted)', fontSize: 11, fontFamily: 'var(--font-mono)', minWidth: 60, display: 'grid', placeItems: 'start center', letterSpacing: '0.04em' }}>НЕ ПОЛЕЗНО</div>
                  <div style={{ flex: 1, display: 'flex', gap: 4 }}>
                    {[1,2,3,4,5,6,7,8,9,10].map(n => (
                      <div key={n} style={{ flex: 1, height: 40, border: '1px solid var(--border)', borderRadius: 6, display: 'grid', placeItems: 'center', fontSize: 13, color: 'var(--muted)' }}>{n}</div>
                    ))}
                  </div>
                  <div style={{ flexShrink: 0, color: 'var(--muted)', fontSize: 11, fontFamily: 'var(--font-mono)', minWidth: 60, display: 'grid', placeItems: 'start center', letterSpacing: '0.04em' }}>ОЧЕНЬ</div>
                </div>
              </div>
              <footer className="q-footer">
                <label className="switch required-toggle">
                  <input type="checkbox" defaultChecked /><span className="track"></span><span>Обязательный</span>
                </label>
                <div className="row gap-3"><span>Логика: нет</span></div>
              </footer>
            </article>

            {/* Q2: multi */}
            <article className="question">
              <header className="q-head">
                <span className="grip"><Icon id="i-grip" style={{ width: 14, height: 14 }} /></span>
                <span className="type-tag"><Icon id="i-square" style={{ width: 11, height: 11 }} />Несколько вариантов</span>
                <span className="text-mono text-muted" style={{ fontSize: 11 }}>02</span>
                <div className="q-actions">
                  <button className="icon-btn"><Icon id="i-copy" /></button>
                  <button className="icon-btn"><Icon id="i-trash" /></button>
                </div>
              </header>
              <div className="q-body">
                <input className="q-title-input" defaultValue="Какие события Welcome Week запомнились?" />
                <input className="q-hint-input" defaultValue="Можно выбрать несколько" />
                <div style={{ marginTop: 6 }}>
                  {[
                    'Гид по корпусам с тимуром карповым',
                    'Вечер знакомств в Sport Tower',
                    'Лекция «Как устроен IU за пределами лекций»',
                    'Ярмарка клубов и кружков',
                  ].map((opt, i) => (
                    <div key={i} className="opt-row checkbox">
                      <span className="opt-dot"></span>
                      <input className="opt-input" defaultValue={opt} />
                      <button className="icon-btn"><Icon id="i-x" /></button>
                    </div>
                  ))}
                  <div className="opt-row checkbox">
                    <span className="opt-dot"></span>
                    <input className="opt-input" placeholder="Другой ответ…" />
                    <button className="icon-btn"><Icon id="i-x" /></button>
                  </div>
                </div>
                <button className="q-add-option"><Icon id="i-plus" />Добавить вариант</button>
              </div>
              <footer className="q-footer">
                <label className="switch required-toggle">
                  <input type="checkbox" /><span className="track"></span><span>Обязательный</span>
                </label>
                <div className="row gap-3"><span>Макс. 3 ответа</span></div>
              </footer>
            </article>

            {/* Q3: single radio */}
            <article className="question">
              <header className="q-head">
                <span className="grip"><Icon id="i-grip" style={{ width: 14, height: 14 }} /></span>
                <span className="type-tag"><Icon id="i-circle" style={{ width: 11, height: 11 }} />Один из вариантов</span>
                <span className="text-mono text-muted" style={{ fontSize: 11 }}>03</span>
                <div className="q-actions">
                  <button className="icon-btn"><Icon id="i-copy" /></button>
                  <button className="icon-btn"><Icon id="i-trash" /></button>
                </div>
              </header>
              <div className="q-body">
                <input className="q-title-input" defaultValue="Хотели бы вы помочь со следующей Welcome Week?" />
                <div style={{ marginTop: 8 }}>
                  {[
                    'Да, готов(а) быть buddy для первого курса',
                    'Да, помогу с логистикой / точечно',
                    'Не уверен(а), нужно подумать',
                    'Нет, спасибо',
                  ].map((opt, i) => (
                    <div key={i} className="opt-row">
                      <span className="opt-dot"></span>
                      <input className="opt-input" defaultValue={opt} />
                      <button className="icon-btn"><Icon id="i-x" /></button>
                    </div>
                  ))}
                </div>
                <button className="q-add-option"><Icon id="i-plus" />Добавить вариант</button>
              </div>
              <footer className="q-footer">
                <label className="switch required-toggle">
                  <input type="checkbox" defaultChecked /><span className="track"></span><span>Обязательный</span>
                </label>
                <span style={{ color: 'var(--accent-700)', fontWeight: 500 }}>
                  <Icon id="i-share" style={{ width: 11, height: 11 }} /> При «Да, готов(а)» → показать Q5
                </span>
              </footer>
            </article>

            {/* Q4: long text */}
            <article className="question">
              <header className="q-head">
                <span className="grip"><Icon id="i-grip" style={{ width: 14, height: 14 }} /></span>
                <span className="type-tag"><Icon id="i-list" style={{ width: 11, height: 11 }} />Длинный текст</span>
                <span className="text-mono text-muted" style={{ fontSize: 11 }}>04</span>
                <div className="q-actions">
                  <button className="icon-btn"><Icon id="i-copy" /></button>
                  <button className="icon-btn"><Icon id="i-trash" /></button>
                </div>
              </header>
              <div className="q-body">
                <input className="q-title-input" defaultValue="Что обязательно нужно поменять / убрать?" />
                <input className="q-hint-input" defaultValue="Конкретные пожелания и идеи. Ответ читают вручную." />
                <textarea className="textarea" placeholder="Ответ респондента появится здесь…" style={{ background: 'var(--surface-2)', border: '1px dashed var(--border)', minHeight: 80, fontStyle: 'italic', color: 'var(--muted)' }} defaultValue="Placeholder respondent text…" />
              </div>
              <footer className="q-footer">
                <label className="switch required-toggle">
                  <input type="checkbox" /><span className="track"></span><span>Обязательный</span>
                </label>
                <span>Макс. 1500 символов</span>
              </footer>
            </article>

          </div>

          <div className="add-bar">
            Добавить вопрос:
            <button>+ Один вариант</button>
            <button>+ Несколько</button>
            <button>+ Шкала</button>
            <button>+ Текст</button>
          </div>

        </section>

        {/* Settings */}
        <aside className="builder-settings">

          <div className="settings-card">
            <h4><Icon id="i-shield" className="ic" />Доступ</h4>
            <div className="row sb"><span>Открыт для</span><span className="text-mono" style={{ fontSize: 12 }}>All students</span></div>
            <div className="row sb"><span>Анонимные ответы</span><label className="switch"><input type="checkbox" defaultChecked /><span className="track"></span></label></div>
            <div className="row sb"><span>1 ответ на студента</span><label className="switch"><input type="checkbox" defaultChecked /><span className="track"></span></label></div>
            <div className="row sb"><span>Виден в IU Connect</span><label className="switch"><input type="checkbox" /><span className="track"></span></label></div>
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
            <button className="btn">Экспорт в .xlsx</button>
          </div>

        </aside>

      </div>
    </>
  )
}
