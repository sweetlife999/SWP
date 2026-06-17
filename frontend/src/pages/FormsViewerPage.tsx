import { useState, useEffect } from 'react'
import { Icon } from '../components/Icon'
import { api, type Form } from '../lib/api'

export default function FormsViewerPage() {
  const [forms, setForms] = useState<Form[]>([])
  const [activeForm, setActiveForm] = useState<string | null>(null)
  const [responses, setResponses] = useState<Record<string, string>[]>([])

  useEffect(() => {
    api.admin.forms.list().then(data => {
      setForms(data)
      if (data.length > 0) setActiveForm(data[0].id)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!activeForm) return
    api.admin.forms.responses(activeForm).then(data => {
      setResponses(data as Record<string, string>[])
    }).catch(() => { setResponses([]) })
  }, [activeForm])

  const activeFormData = forms.find(f => f.id === activeForm)

  const columns = responses.length > 0 ? Object.keys(responses[0]) : []

  function exportCsv() {
    if (!responses.length) return
    const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`
    const csv = [columns, ...responses.map(r => columns.map(k => r[k] ?? ''))].map(row => row.map(escape).join(',')).join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `responses_form_${activeForm}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <div className="page-head">
        <div className="title">
          <span className="eyebrow">Admin · Просмотр ответов</span>
          <h1>Forms Viewer</h1>
          <p className="lead" style={{ fontSize: 14, marginTop: 6 }}>Все полученные ответы по опросам студсовета.</p>
        </div>
        <div className="row gap-2">
          <button className="btn primary" onClick={exportCsv} disabled={!responses.length}>
            <Icon id="i-download" style={{ width: 14, height: 14 }} />
            Export as CSV
          </button>
        </div>
      </div>

      <div className="q-layout">
        <section>
          <div className="row sb mb-4">
            <h3 style={{ fontSize: 14 }}>Опросы <span className="text-muted text-mono" style={{ fontSize: 11, marginLeft: 4 }}>{forms.length}</span></h3>
          </div>
          <div className="q-list">
            {forms.length === 0 && (
              <p className="text-muted" style={{ fontSize: 13, padding: '12px 0' }}>Загрузка…</p>
            )}
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

        <section className="q-flow">
          <header className="q-flow-head">
            <div className="topbar">
              <div>
                <span className="eyebrow" style={{ color: 'var(--accent-700)' }}>Опрос #{activeForm} · responses</span>
                <h2 style={{ marginTop: 6 }}>{activeFormData?.title ?? '—'}</h2>
              </div>
              <div className="row gap-2">
                <span className="tag outline"><Icon id="i-users" style={{ width: 11, height: 11 }} />{responses.length} answers</span>
              </div>
            </div>
          </header>

          <div className="q-body" style={{ overflowX: 'auto' }}>
            {responses.length === 0 ? (
              <p className="text-muted" style={{ padding: '24px 16px', fontSize: 13 }}>
                {forms.length === 0 ? 'Загрузка…' : 'Нет ответов'}
              </p>
            ) : (
              <table className="table">
                <thead>
                  <tr>{columns.map(c => <th key={c}>{c}</th>)}</tr>
                </thead>
                <tbody>
                  {responses.map((r, i) => (
                    <tr key={i}>
                      {columns.map(c => <td key={c}>{String(r[c] ?? '')}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </>
  )
}
