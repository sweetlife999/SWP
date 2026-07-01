import { test, expect } from '@playwright/test';
import { setupSmokeFixtures } from './fixtures'

test('questionnaires page loads', async ({ page }) => {
  await setupSmokeFixtures(page)
  await page.goto('/#/questionnaires');
  await expect(page).toHaveURL(/#\/questionnaires/);
  await expect(page.locator('.q-list-card')).toHaveCount(1);
});