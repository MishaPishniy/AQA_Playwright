import { defineConfig, devices } from '@playwright/test';
import base from './playwright.base.config';

export default defineConfig(base, {
  testMatch: '**/*.@(spec|test).?(c|m)[jt]s?(x)',
  fullyParallel: false,
  retries: 0,
  expect: { toHaveScreenshot: { maxDiffPixels: 0 } },
  testDir: '../tests',

  grep: /@smoke/,

  timeout: 15000,

  workers: 2,

  use: {

    ...devices['Desktop Chrome'],

    headless: true,

    screenshot: 'only-on-failure',
  },

  reporter: 'list',
});
