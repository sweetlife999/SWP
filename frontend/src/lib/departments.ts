// Single source of truth for department keys/labels (issue #126 Part 3 AC7).
// Was independently redefined in HomePage/MembersPage/AdminEventsPage/AdminMembersPage
// and had already drifted (3 vs 4 departments in different places). Mirrors the
// backend's canonical mapping in backend/app/computed.py (DEPT_TAG/DEPT_MAP).

export type DeptKey = 'core' | 'active' | 'media' | 'support'

export const DEPT_LABEL: Record<DeptKey, string> = {
  core: 'SU:Core',
  active: 'SU:Active',
  media: 'SU:Media',
  support: 'SU:Support',
}

export const DEPT_KEYS: DeptKey[] = ['core', 'active', 'media', 'support']
