import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '../tests',

  grep: /@smoke/,

  timeout: 15000,

  workers: 2,

  use: {
    baseURL: 'https://www.saucedemo.com/',

    ...devices['Desktop Chrome'],

    headless: true,

    screenshot: 'only-on-failure',
  },

  reporter: 'list',
});