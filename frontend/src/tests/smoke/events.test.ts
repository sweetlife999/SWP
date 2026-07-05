import { test, expect } from '@playwright/test';
import { setupSmokeFixtures, EVENTS } from './fixtures'

test('events page shows at least one event card', async ({ page }) => {
  await setupSmokeFixtures(page);
  await page.goto('/#/events');
  await expect(page.locator('.event-card')).not.toHaveCount(0);
  const eventCard = page.locator('.event-card', { hasText: EVENTS[0].title });
  await expect(eventCard).toBeVisible();
});