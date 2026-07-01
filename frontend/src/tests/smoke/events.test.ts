import { test, expect } from '@playwright/test';
import { setupSmokeFixtures } from './fixtures'

test('events page shows at least one event card', async ({ page }) => {
  await setupSmokeFixtures(page)
  await page.goto('/#/events');
  await expect(page.locator('.event-card')).toHaveCount(1);
  await expect(page.locator('.event-card')).toContainText('Campus Welcome Day');
});