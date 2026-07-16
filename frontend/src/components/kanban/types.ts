import type React from 'react'

// Columns come from GET /admin/kanban/columns (issue #126 AC4/AC5) — a board
// can rename/reorder them, so this is no longer a fixed union.
export type ColKey = string
export type Priority = 'p-low' | 'p-mid' | 'p-high'

export interface Tag { label: string; cls: string; style?: React.CSSProperties; dot?: boolean }
export interface MetaItem { icon: string; text: string; urgent?: boolean; soon?: boolean }
export interface Assignee { initials: string; bg: string; offset?: boolean }
export interface CardData {
  id: string; col: ColKey; blocker?: boolean
  tags: Tag[]; title: string; desc?: string
  attachment?: { icon: string; bold: string; rest: string }
  progressPct?: number; progressLabel?: string
  meta?: MetaItem[]
  priority: Priority; pLabel: string; assignees: Assignee[]
  deadline?: string
}

export interface CardPatch { title?: string; desc?: string; priority?: Priority; col?: ColKey; assignees?: string[]; deadline?: string | null }

export const PRIORITY_BORDER: Record<Priority, string> = {
  'p-high': '#EF4444',
  'p-mid':  '#F97316',
  'p-low':  '#10B981',
}
export const PRIORITY_LABEL: Record<Priority, string> = {
  'p-high': 'Urgent',
  'p-mid':  'High',
  'p-low':  'Low',
}

export interface KbColumn { key: ColKey; cls: string; label: string; color: string; eyeBtn?: boolean }

// Shown while GET /admin/kanban/columns is loading — the real board fetches
// its columns from the DB (issue #126), this is only a loading-state shape.
export const FALLBACK_COLS: KbColumn[] = [
  { key: 'backlog', cls: 'c-backlog', label: 'Backlog',     color: '#9CA3AF' },
  { key: 'next',    cls: 'c-next',    label: 'Up next',     color: '#60A5FA' },
  { key: 'doing',   cls: 'c-doing',   label: 'In progress', color: '#F59E0B' },
  { key: 'review',  cls: 'c-review',  label: 'Review',      color: '#A78BFA' },
  { key: 'done',    cls: 'c-done',    label: 'Done',        color: '#22C55E', eyeBtn: true },
]

// order_index -> the same rotating cls names the board's CSS already styles;
// falls back to 'c-backlog' beyond the known set rather than an undefined class.
const COL_CLASSES = ['c-backlog', 'c-next', 'c-doing', 'c-review', 'c-done']
export function colClass(orderIndex: number): string {
  return COL_CLASSES[orderIndex % COL_CLASSES.length]
}
