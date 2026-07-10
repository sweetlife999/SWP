import { test, expect } from '@playwright/test';
import { setupSmokeFixtures, MEMBERS } from './fixtures'

// Builds a client-side-valid-looking JWT (unsigned) so AdminContext's isTokenValid()
// treats the smoke session as authenticated — the real signature check only ever
// happens server-side, and every API call here is mocked via page.route anyway.
function fakeAdminToken(): string {
  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }))
  const payload = btoa(JSON.stringify({ sub: 'admin', exp: Math.floor(Date.now() / 1000) + 3600 }))
  return `${header}.${payload}.`
}

// Issue #81: SU:Support must be selectable when adding/editing a member (AC1) and
// members assigned to it must appear under their own category (AC2) in the admin panel.
test('admin members page offers SU:Support and groups members under it', async ({ page }) => {
  const supportMember = {
    id: 'support-1',
    dep: 'support',
    tag: 'SU:Support',
    name: 'Илья Смирнов',
    role: 'Co-lead, support',
    meta: 'Помощь CEO и координация офиса',
    bio: 'Отвечает за административную поддержку команды.',
    recent: [],
    photo_url: '',
  }
  await setupSmokeFixtures(page)
  await page.addInitScript(token => {
    window.localStorage.setItem('su_admin_token', token)
  }, fakeAdminToken())
  await page.route('**/api/members**', route => route.fulfill({ json: [...MEMBERS, supportMember] }))

  await page.goto('/#/admin/members')

  await page.getByRole('button', { name: /Добавить участника/ }).click()
  const departmentSelect = page.locator('select.input')
  await expect(departmentSelect.locator('option[value="support"]')).toHaveText('SU:Support')

  await expect(page.getByRole('heading', { name: /SU:Support · 1/ })).toBeVisible()
});
