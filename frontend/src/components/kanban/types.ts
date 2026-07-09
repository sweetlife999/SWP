import type React from 'react'

export type ColKey = 'backlog' | 'next' | 'doing' | 'review' | 'done'
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
}

export interface CardPatch { title?: string; desc?: string; priority?: Priority; col?: ColKey; assignee?: string }

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

export const COLS: { key: ColKey; cls: string; label: string; color: string; eyeBtn?: boolean }[] = [
  { key: 'backlog', cls: 'c-backlog', label: 'Backlog',         color: '#9CA3AF' },
  { key: 'next',    cls: 'c-next',    label: 'Up next',         color: '#60A5FA' },
  { key: 'doing',   cls: 'c-doing',   label: 'In progress',     color: '#F59E0B' },
  { key: 'review',  cls: 'c-review',  label: 'Review',          color: '#A78BFA' },
  { key: 'done',    cls: 'c-done',    label: 'Done · sprint 14', color: '#22C55E', eyeBtn: true },
]

export const FACES = [
  { i: 'МР', bg: 'linear-gradient(135deg,#a3e0ad,#32b247)' },
  { i: 'ДА', bg: 'linear-gradient(135deg,#b3d5a8,#5fa44f)' },
  { i: 'ЕВ', bg: 'linear-gradient(135deg,#c7dfa9,#74a55c)' },
  { i: 'ТК', bg: 'linear-gradient(135deg,#a8dba8,#3da152)' },
  { i: 'АС', bg: 'linear-gradient(135deg,#a8c0e0,#3868b8)' },
]
