import type { Event } from './api'

// Whether an event is happening right now, not just published. The events
// table only stores a start date/time (event_date/event_time); optional
// endDate/endTime are honored when a caller sets them, but default to the
// start values for the common single-day, start-time-only case.
export function isEventLive(ev: Event): boolean {
  if (ev.past || ev.status === 'archived') return false

  const now = new Date()
  const today = now.toISOString().slice(0, 10)
  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  const endDate = ev.endDate ?? ev.date

  if (today < ev.date || today > endDate) return false

  if (ev.date === today && ev.time) {
    const [h, m] = ev.time.split(':').map(Number)
    if (nowMinutes < h * 60 + m) return false
  }

  if (endDate === today && ev.endTime) {
    const [h, m] = ev.endTime.split(':').map(Number)
    if (nowMinutes > h * 60 + m) return false
  }

  return true
}
