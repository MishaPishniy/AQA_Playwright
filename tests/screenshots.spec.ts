import { test } from '@playwright/test';

test('Зробити скріншот сторінки логіну', async ({ page }) => {
  await page.goto("https://playwright.dev/");

  await page.screenshot({
    path:'screenshots/login.png'
  })
/*
  await page.screenshot({
  path: 'screenshots/full-page.png',
  fullPage: true,
});

await page
  .locator('#login-button')
  .screenshot({
    path: 'screenshots/login-button.png',
  });
*/
})