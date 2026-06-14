# Student Union Portal

A centralized web platform connecting Innopolis University students with the Student Union. Students can browse upcoming events, discover SU members and departments, and participate in questionnaires. SU:Core members manage content and coordinate internal tasks through a built-in admin interface.

## Assignment 2 report

[reports/week2/README.md](reports/week2/README.md)

## MVP v0

[reports/week2/mvp-v0-report.md](reports/week2/mvp-v0-report.md) — deployed at [https://su.fblrkus.ru](https://su.fblrkus.ru)

## Local setup

### Requirements

- Node.js ≥ 18 (tested on v24)
- npm ≥ 9

### Frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

Для production-сборки:

```bash
npm run build      # dist/ — статика, открывается через любой HTTP-сервер
npm run preview    # локальный preview сборки на http://localhost:4173
```

### Структура

```
frontend/          — React + TypeScript + Vite
reports/week2/     — отчёты Assignment 2
.github/
  workflows/       — CI: link-check (Lychee)
  pull_request_template.md
```
