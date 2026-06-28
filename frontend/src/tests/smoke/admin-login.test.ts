import { test, expect } from '@playwright/test';

test('admin login page shows login form', async ({ page }) => {
  await page.goto('/admin/login', { waitUntil: 'networkidle' });
  // Wait for the password field to appear and be visible
  await page.waitForSelector('input[type="password"]', { state: 'visible' });
  await expect(page.locator('input[type="password"]')).toBeVisible();
  await expect(page.locator('button')).toContainText('Войти');
});