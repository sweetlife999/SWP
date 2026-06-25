import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { api, type Event, type EventPatch, type EventStatus } from '../lib/api'

type EventForm = {
  title: string; desc: string; date: string; time: string
  tag: string; foot: string; footLabel: string; featured: boolean; statusText: string
}

const BLANK: EventForm = {
  title: '', desc: '', date: '', time: '', tag: 'SU:Core', foot: '', footLabel: '', featured: false, statusText: '',
}

const STATUS: Record<string, { label: string; bg: string; fg: string }> = {
  draft:     { label: 'Черновик',    bg: '#F3F4F6', fg: '#6B7280' },
  published: { label: 'Опубликовано', bg: '#DCFCE7', fg: '#15803D' },
  archived:  { label: 'Архив',        bg: '#FEF3C7', fg: '#B45309' },
}

const DEPT_OPTIONS = ['SU:Core', 'SU:Active', 'SU:Media']

function toForm(e: Event): EventForm {
  return {
    title: e.title, desc: e.desc, date: e.date, time: e.time ?? '',
    tag: DEPT_OPTIONS.includes(e.tag) ? e.tag : 'SU:Core',
    foot: e.foot, footLabel: e.footLabel ?? '', featured: !!e.featured, statusText: e.statusText ?? '',
  }
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [toast, setToast] = useState('')
  const [editing, setEditing] = useState<Event | null>(null)
  // /admin/events/new opens the create form directly (US-11 AC2).
  const isNewRoute = useLocation().pathname.endsWith('/new')
  const [creating, setCreating] = useState(isNewRoute)
  const [form, setForm] = useState<EventForm>(BLANK)
  const [busy, setBusy] = useState(false)

  function reload() {
    api.events.adminList()
      .then(d => { setEvents(d); setError(false) })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  useEffect(() => { reload() }, [])

  function showToast(m: string) { setToast(m); setTimeout(() => setToast(''), 3000) }

  function openCreate() { setForm(BLANK); setCreating(true); setEditing(null) }
  function openEdit(e: Event) { setForm(toForm(e)); setEditing(e); setCreating(false) }
  function closeModal() { setCreating(false); setEditing(null) }

  async function submit() {
    setBusy(true)
    try {
      if (creating) {
        // Backend creates a draft; admin publishes it explicitly from the table.
        await api.events.create({
          title: form.title, desc: form.desc, date: form.date,
          dd: '', mm: '', cover: '', tag: form.tag, tagCls: '',
          time: form.time || undefined, foot: form.foot,
          footLabel: form.footLabel || undefined, featured: form.featured,
          statusText: form.statusText || undefined,
        })
        showToast('Черновик создан')
      } else if (editing) {
        const patch: EventPatch = {
          title: form.title, desc: form.desc, date: form.date,
          time: form.time || null, tag: form.tag, foot: form.foot,
          footLabel: form.footLabel || null, featured: form.featured,
          statusText: form.statusText || null,
        }
        await api.events.update(editing.id, patch)
        showToast('Сохранено')
      }
      closeModal()
      reload()
    } catch {
      showToast('Не удалось сохранить мероприятие')
    } finally {
      setBusy(false)
    }
  }

  async function setStatus(e: Event, status: EventStatus) {
    try {
      await api.events.update(e.id, { status })
      showToast(status === 'published' ? 'Опубликовано' : status === 'archived' ? 'В архиве' : 'Снято с публикации')
      reload()
    } catch {
      showToast('Не удалось изменить статус')
    }
  }

  async function remove(e: Event) {
    if (!window.confirm(`Удалить черновик «${e.title}»?`)) return
    try {
      await api.events.remove(e.id)
      showToast('Удалено')
      reload()
    } catch {
      // Backend rejects deleting a published/archived event with 422.
      showToast('Удалять можно только черновики (опубликованное — в архив)')
    }
  }

  const valid = form.title.trim() && form.date

  return (
    <>
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: 'var(--fg)', color: 'var(--bg)', padding: '10px 20px', borderRadius: 8, fontSize: 13, zIndex: 9999, pointerEvents: 'none' }}>
          {toast}
        </div>
      )}

      <div className="page-head">
        <div className="title">
          <span className="eyebrow">Admin · Управление</span>
          <h1>Мероприятия</h1>
          <p className="lead" style={{ fontSize: 14, marginTop: 6 }}>Создание, публикация и архивирование событий студсовета.</p>
        </div>
        <div className="row gap-2">
          <button className="btn primary" onClick={openCreate}>
            <Icon id="i-plus" style={{ width: 14, height: 14 }} />Создать мероприятие
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', padding: '12px 16px', borderRadius: 8, fontSize: 14, marginBottom: 16 }}>
          Не удалось загрузить мероприятия. Войдите как администратор и обновите страницу.
        </div>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>Название</th><th>Дата</th><th>Департамент</th><th>Статус</th><th style={{ textAlign: 'right' }}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {events.map(e => {
            const st = STATUS[String(e.status)] ?? STATUS.draft
            return (
              <tr key={e.id}>
                <td>{e.title}</td>
                <td className="text-mono" style={{ fontSize: 13 }}>{e.date}{e.time ? ` ${e.time}` : ''}</td>
                <td>{e.tag}</td>
                <td>
                  <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: st.bg, color: st.fg }}>{st.label}</span>
                </td>
                <td>
                  <div className="row gap-2" style={{ justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                    <button className="btn secondary sm" onClick={() => openEdit(e)}>Изменить</button>
                    {e.status !== 'published' && (
                      <button className="btn primary sm" onClick={() => setStatus(e, 'published')}>Опубликовать</button>
                    )}
                    {e.status === 'published' && (
                      <button className="btn secondary sm" onClick={() => setStatus(e, 'archived')}>В архив</button>
                    )}
                    {e.status === 'draft' && (
                      <button className="btn danger sm" onClick={() => remove(e)}>Удалить</button>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {events.length === 0 && (
        <p className="text-muted" style={{ padding: '24px 0' }}>
          {error ? 'Ошибка загрузки' : loading ? 'Загрузка…' : 'Мероприятий пока нет — создайте первое.'}
        </p>
      )}

      {(creating || editing) && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="member-modal" onClick={ev => ev.stopPropagation()} style={{ maxWidth: 480 }}>
            <button className="modal-close" onClick={closeModal}><Icon id="i-x" style={{ width: 14, height: 14 }} /></button>
            <div className="member-modal-body" style={{ paddingTop: 24 }}>
              <h3 style={{ marginBottom: 20 }}>{creating ? 'Новое мероприятие' : 'Редактировать мероприятие'}</h3>
              <div className="col gap-3">
                <div className="field">
                  <label>Название</label>
                  <input className="input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                </div>
                <div className="field">
                  <label>Описание</label>
                  <textarea className="textarea" rows={2} value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} />
                </div>
                <div className="row gap-3">
                  <div className="field" style={{ flex: 1 }}>
                    <label>Дата</label>
                    <input className="input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                  </div>
                  <div className="field" style={{ flex: 1 }}>
                    <label>Время</label>
                    <input className="input" type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
                  </div>
                </div>
                <div className="row gap-3">
                  <div className="field" style={{ flex: 1 }}>
                    <label>Департамент</label>
                    <select className="input" value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}>
                      {DEPT_OPTIONS.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="field" style={{ flex: 1 }}>
                    <label>Доп. инфо</label>
                    <input className="input" placeholder="32 участника" value={form.foot} onChange={e => setForm(f => ({ ...f, foot: e.target.value }))} />
                  </div>
                </div>
                <div className="field">
                  <label>Локация</label>
                  <input className="input" placeholder="Sport Tower, 519" value={form.footLabel} onChange={e => setForm(f => ({ ...f, footLabel: e.target.value }))} />
                </div>
                <label className="row gap-2" style={{ alignItems: 'center', fontSize: 14 }}>
                  <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} />
                  Закреплённое (featured)
                </label>
                <div className="row gap-2" style={{ justifyContent: 'flex-end', marginTop: 8 }}>
                  <button className="btn ghost" onClick={closeModal}>Отмена</button>
                  <button className="btn primary" disabled={!valid || busy} onClick={submit}>{busy ? 'Сохранение…' : 'Сохранить'}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
