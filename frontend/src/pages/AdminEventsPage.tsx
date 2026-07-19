import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { PhotoUpload } from '../components/PhotoUpload'
import { api, type Event, type EventPatch, type EventStatus } from '../lib/api'
import { useModalA11y, MODAL_A11Y_PROPS } from '../hooks/useModalA11y'
import { DEPT_LABEL } from '../lib/departments'

type EventForm = {
  title: string; desc: string; date: string; time: string
  tag: string; foot: string; featured: boolean; statusText: string; photo_url: string
}

const BLANK: EventForm = {
  title: '', desc: '', date: '', time: '', tag: DEPT_LABEL.core, foot: '', featured: false, statusText: '', photo_url: '',
}

const STATUS: Record<string, { label: string; bg: string; fg: string }> = {
  draft:     { label: 'Черновик',    bg: '#F3F4F6', fg: '#6B7280' },
  published: { label: 'Опубликовано', bg: '#DCFCE7', fg: '#15803D' },
  archived:  { label: 'Архив',        bg: '#FEF3C7', fg: '#B45309' },
}

// Events are only run by these three departments — SU:Support is intentionally excluded.
const DEPT_OPTIONS = [DEPT_LABEL.core, DEPT_LABEL.active, DEPT_LABEL.media]

function toForm(e: Event): EventForm {
  return {
    title: e.title, desc: e.desc, date: e.date, time: e.time ?? '',
    tag: DEPT_OPTIONS.includes(e.tag) ? e.tag : DEPT_LABEL.core,
    foot: e.foot, featured: !!e.featured, statusText: e.statusText ?? '',
    photo_url: e.photo_url ?? '',
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
  const dialogRef = useModalA11y(Boolean(creating || editing), closeModal)

  async function submit() {
    setBusy(true)
    try {
      if (creating) {
        // Backend creates a draft; admin publishes it explicitly from the table.
        await api.events.create({
          title: form.title, desc: form.desc, date: form.date,
          dd: '', mm: '', cover: '', photo_url: form.photo_url, tag: form.tag, tagCls: '',
          time: form.time || undefined, foot: form.foot,
          featured: form.featured,
          statusText: form.statusText || undefined,
        })
        showToast('Черновик создан')
      } else if (editing) {
        const patch: EventPatch = {
          title: form.title, desc: form.desc, date: form.date,
          time: form.time || null, tag: form.tag, foot: form.foot,
          featured: form.featured, photo_url: form.photo_url,
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
        <div role="alert" style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', padding: '12px 16px', borderRadius: 8, fontSize: 14, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span>Не удалось загрузить мероприятия. Войдите как администратор и обновите страницу.</span>
          <a className="btn secondary sm" href="#/admin/login">Войти</a>
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
          <div
            className="member-modal"
            onClick={ev => ev.stopPropagation()}
            style={{ maxWidth: 480 }}
            ref={dialogRef}
            {...MODAL_A11Y_PROPS}
            aria-label={creating ? 'Новое мероприятие' : 'Редактировать мероприятие'}
          >
            <button className="modal-close" onClick={closeModal} aria-label="Закрыть"><Icon id="i-x" style={{ width: 14, height: 14 }} /></button>
            <div className="member-modal-body" style={{ paddingTop: 24, textAlign: 'left' }}>
              <h3 style={{ marginBottom: 20 }}>{creating ? 'Новое мероприятие' : 'Редактировать мероприятие'}</h3>
              <div className="col gap-3">
                <div className="field">
                  <label htmlFor="ev-title">Название</label>
                  <input id="ev-title" className="input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                </div>
                <div className="field">
                  <label htmlFor="ev-desc">Описание</label>
                  <textarea id="ev-desc" className="textarea" rows={2} value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} />
                </div>
                <div className="field">
                  <label id="ev-photo-label">Фото</label>
                  <PhotoUpload value={form.photo_url} onChange={v => setForm(f => ({ ...f, photo_url: v }))} onError={showToast} />
                </div>
                <div className="row gap-3">
                  <div className="field" style={{ flex: 1 }}>
                    <label htmlFor="ev-date">Дата</label>
                    <input id="ev-date" className="input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                  </div>
                  <div className="field" style={{ flex: 1 }}>
                    <label htmlFor="ev-time">Время</label>
                    <input id="ev-time" className="input" type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
                  </div>
                </div>
                <div className="row gap-3">
                  <div className="field" style={{ flex: 1 }}>
                    <label htmlFor="ev-tag">Департамент</label>
                    <select id="ev-tag" className="input" value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}>
                      {DEPT_OPTIONS.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="field" style={{ flex: 1 }}>
                    <label htmlFor="ev-foot">Доп. инфо</label>
                    <input id="ev-foot" className="input" placeholder="32 участника" value={form.foot} onChange={e => setForm(f => ({ ...f, foot: e.target.value }))} />
                  </div>
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
