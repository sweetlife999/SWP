import type { Page } from '@playwright/test'

const HOME_INTRO = `<span class="eyebrow">О студсовете</span>
<h1>Студенческий совет<br>Университета Иннополис</h1>
<p class="lead">Представляем интересы студентов, организуем кампусную жизнь и помогаем университету становиться лучше — с 2019 года. Три департамента, одна команда.</p>`

const CONTENT_BLOCK = { html: HOME_INTRO }

const NEWS = [
  {
    date: 'июнь 2026',
    category: 'Новости',
    title: 'SU Portal v1 запущен',
    excerpt: 'Публичная версия портала уже содержит новости, ивенты, опросы и командные страницы.',
  },
]

const MEMBERS = [
  {
    id: 'core-1',
    dep: 'core',
    tag: 'SU:Core',
    name: 'Мария Петрова',
    role: 'Co-lead, strategy',
    meta: 'Переговоры с университетом и бюджет',
    bio: 'Координирует основную работу департамента.',
    recent: ['Бюджет Q3', 'Открытое собрание'],
    photo_url: '',
  },
]

const EVENTS = [
  {
    id: 1,
    title: 'Campus Welcome Day',
    desc: 'Знакомство первокурсников с командами SU.',
    date: '2026-07-15',
    dd: '15',
    mm: 'ИЮЛ',
    cover: '',
    tag: 'SU:Active',
    tagCls: 'blue',
    time: '18:00',
    foot: '120 участников',
    footLabel: 'Подробнее',
    past: false,
    status: 'published',
    statusText: 'live',
  },
]

const QUESTIONNAIRES = [
  {
    id: 'survey-1',
    tag: 'SU:Active',
    tagCls: 'blue',
    title: 'Какой формат ивентов вам интереснее?',
    desc: 'Помогите выбрать темы для ближайшего месяца.',
    time: '2 мин',
    left: '24 часа',
    flowTitle: 'Быстрый опрос',
    eyebrow: 'Опрос от SU:Active',
    steps: [
      {
        id: 1,
        type: 'single' as const,
        title: 'Что вам интереснее всего?',
        hint: 'Можно выбрать только один вариант.',
        options: ['Лекции', 'Спорт', 'Вечеринки'],
      },
    ],
  },
]

export async function setupSmokeFixtures(page: Page) {
  await page.route('**/api/content/home-intro', route => route.fulfill({ json: CONTENT_BLOCK }))
  await page.route('**/api/content/roadmap', route => route.fulfill({ json: CONTENT_BLOCK }))
  await page.route('**/api/content/history', route => route.fulfill({ json: CONTENT_BLOCK }))
  await page.route('**/api/news', route => route.fulfill({ json: NEWS }))
  await page.route('**/api/members**', route => route.fulfill({ json: MEMBERS }))
  await page.route('**/api/events**', route => route.fulfill({ json: EVENTS }))
  await page.route('**/api/questionnaires**', route => route.fulfill({ json: QUESTIONNAIRES }))
  await page.route('**/api/admin/login', route => route.fulfill({ status: 401, json: { detail: 'invalid credentials' } }))
}