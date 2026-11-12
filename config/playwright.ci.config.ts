import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '../tests',

  timeout: 30000,

  retries: 2,

  workers: 2,

  forbidOnly: true,

  use: {
    baseURL: 'https://www.saucedemo.com/',

    ...devices['Desktop Chrome'],

    headless: true,

    screenshot: 'only-on-failure',

    trace: 'on-first-retry',
  },

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],
});