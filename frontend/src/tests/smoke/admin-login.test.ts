import { test, expect } from '@playwright/test';

test('admin login page shows login form', async ({ page }) => {
  await page.goto('/#/admin/login');
  await expect(page.locator('input[type="password"]')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Вход для администратора' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Войти' }));
});