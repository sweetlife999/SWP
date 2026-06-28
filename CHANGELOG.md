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
- Forms Builder now publishes real questionnaires: each save creates a separate questionnaire via the API, and published ones appear on the public Questionnaires page; a "Новый опрос" button starts a fresh one
- Students can fill out and submit a questionnaire; responses are stored anonymously and show up in the Forms Viewer
- Kanban board: create new cards (persisted) and delete cards; the SU:Core board and its columns are seeded so the board works on a fresh database
- Member photos: drag-and-drop / click upload from the admin's computer, stored on the server and served optimised via a Thumbor image service; shown on the members grid and profile modal
- Event detail page is fully editable by admins: schedule, organizers, location address, format and age (inline "Редактировать детали" mode); "Похожие мероприятия" now lists real other events
- Kanban cards are editable (title, rich-note description, priority, assignee, column) from the card panel
- Admin event form has a Location field; event location now displays on the event page
- Event "Save to calendar" produces a valid `.ics` file (all-day or timed)
- Events have editable Format and Age fields, shown on the event page (were hardcoded)
- Forms Builder has a questionnaire picker: choose which questionnaire to edit; editing updates the same one instead of creating duplicates
- Kanban "New task" supports description, priority and an assignee
- Students no longer see questionnaires they have already completed

### Fixed
- Multiple-choice questions in the Forms Builder could not be edited (option inputs were hidden by a CSS class collision)
- Roadmap formatting toolbar and edit controls no longer show for non-admin visitors
- Admin "Add event" / "Add member" now reach the correct `/admin/*` endpoints — they were POSTing to the public routes and silently failing
- Forms Builder "Publish" and the questionnaire "Submit" button were no-ops (local state only) — both are now wired to the backend
- Newly-created kanban cards were hidden by the default priority filter — the filter now starts off
- Submitting a questionnaire could blank the page (white screen) on a survey with no/edited questions — guarded against empty steps and removed a setState-during-render
- Member cards rendered very tall/stretched with few members — fixed-width auto-fill columns and square photos
- Backend failed to start under Python 3.12: the `date`/`time` fields in the event schemas shadowed their imported types, crashing the app on import; event times also now persist correctly to the `TIME` column
- API is reachable in local development (Vite dev proxy) and from the Docker stack (nginx now proxies `/api` to the backend); backend container port standardised on `9999`
- Error banners now show a button with error message on every page
- Clicking on a department in the home page now directly navigates to the members page filtered by that department, instead of showing a toast with a link
- Department avatars on the home page now show actual member photos
- "SU:Core" admin panel nav renamed to "Kanban" to avoid confusion
- Removed redundant information from forms page
- Forms viewer and forms builder pages on admin panel now merged into one manage questionnaires page, with a list of all questionnaires and a "Create a questionnaire" button
- Forms viewer now displays submission time in a coherent format

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
