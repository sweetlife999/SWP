import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('loads and shows Student Union heading', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForSelector('h1', { state: 'visible' });
    // На главной странице в заголовке присутствует фраза «Студенческий совет»
    await expect(page.locator('h1')).toContainText(/Студенческий совет/i);
  });

  test('department cards are visible', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForSelector('.dep-core', { state: 'visible' });
    await expect(page.locator('.dep-core')).toBeVisible();
    await expect(page.locator('.dep-active')).toBeVisible();
    await expect(page.locator('.dep-media')).toBeVisible();
    await expect(page.locator('.dep-core')).toContainText('SU:Core');
    await expect(page.locator('.dep-active')).toContainText('SU:Active');
    await expect(page.locator('.dep-media')).toContainText('SU:Media');
  });
});