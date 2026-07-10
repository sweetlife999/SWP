import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../lib/AdminContext'
import { api } from '../lib/api'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAdmin()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { token } = await api.admin.login(password)
      login(token)
      navigate('/')
    } catch {
      setError('Неверный пароль или ошибка сервера')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: '80px auto', padding: '0 16px' }}>
      <div className="logo-sm" style={{ marginBottom: 24, fontSize: 20, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent)', color: '#fff', borderRadius: 10, fontWeight: 700 }}>SU</div>
      <h2 style={{ marginBottom: 8 }}>Вход для администратора</h2>
      <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Только для членов SU:Core.</p>
      <form onSubmit={handleSubmit} className="col gap-3">
        <input
          type="password"
          aria-label="Пароль"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, background: 'var(--surface)', color: 'var(--text)' }}
          autoFocus
        />
        {error && <span style={{ color: '#EF4444', fontSize: 13 }}>{error}</span>}
        <button className="btn primary" disabled={loading || !password} style={{ width: '100%', justifyContent: 'center' }}>
          {loading ? 'Вход…' : 'Войти'}
        </button>
      </form>
    </div>
  )
}
