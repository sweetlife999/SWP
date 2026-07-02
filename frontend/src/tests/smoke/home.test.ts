import { test, expect } from '@playwright/test';
import { setupSmokeFixtures } from './fixtures'

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await setupSmokeFixtures(page)
  })

  test('loads and shows Student Union heading', async ({ page }) => {
    await page.goto('/#/');
    await expect(page.locator('h1')).toContainText('Студенческий совет');
  });

  test('clicking a department card opens the modal', async ({ page }) => {
    await page.goto('/#/');
    await page.locator('[data-testid="dept-card-core"]').click();
    await expect(page.locator('[data-testid="dept-modal"]')).toBeVisible();
    await expect(page.locator('[data-testid="dept-modal"]')).toContainText('SU:Core');
  });

  test('department cards are visible', async ({ page }) => {
    await page.goto('/#/');
    for (const [testId, label] of [
      ['dept-card-core', 'SU:Core'],
      ['dept-card-active', 'SU:Active'],
      ['dept-card-media', 'SU:Media'],
    ] as const) {
      const card = page.locator(`[data-testid="${testId}"]`)
      await expect(card).toBeVisible();
      await expect(card).toContainText(label);
    }
  });
});