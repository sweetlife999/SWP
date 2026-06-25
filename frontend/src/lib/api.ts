const BASE = '/api'

function token() { return localStorage.getItem('su_admin_token') ?? '' }

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init)
  if (!res.ok) throw new Error(String(res.status))
  if (res.status === 204) return undefined as T
  const text = await res.text()
  return (text ? JSON.parse(text) : undefined) as T
}

// For endpoints that return 204 No Content (e.g. DELETE) — calling res.json() on
// an empty body throws, so skip parsing.
async function reqVoid(path: string, init?: RequestInit): Promise<void> {
  const res = await fetch(`${BASE}${path}`, init)
  if (!res.ok) throw new Error(String(res.status))
}

function authHeaders(): HeadersInit {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` }
}

// ── Types ─────────────────────────────────────────────────────────────────────

// Lifecycle status from the backend; 'live'/'passed' are legacy display values still tolerated.
export type EventStatus = 'draft' | 'published' | 'archived'

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
}

export interface EventPatch {
  title?: string; desc?: string; date?: string; time?: string | null
  tag?: string; cover?: string; foot?: string; footLabel?: string | null
  featured?: boolean; status?: EventStatus; statusText?: string | null
}

export interface Member {
  id: string
  dep: 'core' | 'active' | 'media'
  tag: string; name: string; role: string; meta: string
  bio: string; recent: string[]
  photo_url?: string
}

export interface MemberPatch {
  dep?: Member['dep']; name?: string; role?: string
  meta?: string; bio?: string; recent?: string[]; photo_url?: string
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
    events: {
      list:   () => req<Event[]>('/admin/events', { headers: authHeaders() }),
      create: (e: Record<string, unknown>) => req('/admin/events', { method: 'POST', headers: authHeaders(), body: JSON.stringify(e) }),
      update: (id: number | string, e: Record<string, unknown>) => req(`/admin/events/${id}`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify(e) }),
      delete: (id: number | string) => req<void>(`/admin/events/${id}`, { method: 'DELETE', headers: authHeaders() }),
    },
    kanban: {
      list:   () => req<KanbanCard[]>('/admin/kanban', { headers: authHeaders() }),
      create: (card: { title: string; col: ColKey; desc?: string; priority?: Priority }) =>
        req<KanbanCard>('/admin/kanban', { method: 'POST', headers: authHeaders(), body: JSON.stringify(card) }),
      update: (id: string, col: ColKey) =>
        req<KanbanCard>(`/admin/kanban/${id}`, {
          method: 'PATCH',
          headers: authHeaders(),
          body: JSON.stringify({ col }),
        }),
      remove: (id: string) => reqVoid(`/admin/kanban/${id}`, { method: 'DELETE', headers: authHeaders() }),
    },
    forms: {
      list:      () => req<Form[]>('/admin/forms', { headers: authHeaders() }),
      responses: (id: string) => req<unknown[]>(`/admin/forms/${id}/responses`, { headers: authHeaders() }),
    },
    questionnaires: {
      create:      (q: QuestionnaireCreate) =>
        req<{ id: number }>('/admin/questionnaires', { method: 'POST', headers: authHeaders(), body: JSON.stringify(q) }),
      addQuestion: (id: number | string, q: QuestionInput) =>
        req<{ id: number }>(`/admin/questionnaires/${id}/questions`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(q) }),
      // status 'open' publishes, 'draft' unpublishes, 'closed' closes.
      setStatus:   (id: number | string, status: 'draft' | 'open' | 'closed') =>
        req(`/admin/questionnaires/${id}`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ status }) }),
    },
  },
}
