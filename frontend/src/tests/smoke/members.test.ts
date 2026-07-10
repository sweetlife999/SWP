import { test, expect } from '@playwright/test';
import { setupSmokeFixtures, MEMBERS } from './fixtures'

test('members page shows at least one member card', async ({ page }) => {
  await setupSmokeFixtures(page)
  await page.goto('/#/members');
  await expect(page.locator('.person')).toHaveCount(MEMBERS.length);
  await expect(page.locator('.person')).toContainText(MEMBERS[0].name);
});

// Issue #81: SU:Support is a fourth department (not a separate CEO/assistant role) —
// it must show up in the segmented filter (AC3) and group its own members (AC2)
// without disturbing the existing Core/Active/Media filters (AC4).
test('members page filter includes SU:Support and filters members by it', async ({ page }) => {
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
  await page.route('**/api/members**', route => route.fulfill({ json: [...MEMBERS, supportMember] }))
  await page.goto('/#/members')

  const segButtons = page.locator('.seg button')
  await expect(segButtons).toHaveCount(5) // Все, SU:Core, SU:Active, SU:Media, SU:Support
  await expect(segButtons.last()).toHaveText('SU:Support')

  await segButtons.last().click()
  await expect(page.locator('.person')).toHaveCount(1)
  await expect(page.locator('.person')).toContainText(supportMember.name)
});