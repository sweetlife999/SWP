# MVP v0 Report — Student Union Portal

**Status:** реализован статический frontend (SPA). Backend и БД — вне скоупа MVP v0.

---

## Описание

MVP v0 — это кликабельный React-фронтенд, точно воспроизводящий HTML-прототип. Он демонстрирует полный UX портала без подключения к серверу: данные статические, навигация работает через React Router.

### Что реализовано

| Экран | Путь | Покрываемые US |
|-------|------|---------------|
| Главная (Home) | `/` | US-08 (dept info), US-01 (events preview) |
| Events | `/events` | US-01 (browse events) |
| Event Detail | `/events/:id` | US-01 |
| Members & History | `/members` | US-05 (member directory) |
| Questionnaires | `/questionnaires` | US-12 (fill questionnaire) |
| Donations | `/donations` | — |
| SU:Core Kanban | `/admin/kanban` | US-11 (admin task tracking) |
| Forms Builder | `/admin/forms/builder` | US-13 (create questionnaire) |
| Admin Accounts | `/admin/accounts` | — |

### Что замоковано / статично

- Все данные (ивенты, участники, опросы) — статические константы в компонентах
- Авторизация отсутствует; пользователь фиксирован как «Иван Петров, B22-DS-02»
- Формы не отправляют данные — кнопки интерактивны визуально, но без API-вызовов
- Пагинация («Загрузить ещё») не подгружает реальные данные

---

## Технический стек

```
frontend/
  src/
    components/   AppShell, Sidebar, Header, Icon
    pages/        9 страниц (по одной на экран прототипа)
    styles.css    единая design system (токены + page-specific CSS)
  public/
    icons.svg     SVG-спрайт (Lucide)
```

- **Vite 5** + **React 18** + **TypeScript**
- **React Router v6** (HashRouter — работает без сервера)
- Зависимости: только `react`, `react-dom`, `react-router-dom`

---

## Deployment URL

MVP v0 запускается локально. Публичного деплоя нет — для сдачи используется локальный запуск или сборка `dist/`.

---

## Public video demonstration

_TODO_ — запись экрана < 2 минут будет добавлена перед дедлайном.

---

## Связь с прототипом и MVP v1

MVP v0 реализует все экраны прототипа (HTML → React). MVP v1 добавит:
- REST API (Spring Boot / Django) и PostgreSQL
- JWT-авторизацию
- Реальные CRUD-операции для ивентов, опросов, участников

Истории MVP v1 (US-01, US-05, US-08, US-11, US-12, US-13) визуально присутствуют в MVP v0, но без серверной логики.

---

## Локальный запуск

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run build      # production-сборка → dist/
npm run preview    # preview dist/ на http://localhost:4173
```

---

## Smoke-check сценарий

### Шаги

1. `cd frontend && npm install && npm run dev`
2. Открыть http://localhost:5173
3. Убедиться, что отображается главная страница: hero-секция, 3 карточки департаментов, лента новостей, виджеты справа
4. Кликнуть **Events** в сайдбаре → страница ивентов с карточками и фильтрами
5. Кликнуть на featured-карточку ивента → страница EventDetail
6. Кликнуть **Members & History** → список участников; переключить таб на «History» и «Roadmap 2026»
7. Кликнуть **Questionnaires** → выбрать опрос слева, пройти шаги 1–4 кнопками Next/Back
8. Кликнуть **SU:Core Board** (Admin) → kanban с карточками по колонкам
9. Убедиться, что сайдбар подсвечивает активный пункт зелёным на каждой странице
10. Уменьшить окно до < 1024 px → сайдбар прячется, появляется кнопка «☰», клик открывает drawer

### Ожидаемый результат

- Все 9 экранов доступны без ошибок в консоли
- Визуальное совпадение с Figma-прототипом
- Интерактивные элементы (tabs, segmented controls, questionnaire stepper, kanban) работают
