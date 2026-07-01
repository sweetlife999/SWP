import { test, expect } from '@playwright/test';
import { setupSmokeFixtures } from './fixtures'

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await setupSmokeFixtures(page)
  })

  test('loads and shows Student Union heading', async ({ page }) => {
    await page.goto('/#/');
    await expect(page.locator('h1')).toContainText(/Студенческий совет|Student Union/i);
  });

  test('clicking a department card opens the modal', async ({ page }) => {
    await page.goto('/#/');
    await page.locator('.dep-core').click();
    await expect(page.locator('.dep-modal')).toBeVisible();
    await expect(page.locator('.dep-modal')).toContainText('SU:Core');
  });

  test('department cards are visible', async ({ page }) => {
    await page.goto('/#/');
    await expect(page.locator('.dep-core')).toBeVisible();
    await expect(page.locator('.dep-active')).toBeVisible();
    await expect(page.locator('.dep-media')).toBeVisible();
    await expect(page.locator('.dep-core')).toContainText('SU:Core');
    await expect(page.locator('.dep-active')).toContainText('SU:Active');
    await expect(page.locator('.dep-media')).toContainText('SU:Media');
  });
});