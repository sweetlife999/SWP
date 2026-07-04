const BASE = '/api'

function token() { return localStorage.getItem('su_admin_token') ?? '' }

function hasAuthHeader(init?: RequestInit): boolean {
  const h = init?.headers
  if (!h) return false
  if (h instanceof Headers) return h.has('Authorization')
  if (Array.isArray(h)) return h.some(([k]) => k.toLowerCase() === 'authorization')
  return Object.keys(h).some(k => k.toLowerCase() === 'authorization')
}

// Clears the stored token and tells AdminContext so any open admin page
// redirects to /admin/login instead of getting stuck on a silent 401. Only
// called for requests that carried an Authorization header — the login
// endpoint also returns 401 for a wrong password, which is not a session
// expiry and must not trigger this.
function handleUnauthorized() {
  localStorage.removeItem('su_admin_token')
  window.dispatchEvent(new Event('su:unauthorized'))
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init)
  if (res.status === 401 && hasAuthHeader(init)) handleUnauthorized()
  if (!res.ok) throw new Error(String(res.status))
  if (res.status === 204) return undefined as T
  const text = await res.text()
  return (text ? JSON.parse(text) : undefined) as T
}

// For endpoints that return 204 No Content (e.g. DELETE) — calling res.json() on
// an empty body throws, so skip parsing.
async function reqVoid(path: string, init?: RequestInit): Promise<void> {
  const res = await fetch(`${BASE}${path}`, init)
  if (res.status === 401 && hasAuthHeader(init)) handleUnauthorized()
  if (!res.ok) throw new Error(String(res.status))
}

