import { useState, useEffect } from 'react'
import { Icon } from '../components/Icon'
import { PhotoUpload } from '../components/PhotoUpload'
import { api, type Member, type MemberPatch } from '../lib/api'

type Dep = Member['dep']
type MemberForm = {
  dep: Dep; name: string; role: string; meta: string; bio: string
  recent: string[]; photo_url: string; is_active: boolean
}

const BLANK: MemberForm = {
  dep: 'core', name: '', role: '', meta: '', bio: '',
  recent: ['', '', ''], photo_url: '', is_active: true,
}
const DEP_TAG: Record<Dep, string> = { core: 'SU:Core', active: 'SU:Active', media: 'SU:Media' }
const DEPS: Dep[] = ['core', 'active', 'media']

function toForm(m: Member): MemberForm {
  return {
    dep: m.dep, name: m.name, role: m.role, meta: m.meta, bio: m.bio,
    recent: [...m.recent, '', '', ''].slice(0, 3),
    photo_url: m.photo_url ?? '',
    is_active: m.is_active !== false,
  }
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
        const patch: MemberPatch = { dep: form.dep, name: form.name, role: form.role, meta: form.meta, bio: form.bio, recent, photo_url: form.photo_url, is_active: form.is_active }
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

  return (
    <>
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: 'var(--fg)', color: 'var(--bg)', padding: '10px 20px', borderRadius: 8, fontSize: 13, zIndex: 9999, pointerEvents: 'none' }}>
          {toast}
        </div>
      )}

      <div className="page-head">
        <div className="title">
          <span className="eyebrow">Admin</span>
          <h1>Manage members</h1>
        </div>
        <button className="btn primary" onClick={openCreate}>
          <Icon id="i-plus" style={{ width: 14, height: 14 }} />Добавить участника
        </button>
      </div>

      {error && (
        <div role="alert" style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', padding: '12px 16px', borderRadius: 8, fontSize: 14, marginBottom: 16 }}>
          Не удалось загрузить участников.
        </div>
      )}

      {loading && <p className="text-muted">Загрузка…</p>}

      {!loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, marginTop: 8 }}>
          {DEPS.map(dep => {
            const group = members.filter(m => m.dep === dep)
            return (
              <section key={dep}>
                <h3 style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>
                  {DEP_TAG[dep]} · {group.length}
                </h3>
                {group.length === 0
                  ? <p className="text-muted" style={{ fontSize: 13 }}>Нет участников</p>
                  : (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {group.map(m => (
                        <li key={m.id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <button
                            onClick={() => openEdit(m)}
                            style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '8px 0' }}
                          >
                            <span style={{ color: 'var(--muted)', fontSize: 18, lineHeight: 1 }}>•</span>
                            <span style={{ flex: 1, fontSize: 14 }}>{m.name}</span>
                            <span className="text-muted" style={{ fontSize: 12 }}>{m.role}</span>
                            {m.is_active === false && (
                              <span style={{ fontSize: 11, color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 4, padding: '1px 6px' }}>Неактивный</span>
                            )}
                            <Icon id="i-arrow-r" style={{ width: 12, height: 12, color: 'var(--muted)' }} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )
                }
              </section>
            )
          })}
        </div>
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
                  <label>Фото</label>
                  <PhotoUpload value={form.photo_url} onChange={v => setForm(f => ({ ...f, photo_url: v }))} onError={showToast} />
                </div>
                <div className="field">
                  <label>Последние активности (до 3)</label>
                  {[0, 1, 2].map(i => (
                    <input key={i} className="input" style={{ marginBottom: 6 }} placeholder={`Активность ${i + 1}…`} value={form.recent[i] ?? ''} onChange={e => setForm(f => { const r = [...f.recent]; r[i] = e.target.value; return { ...f, recent: r } })} />
                  ))}
                </div>
                {!creating && (
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
                    Активный участник
                  </label>
                )}
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
