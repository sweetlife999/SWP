import { useState, useEffect, useRef } from 'react'
import QRCode from 'react-qr-code'
import { Icon } from '../components/Icon'
import { api } from '../lib/api'
import { useAdmin } from '../lib/AdminContext'

const DONATE_URL = 'https://www.tbank.ru/cf/6NXLtpINXzY'

const DEFAULT_HTML = `<ul class="donate-list">
  <li>Печатные материалы — плакаты, брошюры, баннеры для мероприятий</li>
  <li>Telegram-бот студсовета и инфраструктура SU Portal</li>
  <li>Видеооборудование для съёмки ивентов</li>
  <li>Инвентарь и расходники для мероприятий (гирлянды, реквизит, звук)</li>
  <li>Мерч студсовета</li>
  <li>Призы для победителей хакатонов и турниров</li>
  <li>Аренда оборудования для концертов и кино-вечеров</li>
</ul>
<p class="donate-note">Деньги поступают напрямую в студсовет. Крупные траты публикуем в нашем Telegram-канале.</p>`

export default function DonationsPage() {
  const { isAdmin } = useAdmin()
  const [editing, setEditing] = useState(false)
  const [html, setHtml] = useState(DEFAULT_HTML)
  const [toast, setToast] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    api.content.get('donations').then(d => setHtml(d.html)).catch(() => {})
  }, [])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  async function handleSave() {
    const newHtml = ref.current?.innerHTML ?? html
    try {
      await api.content.update('donations', newHtml)
      setHtml(newHtml)
      setEditing(false)
      showToast('Сохранено')
    } catch {
      showToast('Ошибка сохранения')
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
          <span className="eyebrow">Поддержка</span>
          <h1>Donations</h1>
          <p className="lead" style={{ fontSize: 14, marginTop: 6 }}>
            Студсовет существует на взносы студентов и партнёров.
          </p>
        </div>
        {isAdmin && !editing && (
          <button className="btn secondary" onClick={() => setEditing(true)}>
            <Icon id="i-edit" style={{ width: 14, height: 14 }} /> Редактировать
          </button>
        )}
      </div>

      <div className="donate-static">
        <div className="col gap-6">
          <div className={`card card-body${editing ? ' editing' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2>На что идут средства</h2>
              {editing && (
                <div className="row gap-2">
                  <button className="btn ghost" onClick={() => setEditing(false)}>Отмена</button>
                  <button className="btn primary" onClick={handleSave}>
                    <Icon id="i-check" style={{ width: 14, height: 14 }} /> Сохранить
                  </button>
                </div>
              )}
            </div>
            <div
              ref={ref}
              contentEditable={editing}
              suppressContentEditableWarning
              dangerouslySetInnerHTML={{ __html: html }}
              style={editing ? { outline: '2px solid var(--accent)', borderRadius: 6, padding: 8, minHeight: 80 } : {}}
            />
          </div>
        </div>

        <div className="donate-cta-simple">
          <div className="row gap-2" style={{ justifyContent: 'center' }}>
            <Icon id="i-heart" style={{ width: 18, height: 18, color: 'var(--accent)' }} />
            <h3>Поддержать студсовет</h3>
          </div>
          <div style={{ background: '#fff', padding: 12, borderRadius: 8, display: 'inline-block' }}>
            <QRCode value={DONATE_URL} size={160} />
          </div>
          <p style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center', maxWidth: 220 }}>
            Отсканируйте QR-код или нажмите кнопку ниже
          </p>
          <a
            className="btn primary"
            style={{ width: '100%', justifyContent: 'center' }}
            href={DONATE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Перейти к сбору <Icon id="i-arrow-r" style={{ width: 14, height: 14 }} />
          </a>
          <p style={{ fontSize: 11, color: 'var(--muted-2)', textAlign: 'center' }}>
            Сбор через T-Bank · безопасно
          </p>
        </div>
      </div>
    </>
  )
}
