import { expect, test } from "@playwright/test";

test("Зробити скріншот сторінки логіну", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  await expect(page).toHaveScreenshot("screenshots/login.png");
});

