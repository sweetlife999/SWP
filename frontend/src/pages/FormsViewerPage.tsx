import { useState } from 'react'
import { Icon } from '../components/Icon'

interface Response {
  id: string
  respondent: string
  submitted: string
  q1: string
  q2: string[]
  q3: number
  q4: string
}

const forms = [
  { id: '024', tag: 'SU:Active', tagClass: 'blue', title: 'Программа Summer Days 2026', count: 142 },
  { id: '023', tag: 'SU:Core', tagClass: 'green', title: 'Голосование по бюджету Q3', count: 98 },
  { id: '022', tag: 'SU:Media', tagClass: 'purple', title: 'Мерч студсовета — финальный выбор', count: 76 },
]

const responsesPerForm: Record<string, Response[]> = {
  '024': [
    { id: 'R-1041', respondent: 'Иван Петров · B22-DS-02', submitted: '2026-06-10 14:22', q1: 'Open BBQ у Волги с играми и активностями', q2: ['Гребля на Волге', 'Кино под открытым небом', 'Фотопрогулка на закате'], q3: 7, q4: 'Добавить больше вечерних активностей и зону для настольных игр.' },
    { id: 'R-1042', respondent: 'Анна Смирнова · B23-SE-01', submitted: '2026-06-10 15:03', q1: 'Кино под открытым небом + after-party', q2: ['Stand-up evening', 'Турнир по настольным играм'], q3: 9, q4: 'Хочу больше музыки и поменьше формальных лекций.' },
    { id: 'R-1043', respondent: 'Тимур Карпов · B21-DS-03', submitted: '2026-06-11 09:47', q1: 'Концерт студенческих групп на campus square', q2: ['Гребля на Волге', 'Йога на свежем воздухе'], q3: 5, q4: '—' },
    { id: 'R-1044', respondent: 'Алиса Гордеева · B22-CS-04', submitted: '2026-06-11 18:12', q1: 'Open BBQ у Волги с играми и активностями', q2: ['Кино под открытым небом', 'Фотопрогулка на закате', 'Stand-up evening'], q3: 8, q4: 'Было бы круто сделать зону для квестов вечером.' },
    { id: 'R-1045', respondent: 'Дмитрий Орлов · B24-SE-02', submitted: '2026-06-12 10:30', q1: 'Спортивная олимпиада между корпусами', q2: ['Турнир по настольным играм', 'Гребля на Волге', 'Йога на свежем воздухе'], q3: 6, q4: 'Добавьте больше спортивных активностей днём.' },
  ],
  '023': [
    { id: 'R-0981', respondent: 'Мария Козлова · B22-SE-03', submitted: '2026-06-08 11:15', q1: 'Ивенты и мероприятия', q2: ['Спорт', 'Медиа'], q3: 8, q4: 'Хочется больше денег на оборудование для SU:Media.' },
    { id: 'R-0982', respondent: 'Артём Белов · B23-DS-01', submitted: '2026-06-09 13:40', q1: 'Инфраструктура и IT', q2: ['IT', 'Печать'], q3: 7, q4: '—' },
    { id: 'R-0983', respondent: 'Екатерина Ли · B21-CS-02', submitted: '2026-06-09 17:22', q1: 'Ивенты и мероприятия', q2: ['Ивенты', 'Спорт', 'Медиа'], q3: 9, q4: 'Хакатоны важнее всего — вкладывайте туда.' },
  ],
  '022': [
    { id: 'R-0761', respondent: 'Сергей Фёдоров · B23-SE-02', submitted: '2026-06-05 10:00', q1: 'Футболка с логотипом', q2: ['Белый', 'Чёрный'], q3: 8, q4: 'Хочу оверсайз!' },
    { id: 'R-0762', respondent: 'Лилия Нуриева · B22-DS-04', submitted: '2026-06-06 14:30', q1: 'Худи', q2: ['Зелёный', 'Серый'], q3: 9, q4: 'Обязательно добавьте карман на животе.' },
  ],
}

