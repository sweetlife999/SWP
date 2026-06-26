import { useState, useRef } from 'react'
import { Icon } from './Icon'
import { api, photoUrl } from '../lib/api'

// Drag-and-drop (or click) image upload to the server; stores the returned path.
export function PhotoUpload({ value, onChange, onError }: { value: string; onChange: (v: string) => void; onError: (m: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [over, setOver] = useState(false)

  async function upload(file: File) {
    setBusy(true)
    try {
      const { path } = await api.upload(file)
      onChange(path)
    } catch {
      onError('Не удалось загрузить фото (формат/размер?)')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setOver(true) }}
        onDragLeave={() => setOver(false)}
        onDrop={e => { e.preventDefault(); setOver(false); const f = e.dataTransfer.files[0]; if (f) upload(f) }}
        style={{
          border: `2px dashed ${over ? 'var(--accent)' : 'var(--border-2)'}`,
          borderRadius: 8, padding: 16, textAlign: 'center', cursor: 'pointer',
          background: over ? 'var(--accent-50)' : 'var(--surface-2)', fontSize: 13, color: 'var(--muted)',
        }}
      >
        {busy ? 'Загрузка…' : value
          ? <img src={photoUrl(value, '120x120')} alt="" style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 8 }} />
          : 'Перетащите фото сюда или нажмите, чтобы выбрать'}
      </div>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={e => { const f = e.target.files?.[0]; if (f) upload(f) }} />
      {value && (
        <button className="btn ghost sm" style={{ marginTop: 6 }} onClick={() => onChange('')}>
          <Icon id="i-x" style={{ width: 12, height: 12 }} />Убрать фото
        </button>
      )}
    </div>
  )
}
