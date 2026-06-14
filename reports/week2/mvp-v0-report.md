# MVP v0 Report — Student Union Portal

**Status:** Static frontend SPA implemented. Backend and database are out of scope for MVP v0.

---

## Description

MVP v0 is a navigable React frontend that reproduces the full UX of the portal without a server connection. All data is static; navigation is handled by React Router. The purpose is to validate the interface structure and demonstrate that the technical foundation (build pipeline, deployment, routing) is working.

### Screens implemented

| Screen | Route | User stories covered |
|--------|-------|----------------------|
| Home | `/` | US-08 (dept info), US-01 (events preview) |
| Events | `/events` | US-01 (browse events) |
| Event Detail | `/events/:id` | US-01 |
| Members & History | `/members` | US-05 (member directory) |
| Questionnaires | `/questionnaires` | US-12 (fill questionnaire) |
| Donations | `/donations` | — |
| SU:Core Kanban | `/admin/kanban` | US-10 (internal task tracking) |
| Forms Builder | `/admin/forms/builder` | US-13 (create questionnaire) |
| Admin Accounts | `/admin/accounts` | — |

### Mocked / static elements

- All data (events, members, surveys) are static constants inside components
- No authentication; the user is hardcoded as "Ivan Petrov, B22-DS-02"
- Forms do not submit data — buttons are visually interactive but make no API calls
- "Load more" pagination does not fetch real data

---

## Tech stack

```
frontend/
  src/
    components/   AppShell, Sidebar, Header, Icon
    pages/        9 pages (one per prototype screen)
    styles.css    unified design system (tokens + page-specific CSS)
  public/
    icons.svg     SVG sprite (Lucide icons)
```

- **Vite 5** + **React 18** + **TypeScript**
- **React Router v6** (HashRouter — works without a server)
- Dependencies: `react`, `react-dom`, `react-router-dom` only

---

## Deployment URL

**Live:** [https://su.fblrkus.ru](https://su.fblrkus.ru)

Deployed on a VPS (Ubuntu 22.04, nginx, Let's Encrypt TLS). Deployment is automated via GitHub Actions on push to `main` (see `.github/workflows/deploy.yml`): `npm run build` → rsync to `/var/www/swp/` → nginx reload.

---

## Public video demonstration

https://drive.google.com/file/d/1vD7WQghi3PnJ-NTt0Liz_f-RKZRqJ3pN/view?usp=sharing

---

## Relationship to prototype and MVP v1

MVP v0 implements all prototype screens as React components (static data). MVP v1 will add:

- REST API (backend TBD) and PostgreSQL
- Admin authentication (single hidden-endpoint account, no public login UI)
- Real CRUD operations for events, surveys, and member directory

All MVP v1 stories (US-01, US-05, US-08, US-11, US-12, US-13) are visually represented in MVP v0 without server-side logic.

---

## Local setup

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

```bash
npm run build
# production build → dist/
npm run preview
# → http://localhost:4173
```

See root [README.md](../../README.md) for the full local setup instructions.

---

## Smoke-check scenario

**Access:** [https://su.fblrkus.ru](https://su.fblrkus.ru) — no credentials required.

### Steps

1. Open <https://su.fblrkus.ru> in a browser (or run `cd frontend && npm install && npm run dev` for local)
2. Verify the home page loads: hero section, 3 department cards, news widget, right-side widgets
3. Click **Events** in the sidebar → events list with filter tabs and event cards
4. Click a featured event card → Event Detail page
5. Click **Members & History** → member grid; switch tabs to History and Roadmap 2026
6. Click **Questionnaires** → select a survey from the left panel; navigate steps 1–4 with Next / Back buttons
7. Click **SU:Core Board** (under Admin) → kanban board with task cards in columns
8. Verify the sidebar highlights the active item in green on every page
9. Resize the window to < 1024 px → sidebar hides; click the ☰ button → drawer opens

### Expected results

- All 9 screens accessible with no console errors
- Visual match with the Figma prototype
- Interactive elements work: tabs, segmented controls, questionnaire step-by-step navigation, kanban columns