function authHeaders(): HeadersInit {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` }
}

// Build a Thumbor URL for an uploaded image path. Full http(s) URLs pass through
// unchanged (back-compat with photos that were stored as external links).
export function photoUrl(path: string | undefined, size = '320x320'): string {
  if (!path) return ''
  if (/^https?:\/\//.test(path)) return path
  return `/thumbor/unsafe/${size}/${path}`
}

// ── Types ─────────────────────────────────────────────────────────────────────

// Lifecycle status from the backend; 'live'/'passed' are legacy display values still tolerated.
export type EventStatus = 'draft' | 'published' | 'archived'

export interface ScheduleItem { time: string; title: string; where: string }
export interface OrganizerItem { initials: string; name: string; role: string }

export interface Event {
  id: number
  title: string; desc: string
  date: string; dd: string; mm: string
  endDate?: string; endDd?: string; endMm?: string
  cover: string; tag: string; tagCls: string
  time?: string; foot: string; footLabel?: string
  endTime?: string
  featured?: boolean; past?: boolean
  status?: 'draft' | 'published' | 'archived'; statusText?: string
  format?: string; age?: string
  locationAddress?: string; schedule?: ScheduleItem[]; organizers?: OrganizerItem[]
}

export interface EventPatch {
  title?: string; desc?: string; date?: string; time?: string | null
  tag?: string; cover?: string; foot?: string; footLabel?: string | null
  featured?: boolean; status?: EventStatus; statusText?: string | null
  format?: string; age?: string
  locationAddress?: string; schedule?: ScheduleItem[]; organizers?: OrganizerItem[]
}

export interface Member {
  id: string
  dep: 'core' | 'active' | 'media'
  tag: string; name: string; role: string; meta: string
  bio: string; recent: string[]
  photo_url?: string
  is_active?: boolean
}

export interface MemberPatch {
  dep?: Member['dep']; name?: string; role?: string
  meta?: string; bio?: string; recent?: string[]; photo_url?: string
  is_active?: boolean
}

export type QStepType = 'single' | 'multi' | 'scale' | 'text'
export interface QStep {
  id: number
  type: QStepType; title: string; hint: string
  options?: string[]; low?: string; high?: string; median?: number
}

// What a student submits: answers keyed by question id.
export type SurveyAnswer = string | number | string[]

export interface QuestionnaireCreate {
  department: 'core' | 'active' | 'media'
  title: string; description?: string; flow_title?: string; eyebrow?: string; est_minutes?: number
}
export interface QuestionInput {
  type: QStepType; title: string; hint?: string
  options?: string[]; scale_low?: string; scale_high?: string; scale_mid?: number
}

export interface QuestionAdmin {
  id: number; position: number; type: QStepType; title: string; hint: string
  options?: string[]; scale_low?: string; scale_high?: string; scale_mid?: number
}
export interface QuestionnaireAdmin {
  id: number; department: 'core' | 'active' | 'media'; title: string; description: string
  status: 'draft' | 'open' | 'closed'; est_minutes: number; closes_at?: string
  response_count: number; questions: QuestionAdmin[]
}
export interface Survey {
  id: string; tag: string; tagCls: string
  title: string; desc: string; time: string
  timeEnding?: boolean; left: string
  flowTitle: string; eyebrow: string
  steps: QStep[]
}

export interface Tag { label: string; cls: string; style?: React.CSSProperties; dot?: boolean }
export interface MetaItem { icon: string; text: string; urgent?: boolean; soon?: boolean }
export interface Assignee { initials: string; bg: string; offset?: boolean }
export type Priority = 'p-low' | 'p-mid' | 'p-high'
export type ColKey = 'backlog' | 'next' | 'doing' | 'review' | 'done'
export interface KanbanCard {
  id: string; col: ColKey; blocker?: boolean
  tags: Tag[]; title: string; desc?: string
  attachment?: { icon: string; bold: string; rest: string }
  progressPct?: number; progressLabel?: string
  meta?: MetaItem[]
  priority: Priority; pLabel: string; assignees: Assignee[]
}

export interface Form { id: string; tag: string; tagClass: string; title: string; count: number }
export interface ContentBlock { html: string; updatedAt?: string; updatedBy?: string }

// ── Endpoints ────────────────────────────────────────────────────────────────

export const api = {
  // Uploads an image; returns its stored path (serve via photoUrl()). Multipart,
  // so we set only the Authorization header and let the browser set the boundary.
  upload: async (file: File): Promise<{ path: string }> => {
    const body = new FormData()
    body.append('file', file)
    const res = await fetch(`${BASE}/admin/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token()}` },
      body,
    })
    if (res.status === 401) handleUnauthorized()
    if (!res.ok) throw new Error(String(res.status))
    return res.json()
  },
  events: {
    list:      () => req<Event[]>('/events'),
    // Admin listing returns every event regardless of status (drafts included).
    adminList: () => req<Event[]>('/admin/events', { headers: authHeaders() }),
    get:       (id: number | string) => req<Event>(`/events/${id}`),
    // Admin create lives under /admin/events (require_admin); the public /events has no POST.
    create:    (e: Omit<Event, 'id'>) => req<Event>('/admin/events', { method: 'POST', headers: authHeaders(), body: JSON.stringify(e) }),
    update:    (id: number | string, patch: EventPatch) => req<Event>(`/admin/events/${id}`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify(patch) }),
    remove:    (id: number | string) => reqVoid(`/admin/events/${id}`, { method: 'DELETE', headers: authHeaders() }),
  },
  members: {
    // dep is passed through to the API so the server returns only matching members (US-05 AC2).
    list:   (dep?: Member['dep']) => req<Member[]>(`/members${dep ? `?dep=${dep}` : ''}`),
    create: (m: Omit<Member, 'id'>) => req<Member>('/admin/members', { method: 'POST', headers: authHeaders(), body: JSON.stringify(m) }),
    update: (id: number | string, patch: MemberPatch) => req<Member>(`/admin/members/${id}`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify(patch) }),
    remove: (id: number | string) => reqVoid(`/admin/members/${id}`, { method: 'DELETE', headers: authHeaders() }),
  },
  surveys: {
    list: () => req<Survey[]>('/surveys'),
  },
  // Public questionnaires: list open ones and submit a response (no account).
  questionnaires: {
    list:   () => req<Survey[]>('/questionnaires'),
    submit: (id: string | number, answers: Record<string, SurveyAnswer>) =>
      reqVoid(`/questionnaires/${id}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      }),
  },
  content: {
    get:    (slug: string) => req<ContentBlock>(`/content/${slug}`),
    update: (slug: string, html: string) =>
      req<ContentBlock>(`/content/${slug}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ html }),
      }),
  },
  admin: {
    login: (password: string) =>
      req<{ token: string }>('/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      }),
    logout: () => reqVoid('/admin/logout', { method: 'POST', headers: authHeaders() }),
    events: {
      list:   () => req<Event[]>('/admin/events', { headers: authHeaders() }),
      create: (e: Record<string, unknown>) => req('/admin/events', { method: 'POST', headers: authHeaders(), body: JSON.stringify(e) }),
      update: (id: number | string, e: Record<string, unknown>) => req(`/admin/events/${id}`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify(e) }),
      delete: (id: number | string) => req<void>(`/admin/events/${id}`, { method: 'DELETE', headers: authHeaders() }),
    },
    kanban: {
      list:   () => req<KanbanCard[]>('/admin/kanban', { headers: authHeaders() }),
      create: (card: { title: string; col: ColKey; desc?: string; priority?: Priority; assignee?: string }) =>
        req<KanbanCard>('/admin/kanban', { method: 'POST', headers: authHeaders(), body: JSON.stringify(card) }),
      // Edit any subset of a card's fields (a column-only move is just patch({ col })).
      patch: (id: string, body: { col?: ColKey; title?: string; desc?: string; priority?: Priority; blocker?: boolean; assignee?: string }) =>
        req<KanbanCard>(`/admin/kanban/${id}`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify(body) }),
      remove: (id: string) => reqVoid(`/admin/kanban/${id}`, { method: 'DELETE', headers: authHeaders() }),
    },
    forms: {
      list:      () => req<Form[]>('/admin/forms', { headers: authHeaders() }),
      responses: (id: string) => req<unknown[]>(`/admin/forms/${id}/responses`, { headers: authHeaders() }),
    },
    questionnaires: {
      list:        () => req<QuestionnaireAdmin[]>('/admin/questionnaires', { headers: authHeaders() }),
      get:         (id: number | string) => req<QuestionnaireAdmin>(`/admin/questionnaires/${id}`, { headers: authHeaders() }),
      create:      (q: QuestionnaireCreate) =>
        req<QuestionnaireAdmin>('/admin/questionnaires', { method: 'POST', headers: authHeaders(), body: JSON.stringify(q) }),
      patch:       (id: number | string, body: Partial<QuestionnaireCreate>) =>
        req<QuestionnaireAdmin>(`/admin/questionnaires/${id}`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify(body) }),
      addQuestion: (id: number | string, q: QuestionInput) =>
        req<{ id: number }>(`/admin/questionnaires/${id}/questions`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(q) }),
      removeQuestion: (id: number | string, qid: number) =>
        reqVoid(`/admin/questionnaires/${id}/questions/${qid}`, { method: 'DELETE', headers: authHeaders() }),
      // status 'open' publishes, 'draft' unpublishes, 'closed' closes.
      setStatus:   (id: number | string, status: 'draft' | 'open' | 'closed') =>
        req(`/admin/questionnaires/${id}`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ status }) }),
    },
  },
}
