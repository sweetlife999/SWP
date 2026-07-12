import type { Event } from './api'

function localIsoDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// Live from the event's start time (if set) through the end of that same day,
// or the whole day if no start time is set. There is no end time in the data
// model, so "rest of the day" is the agreed cutoff.
export function isEventLive(ev: Event, now: Date = new Date()): boolean {
  if (ev.status !== 'published') return false
  if (ev.date !== localIsoDate(now)) return false
  if (!ev.time) return true

  const [h, m] = ev.time.split(':').map(Number)
  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  return nowMinutes >= h * 60 + m
}

export function eventStatusLabel(ev: Event, now: Date = new Date()): string {
  return ev.statusText || (isEventLive(ev, now) ? 'live' : '')
}
