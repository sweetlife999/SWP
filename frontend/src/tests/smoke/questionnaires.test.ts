import { test, expect } from '@playwright/test';

test('questionnaires page loads', async ({ page }) => {
  await page.goto('/questionnaires');
  await expect(page).toHaveURL(/\/questionnaires/);
});