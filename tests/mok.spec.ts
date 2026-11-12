import { test, expect } from '@playwright/test';

test('Mock fruits API', async ({ page }) => {

  await page.route('**/api/v1/fruits', async route => {

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          name: 'Apple',
          id: 1
        },
        {
          name: 'Banana',
          id: 2
        }
      ])
    });

  }); 

  await page.goto('https://demo.playwright.dev/api-mocking/');

  await expect(
    page.getByText('Apple', { exact: true })
  ).toBeVisible();

  await expect(
    page.getByText('Banana', { exact: true })
  ).toBeVisible();

  await expect(
    page.getByText('Strawberry', { exact: true })
  ).toHaveCount(0);
});



test('Mock server error', async ({ page }) => {

  let intercepted = false;

  await page.route('**/api/v1/fruits', async route => {

    intercepted = true;

    await route.fulfill({
      status: 500,
      json: {
        message: 'Internal Server Error'
      }
    });
  });

  await page.goto('https://demo.playwright.dev/api-mocking/');

  await expect.poll(() => intercepted).toBe(true);
});