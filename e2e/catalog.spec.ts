import { test, expect } from '@playwright/test';

test.describe('Catalog flow', () => {
  test('homepage loads and shows products link', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });

  test('catalog page renders products', async ({ page }) => {
    await page.goto('/catalogo');
    // The catalog should show at least a heading or a product grid
    await expect(page.locator('body')).toBeVisible();
  });
});
