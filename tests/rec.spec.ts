import { test, expect } from '@playwright/test';

test('Monitor network requests', async ({ page }) => {

  page.on('request', request => {
    console.log('REQUEST:', request.method(), request.url());
  });

  page.on('response', response => {
    console.log('RESPONSE:', response.status(), response.url());
  });

  page.on('requestfailed', request => {
    console.log('FAILED:', request.url());
  });

  await page.goto('https://www.saucedemo.com/');

  await expect(page.locator('#login-button')).toBeVisible();
});


test('Intercept requests', async ({ page }) => {

  await page.route('**/assets/index-DnLqFcJI.js', async route => {

    const request = route.request();

    console.log('URL:', request.url());
    console.log('METHOD:', request.method());

    //await route.abort()
    await route.continue();
  });

  await page.goto('https://www.saucedemo.com/');

  await expect(page.locator('#login-button')).toBeVisible();
});