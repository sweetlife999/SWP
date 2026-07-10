import { test, expect } from '@playwright/test';
import { setupSmokeFixtures, EVENTS } from './fixtures'

test('events page shows at least one event card', async ({ page }) => {
  await setupSmokeFixtures(page);
  await page.goto('/#/events');
  const cards = page.getByTestId('event-card');
  await expect(cards).toHaveCount(EVENTS.length);
  await expect(cards).toContainText(EVENTS[0].title);
});