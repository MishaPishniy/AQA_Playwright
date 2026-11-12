import { test, expect } from '@playwright/test';
test('Screenshot картки товару', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');

  await page.getByRole('button', { name: 'Login' }).click();

  const product = page.locator('.inventory_item').first();
  await page.getByRole('combobox').selectOption('za')


  await expect(product).toHaveScreenshot('product-card.png');
});