import { useState, useRef } from 'react'
import { Icon } from './Icon'
import { api, photoUrl } from '../lib/api'

// Reads the EXIF Orientation tag (1 = normal). Phones store portrait shots
// rotated with this tag; browsers honour it but the server's image optimizer
// re-encodes on the raw pixels, so thumbnails come out rotated. Returns 1 when
// there's no tag or the file isn't a recognizable (JPEG) image.
function getExifOrientation(file: File): Promise<number> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const view = new DataView(reader.result as ArrayBuffer)
        if (view.getUint16(0, false) !== 0xFFD8) return resolve(1) // not JPEG
        const length = view.byteLength
        let offset = 2
        while (offset < length) {
          const marker = view.getUint16(offset, false)
          offset += 2
          if (marker === 0xFFE1) { // APP1 / Exif
            if (view.getUint32(offset + 2, false) !== 0x45786966) return resolve(1) // "Exif"
            const little = view.getUint16(offset + 10, false) === 0x4949
            const count = view.getUint16(offset + 12, little)
            let p = offset + 12
            for (let i = 0; i < count; i++, p += 12) {
              if (view.getUint16(p + 2, little) === 0x0112) { // Orientation
                return resolve(view.getUint16(p + 8, little))
              }
            }
            return resolve(1)
          } else if ((marker & 0xFF00) !== 0xFF00) {
            break
          } else {
            offset += view.getUint16(offset, false)
          }
        }
        resolve(1)
      } catch {
        resolve(1)
      }
    }
    reader.onerror = () => resolve(1)
    reader.readAsArrayBuffer(file.slice(0, 256 * 1024)) // APP1 sits near the start
  })
}

// Bakes EXIF orientation into the pixels so every consumer (incl. the optimizer)
// sees the upright image. Only re-encodes when a rotation is actually needed;
// already-upright / unsupported images pass through untouched.
async function toOrientedFile(file: File): Promise<File> {
  const orientation = await getExifOrientation(file)
  if (orientation <= 1) return file
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' })
    const canvas = document.createElement('canvas')
    canvas.width = bmp.width
    canvas.height = bmp.height
    canvas.getContext('2d')!.drawImage(bmp, 0, 0)
    bmp.close()
    const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/jpeg', 0.9))
    if (!blob) return file
    const name = file.name.replace(/\.\w+$/i, '.jpg')
    return new File([blob], name, { type: 'image/jpeg' })
  } catch {
    return file
  }
}

// Drag-and-drop (or click) image upload to the server; stores the returned path.
export function PhotoUpload({ value, onChange, onError }: { value: string; onChange: (v: string) => void; onError: (m: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [over, setOver] = useState(false)

  async function upload(file: File) {
    setBusy(true)
    try {
      const toUpload = await toOrientedFile(file)
      const { path } = await api.upload(toUpload)
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
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={e => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = '' }} />
      {value && (
        <button className="btn ghost sm" style={{ marginTop: 6 }} onClick={() => onChange('')}>
          <Icon id="i-x" style={{ width: 12, height: 12 }} />Убрать фото
        </button>
      )}
    </div>
  )
}
