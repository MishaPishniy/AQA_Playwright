import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 See https://playwright.dev/docs/test-configuration.
*/ 

const testEnv = process.env.TEST_ENV || 'dev';
const envPath = path.resolve(
  process.cwd(),
  `.env.${testEnv}`
);
if (!fs.existsSync(envPath)) {
  throw new Error(`Configuration file not found: ${envPath}`);
}
const result = dotenv.config({
  path: envPath,
});
if (result.error) {
  throw result.error;
}

export default defineConfig({
  testDir: './tests',
  testMatch: ['*.spec.ts'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
     baseURL: process.env.BASE_URL,

    viewport: {
      width: 1366,
      height: 768,
    },
    trace: 'on-first-retry',
  },
    expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      maxDiffPixels: 50,
    },
  },
});
