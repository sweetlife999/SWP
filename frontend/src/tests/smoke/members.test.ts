import { test, expect } from '@playwright/test';

test('members page shows at least one member card', async ({ page }) => {
  await page.goto('/members', { waitUntil: 'networkidle' });
  await page.waitForSelector('.person', { state: 'visible' });
  await expect(page.locator('.person')).toHaveCount(1);
});