import { test, expect } from '@playwright/test';

test.describe('Admin section', () => {
  test('admin login page loads', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.locator('body')).toBeVisible();
  });

  test('admin dashboard redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/admin');
    // Should redirect to login or show login page
    await expect(page).toHaveURL(/\/login/);
  });
});
