# Changelog

All notable user-visible changes to the Student Union Portal are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Added
- Admin management panel: `/admin/events` (create, edit, publish, archive, delete drafts) and `/admin/members` (create, edit, delete with confirmation), reachable from the sidebar Admin section
- Events and Members pages now show explicit loading, empty, and error states instead of a blank screen
- Members directory filters by department through the API (`GET /members?dep=`)
- Kanban board persists card moves to the backend (`PATCH /admin/kanban/:id`) with optimistic update and rollback + toast on failure

### Fixed
- Admin "Add event" / "Add member" now reach the correct `/admin/*` endpoints — they were POSTing to the public routes and silently failing
- Backend failed to start under Python 3.12: the `date`/`time` fields in the event schemas shadowed their imported types, crashing the app on import; event times also now persist correctly to the `TIME` column
- API is reachable in local development (Vite dev proxy) and from the Docker stack (nginx now proxies `/api` to the backend); backend container port corrected (publishes `9999:8000`)

## [1.0.0] — 2026-06-20

### Added
- FastAPI backend: events CRUD, members CRUD, questionnaires lifecycle, kanban and content endpoints
- PostgreSQL database with Alembic migrations; all MVP v1 tables in place
- Admin authentication: `POST /admin/token` issues JWT; `require_admin` dependency guards all `/admin/**` routes
- `GET /admin/questionnaires/:id/results` — admin view of all submitted responses per questionnaire
- Responsive layout: mobile and tablet breakpoints across all pages
- Admin inline editing for Roadmap and History sections (MembersPage)
- "Add member" modal for admins with department, name, role, tag, bio, and recent activity fields
- "Add event" modal for admins with title, description, date, time, department, and status fields
- Form Builder: form title is now editable (controlled input)
- Form Builder: Section / divider block type
- Form Builder: conditional jump logic per single-choice question
- HomePage department member counts fetched dynamically from `/members` API

### Changed
- Removed "Войти" (login) button from Header and Sidebar for non-admin users; admins navigate to `/admin/login` directly
- Department member counts on HomePage now fall back to hardcoded defaults when backend is unavailable

### Fixed
- ESLint error: removed synchronous `setState` call inside `useEffect` in FormsViewerPage
- Backend config: `cors_origins` parsed as `str` + `@property` to avoid pydantic-settings v2 `json.loads()` on comma-separated env values

---

## [0.2.0] — 2026-06-10

### Added
- Admin context (`AdminContext`, `useAdmin` hook, JWT stored in `localStorage`)
- Admin login page at `/admin/login`
- Inline content editing for HomePage intro, EventDetailPage description, DonationsPage, MembersPage
- Central API stub layer (`frontend/src/lib/api.ts`) with typed wrappers for all planned FastAPI endpoints
- Real QR code and T-Bank link on Donations page
- CI: ESLint + `tsc --noEmit` on PR and push (`frontend-lint.yml`)
- Questionnaire page driven by API data (removed hardcoded survey mock)
- Kanban board fetches cards from API stub

### Changed
- Removed all "IU Connect" mentions and student registration UI — portal is informational-only
- All mock/hardcoded data replaced with `fetch` stubs to future FastAPI endpoints
- Questionnaire questions are now data-driven per survey

### Removed
- "Что купили в 2026" block from Donations page

---

## [0.1.0] — 2026-06-01

### Added
- Initial React + Vite + TypeScript frontend scaffold
- Pages: Home, Events, EventDetail, Members, Questionnaires, Donations, AdminKanban, FormBuilder, FormsViewer
- Sidebar navigation and header
- Docker build and GitHub Actions deploy pipeline (`deploy.yml`)
- Link-check CI workflow (`link-check.yml`)
- Design system: CSS variables, layout, typography, colour tokens

<!-- version compare links added after git tags are created -->
