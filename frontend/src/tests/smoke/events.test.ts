import { test, expect } from '@playwright/test';

test('events page shows at least one event card', async ({ page }) => {
  await page.goto('/events', { waitUntil: 'networkidle' });
  await page.waitForSelector('.event-card', { state: 'visible' });
  await expect(page.locator('.event-card')).toHaveCount(1);
});