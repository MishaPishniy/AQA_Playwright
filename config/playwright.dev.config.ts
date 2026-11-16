import { defineConfig, devices } from "@playwright/test";
import base from './playwright.base.config';

export default defineConfig(base, {
  testMatch: '**/*.@(spec|test).?(c|m)[jt]s?(x)',
  fullyParallel: false,
  retries: 0,
  expect: { toHaveScreenshot: { maxDiffPixels: 0 } },
  testDir: "../tests",

  timeout: 30000,

  workers: 1,

  use: {

    ...devices["Desktop Chrome"],

    headless: false,

    screenshot: "only-on-failure",

    trace: "on",
  },

  reporter: [['html', { open: 'never' }]],
});
