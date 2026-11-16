import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getEnv } from '../utils/env';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const environment = process.env.TEST_ENV || 'dev';
const envPath = path.join(projectRoot, `.env.${environment}`);
if (fs.existsSync(envPath)) {
  const result = dotenv.config({ path: envPath, quiet: true });
  if (result.error) throw result.error;
}

export default defineConfig({
  testDir: path.join(projectRoot, 'tests'),
  testMatch: ['*.spec.ts'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: getEnv('BASE_URL'),
    viewport: { width: 1366, height: 768 },
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  expect: {
    toHaveScreenshot: { animations: 'disabled', maxDiffPixels: 50 },
  },
});
