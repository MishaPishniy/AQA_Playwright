import { defineConfig, devices ,type ReporterDescription} from "@playwright/test";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 See https://playwright.dev/docs/test-configuration.
*/

const testEnv = process.env.TEST_ENV || "dev";
const envPath = path.resolve(process.cwd(), `.env.${testEnv}`);
if (!fs.existsSync(envPath)) {
  throw new Error(`Configuration file not found: ${envPath}`);
}
const result = dotenv.config({
  path: envPath,
});
if (result.error) {
  throw result.error;
}

const reporters: ReporterDescription[] = [ 
 ["list"],
    [
      "html",
      {
        outputFolder: "playwright-report",
        open: "never",
      },
    ]
];

if (process.env.ENABLE_CLOUD_REPORT === 'true') {
  if (!process.env.TESTOMATIO) {
    throw new Error('TESTOMATIO API key is missing');
  }

  reporters.push([
    '@testomatio/reporter/playwright',
    {
      apiKey: process.env.TESTOMATIO
    }
  ]);
}

export default defineConfig({
  testDir: "./tests",
  testMatch: ["*.spec.ts"],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: reporters,
  use: {
    baseURL: process.env.BASE_URL,

    viewport: {
      width: 1366,
      height: 768,
    },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-first-failure",
  },
  expect: {
    toHaveScreenshot: {
      animations: "disabled",
      maxDiffPixels: 50,
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },

    /* Test against mobile viewports. */
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "smoke",
      grep: /@smoke/,
      use: {
        browserName: "chromium",
      },
    },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