function downloadCsv(formId: string, responses: Response[]) {
  const headers = ['ID', 'Respondent', 'Submitted', 'Q1', 'Q2', 'Q3', 'Q4']
  const rows = responses.map(r => [r.id, r.respondent, r.submitted, r.q1, r.q2.join('; '), String(r.q3), r.q4])
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`
  const csv = [headers, ...rows].map(row => row.map(escape).join(',')).join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `responses_form_${formId}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function FormsViewerPage() {
  const [activeForm, setActiveForm] = useState('024')

  const activeFormData = forms.find(f => f.id === activeForm)!
  const responses = responsesPerForm[activeForm] ?? []

  return (
    <>

      <div className="page-head">
        <div className="title">
          <span className="eyebrow">Admin · Просмотр ответов</span>
          <h1>Forms Viewer</h1>
          <p className="lead" style={{ fontSize: 14, marginTop: 6 }}>Все полученные ответы по опросам студсовета.</p>
        </div>
        <div className="row gap-2">
          <button className="btn primary" onClick={() => downloadCsv(activeForm, responses)}>
            <Icon id="i-download" style={{ width: 14, height: 14 }} />
            Export as CSV
          </button>
        </div>
      </div>

      <div className="q-layout">

        {/* Left: list of forms */}
        <section>
          <div className="row sb mb-4">
            <h3 style={{ fontSize: 14 }}>Опросы <span className="text-muted text-mono" style={{ fontSize: 11, marginLeft: 4 }}>{forms.length}</span></h3>
          </div>
          <div className="q-list">
            {forms.map(f => (
              <div key={f.id} className={`q-list-card${f.id === activeForm ? ' active' : ''}`} onClick={() => setActiveForm(f.id)} style={{ cursor: 'pointer' }}>
                <div className="meta">
                  <span className={`tag ${f.tagClass}`} style={{ height: 18, fontSize: 10, padding: '0 6px' }}>{f.tag}</span>
                  <span>Опрос #{f.id}</span>
                </div>
                <h4>{f.title}</h4>
                <div className="foot">
                  <span className="pill-time">{f.count} ответов</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right: responses table */}
        <section className="q-flow">
          <header className="q-flow-head">
            <div className="topbar">
              <div>
                <span className="eyebrow" style={{ color: 'var(--accent-700)' }}>Опрос #{activeForm} · responses</span>
                <h2 style={{ marginTop: 6 }}>{activeFormData.title}</h2>
              </div>
              <div className="row gap-2">
                <span className="tag outline"><Icon id="i-users" style={{ width: 11, height: 11 }} />{responses.length} answers</span>
              </div>
            </div>
          </header>

          <div className="q-body" style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Respondent / Респондент</th>
                  <th>Submitted</th>
                  <th>Q1 · Формат открытия</th>
                  <th>Q2 · Активности</th>
                  <th>Q3 · Шкала (1–10)</th>
                  <th>Q4 · Комментарий</th>
                </tr>
              </thead>
              <tbody>
                {responses.map(r => (
                  <tr key={r.id}>
                    <td className="text-mono" style={{ fontSize: 12 }}>{r.id}</td>
                    <td>{r.respondent}</td>
                    <td className="text-mono text-muted" style={{ fontSize: 12 }}>{r.submitted}</td>
                    <td>{r.q1}</td>
                    <td>
                      <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
                        {r.q2.map((opt, i) => (
                          <span key={i} className="tag outline" style={{ height: 18, fontSize: 10, padding: '0 6px' }}>{opt}</span>
                        ))}
                      </div>
                    </td>
                    <td className="text-mono" style={{ fontSize: 13, fontWeight: 600 }}>{r.q3} / 10</td>
                    <td style={{ maxWidth: 260 }}>{r.q4}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </>
  )
}
