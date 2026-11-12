import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "../tests",

  timeout: 30000,

  workers: 1,

  use: {
    baseURL: "https://www.saucedemo.com/",

    ...devices["Desktop Chrome"],

    headless: false,

    screenshot: "only-on-failure",

    trace: "on",
  },

  reporter: "html",
});
