import { test, expect } from '@playwright/test';
import { setupSmokeFixtures } from './fixtures'

test('members page shows at least one member card', async ({ page }) => {
  await setupSmokeFixtures(page)
  await page.goto('/#/members');
  await expect(page.locator('.person')).toHaveCount(1);
  await expect(page.locator('.person')).toContainText('Мария Петрова');
});