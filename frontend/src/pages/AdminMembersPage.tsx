import { useState, useEffect } from 'react'
import { Icon } from '../components/Icon'
import { api, type Member, type MemberPatch } from '../lib/api'

type Dep = Member['dep']
type MemberForm = { dep: Dep; name: string; role: string; meta: string; bio: string; recent: string[]; photo_url: string }

const BLANK: MemberForm = { dep: 'core', name: '', role: '', meta: '', bio: '', recent: ['', '', ''], photo_url: '' }
const DEP_TAG: Record<Dep, string> = { core: 'SU:Core', active: 'SU:Active', media: 'SU:Media' }

function toForm(m: Member): MemberForm {
  return { dep: m.dep, name: m.name, role: m.role, meta: m.meta, bio: m.bio, recent: [...m.recent, '', '', ''].slice(0, 3), photo_url: m.photo_url ?? '' }
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [toast, setToast] = useState('')
  const [editing, setEditing] = useState<Member | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<MemberForm>(BLANK)
  const [busy, setBusy] = useState(false)

  function reload() {
    api.members.list()
      .then(d => { setMembers(d); setError(false) })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  useEffect(() => { reload() }, [])

  function showToast(m: string) { setToast(m); setTimeout(() => setToast(''), 3000) }

  function openCreate() { setForm(BLANK); setCreating(true); setEditing(null) }
  function openEdit(m: Member) { setForm(toForm(m)); setEditing(m); setCreating(false) }
  function closeModal() { setCreating(false); setEditing(null) }

  async function submit() {
    setBusy(true)
    const recent = form.recent.filter(Boolean)
    try {
      if (creating) {
        await api.members.create({ dep: form.dep, tag: DEP_TAG[form.dep], name: form.name, role: form.role, meta: form.meta, bio: form.bio, recent, photo_url: form.photo_url })
        showToast('Участник добавлен')
      } else if (editing) {
        const patch: MemberPatch = { dep: form.dep, name: form.name, role: form.role, meta: form.meta, bio: form.bio, recent, photo_url: form.photo_url }
        await api.members.update(editing.id, patch)
        showToast('Сохранено')
      }
      closeModal()
      reload()
    } catch {
      showToast('Не удалось сохранить участника')
    } finally {
      setBusy(false)
    }
  }

  async function remove(m: Member) {
    if (!window.confirm(`Удалить участника «${m.name}»? Действие нельзя отменить.`)) return
    try {
      await api.members.remove(m.id)
      showToast('Участник удалён')
      reload()
    } catch {
      showToast('Не удалось удалить участника')
    }
  }

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
          <h1>Участники</h1>
          <p className="lead" style={{ fontSize: 14, marginTop: 6 }}>Состав студсовета: добавление, редактирование, удаление профилей.</p>
        </div>
        <div className="row gap-2">
          <button className="btn primary" onClick={openCreate}>
            <Icon id="i-plus" style={{ width: 14, height: 14 }} />Добавить участника
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', padding: '12px 16px', borderRadius: 8, fontSize: 14, marginBottom: 16 }}>
          Не удалось загрузить участников. Войдите как администратор и обновите страницу.
        </div>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>Имя</th><th>Департамент</th><th>Роль</th><th style={{ textAlign: 'right' }}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {members.map(m => (
            <tr key={m.id}>
              <td>{m.name}</td>
              <td>{DEP_TAG[m.dep]}</td>
              <td className="text-muted">{m.role}</td>
              <td>
                <div className="row gap-2" style={{ justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                  <button className="btn secondary sm" onClick={() => openEdit(m)}>Изменить</button>
                  <button className="btn danger sm" onClick={() => remove(m)}>Удалить</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {members.length === 0 && (
        <p className="text-muted" style={{ padding: '24px 0' }}>
          {error ? 'Ошибка загрузки' : loading ? 'Загрузка…' : 'Участников пока нет — добавьте первого.'}
        </p>
      )}

      {(creating || editing) && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="member-modal" onClick={ev => ev.stopPropagation()} style={{ maxWidth: 480 }}>
            <button className="modal-close" onClick={closeModal}><Icon id="i-x" style={{ width: 14, height: 14 }} /></button>
            <div className="member-modal-body" style={{ paddingTop: 24 }}>
              <h3 style={{ marginBottom: 20 }}>{creating ? 'Новый участник' : 'Редактировать участника'}</h3>
              <div className="col gap-3">
                <div className="field">
                  <label>Департамент</label>
                  <select className="input" value={form.dep} onChange={e => setForm(f => ({ ...f, dep: e.target.value as Dep }))}>
                    <option value="core">SU:Core</option>
                    <option value="active">SU:Active</option>
                    <option value="media">SU:Media</option>
                  </select>
                </div>
                <div className="field">
                  <label>Имя</label>
                  <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="field">
                  <label>Роль</label>
                  <input className="input" placeholder="CO-LEAD · B21-AI" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
                </div>
                <div className="field">
                  <label>Meta</label>
                  <input className="input" placeholder="2 года в SU" value={form.meta} onChange={e => setForm(f => ({ ...f, meta: e.target.value }))} />
                </div>
                <div className="field">
                  <label>Bio</label>
                  <textarea className="textarea" rows={2} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
                </div>
                <div className="field">
                  <label>Фото (URL)</label>
                  <input className="input" placeholder="https://…/photo.jpg" value={form.photo_url} onChange={e => setForm(f => ({ ...f, photo_url: e.target.value }))} />
                  {form.photo_url && (
                    <img src={form.photo_url} alt="" style={{ marginTop: 8, width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }} onError={e => { (e.currentTarget.style.display = 'none') }} />
                  )}
                </div>
                <div className="field">
                  <label>Последние активности (до 3)</label>
                  {[0, 1, 2].map(i => (
                    <input key={i} className="input" style={{ marginBottom: 6 }} placeholder={`Активность ${i + 1}…`} value={form.recent[i] ?? ''} onChange={e => setForm(f => { const r = [...f.recent]; r[i] = e.target.value; return { ...f, recent: r } })} />
                  ))}
                </div>
                <div className="row gap-2" style={{ justifyContent: 'flex-end', marginTop: 8 }}>
                  <button className="btn ghost" onClick={closeModal}>Отмена</button>
                  <button className="btn primary" disabled={!form.name.trim() || busy} onClick={submit}>{busy ? 'Сохранение…' : 'Сохранить'}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
