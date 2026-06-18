const BASE = '/api'

function token() { return localStorage.getItem('su_admin_token') ?? '' }

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init)
  if (!res.ok) throw new Error(String(res.status))
  return res.json()
}

function authHeaders(): HeadersInit {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` }
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Event {
  id: number
  title: string; desc: string
  date: string; dd: string; mm: string
  cover: string; tag: string; tagCls: string
  time?: string; foot: string; footLabel?: string
  featured?: boolean; past?: boolean
  status?: 'live' | 'passed'; statusText?: string
}

export interface Member {
  id: string
  dep: 'core' | 'active' | 'media'
  tag: string; name: string; role: string; meta: string
  bio: string; recent: string[]
}

export type QStepType = 'single' | 'multi' | 'scale' | 'text'
export interface QStep {
  type: QStepType; title: string; hint: string
  options?: string[]; low?: string; high?: string; median?: number
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
    list:   () => req<Event[]>('/events'),
    get:    (id: number | string) => req<Event>(`/events/${id}`),
    create: (e: Omit<Event, 'id'>) => req<Event>('/events', { method: 'POST', headers: authHeaders(), body: JSON.stringify(e) }),
    update: (id: number | string, e: Partial<Event>) => req<Event>(`/events/${id}`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify(e) }),
    delete: (id: number | string) => req<void>(`/events/${id}`, { method: 'DELETE', headers: authHeaders() }),
  },
  members: {
    list:   () => req<Member[]>('/members'),
    create: (m: Omit<Member, 'id'>) => req<Member>('/members', { method: 'POST', headers: authHeaders(), body: JSON.stringify(m) }),
  },
  surveys: {
    list: () => req<Survey[]>('/surveys'),
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
      update: (id: number | string, e: Partial<Event>) => req<Event>(`/admin/events/${id}`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify(e) }),
      delete: (id: number | string) => req<void>(`/admin/events/${id}`, { method: 'DELETE', headers: authHeaders() }),
    },
    kanban: {
      list:   () => req<KanbanCard[]>('/admin/kanban', { headers: authHeaders() }),
      update: (id: string, col: ColKey) =>
        req<KanbanCard>(`/admin/kanban/${id}`, {
          method: 'PATCH',
          headers: authHeaders(),
          body: JSON.stringify({ col }),
        }),
    },
    forms: {
      list:      () => req<Form[]>('/admin/forms', { headers: authHeaders() }),
      responses: (id: string) => req<unknown[]>(`/admin/forms/${id}/responses`, { headers: authHeaders() }),
    },
  },
}
