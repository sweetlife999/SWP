# Assignment 2 — Week 2 Report

**Project:** Student Union Portal
**Short description:** A centralized web platform connecting Innopolis University students with the Student Union — featuring public events, SU member directory, questionnaires, and an internal task tracker for SU:Core.

**License:** [MIT](../../LICENSE)

---

## 1. User Stories

[reports/week2/user-stories.md](user-stories.md)

Includes 14 active stories (US-01 – US-16, two removed), MoSCoW priorities, and the initial proposed MVP v1 scope.

---

## 2. Prototype and Interface Artifacts

**Figma (view-only):** [SU Portal — Week 2 Prototype](https://www.figma.com/design/jQF7Hpaw4iLGrZM8Ei8ieT/SU-Portal-%E2%80%94-Week-2-Prototype?node-id=0-1&t=ialB7LSIfMm7k9u4-1)

| Screen | Status |
|--------|--------|
| Home (sidebar, header, hero, dept cards, news, widgets) | ✅ |
| Events (filters, event cards, mini calendar, stats) | ✅ |
| Events — Empty state | ✅ |
| Members & History (member grid, history timeline) | ✅ |
| Questionnaires (list + active survey step 1/4) | ✅ |
| Questionnaires — Success state | ✅ |
| Admin / Forms Builder (form list + editor) | ✅ |

Покрытие прототипом: US-01, US-05, US-08, US-11, US-12, US-13 (initial MVP v1 scope)

### Screenshots

> To be added to `reports/week2/images/` after prototype screens are complete.

---

## 3. MVP v0

**Status: реализован и задеплоен.** React + TypeScript + Vite SPA, 9 экранов, статические данные.

[mvp-v0-report.md](mvp-v0-report.md) — полный отчёт, smoke-check, tech stack

- **Деплой:** https://su.fblrkus.ru
- **Запуск локально:** `cd frontend && npm install && npm run dev` → http://localhost:5173
- **Видео-демо:** _TODO_ (< 2 минут, будет добавлено перед дедлайном)

### Screenshots

> To be added to `reports/week2/images/` after recording.

---

## 4. PR/MR Workflow

- PR-шаблон: [`.github/pull_request_template.md`](../../.github/pull_request_template.md) ✅
- Reviewed PRs: _TODO_ (будут добавлены после мержа Week 2 PR)

---

## 5. Lychee Link Checking

- CI workflow: [`.github/workflows/link-check.yml`](../../.github/workflows/link-check.yml) ✅
- Запускается: при push/PR на `*.md`, еженедельно по понедельникам (07:00 UTC), и вручную
- Исключены: `figma.com` (требует логина), `moodle.*` (внутренний), `localhost`, `127.*`
- Последний успешный run: _TODO_ (ссылка появится после первого пуша в `main`)

---

## 6. Coverage

The following user stories are covered by the **initial proposed MVP v1 prototype**:

| Story | Title |
|-------|-------|
| US-01 | View upcoming events |
| US-05 | View SU member directory |
| US-08 | View SU departments info |
| US-11 | Admin publishes and manages events and news |
| US-12 | Student fills out an active questionnaire |
| US-13 | Admin creates and manages questionnaires |

The prototype explores and communicates the proposed MVP v1 user experience.
MVP v0 is a runnable technical foundation — see [mvp-v0-report.md](mvp-v0-report.md) for which stories it partially implements.

---

## 7. Customer Meeting

> **Status: meeting not yet held.** The Week 2 customer review session is scheduled to present user stories, MoSCoW priorities, initial MVP v1 scope, and prototype artifacts.

<!-- After the meeting, update with:
- Transcript (if customer approved publication): [customer-meeting-transcript.md](customer-meeting-transcript.md)
- OR notes (if recording/sharing refused): [customer-meeting-notes.md](customer-meeting-notes.md)
- Meeting summary: [customer-meeting-summary.md](customer-meeting-summary.md)
-->

Customer transcript publication status: _pending customer approval._

---

## 8. Week 2 Analysis

[reports/week2/analysis.md](analysis.md)

Covers learning points, validated assumptions, open questions, and planned responses for MVP v1.

---

## 9. LLM Usage Report

[reports/week2/llm-report.md](llm-report.md)

---

## Screenshots

> `reports/week2/images/` — screenshots to be added:
> - Protected default branch settings
> - Example reviewed PR/MR
> - Figma prototype screens
> - Deployed MVP v0
