import { test, expect } from '@playwright/test';

test('Modify real API response', async ({ page }) => {

  await page.route('**/api/v1/fruits', async route => {

    const response = await route.fetch();

    const fruits = await response.json();

    fruits.push({
      name: 'Playwright Fruit',
      id: 999
    });

    await route.fulfill({
      response: response,
      json: fruits
    });
  });

  await page.goto('https://demo.playwright.dev/api-mocking/');

  await expect(
    page.getByText('Playwright Fruit')
  ).toBeVisible();
});