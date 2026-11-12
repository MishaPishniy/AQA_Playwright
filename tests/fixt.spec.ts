import { test, expect } from "@playwright/test";

test("Fixture", async ({ browserName, page }) => {
  console.log(browserName);

  await page.goto("https://www.saucedemo.com/");
});

test("Fixture context", async ({ context, page }) => {
  await page.goto("https://www.saucedemo.com/");

  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("secret_sauce");

  await page.getByRole("button", { name: "Login" }).click();

  const cookies = await context.cookies();
  console.log(cookies);
});

test("Fixture context2", async ({ context, page }) => {
  await page.goto("https://www.saucedemo.com/");

  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("secret_sauce");

  await page.getByRole("button", { name: "Login" }).click();

  const secondPage = await context.newPage();
  await secondPage.goto("https://www.saucedemo.com/inventory.html");

  console.log(context.pages().length);

  const cookies = await context.cookies();
  console.log(cookies);
});
///////////

test("Two independent users", async ({ browser }) => {
  const context1 = await browser.newContext();
  const context2 = await browser.newContext();

  try {
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    await page1.goto("https://www.saucedemo.com/");
    await page2.goto("https://www.saucedemo.com/");

    await page1.locator("#user-name").fill("standard_user");
    await page1.locator("#password").fill("secret_sauce");
    await page1.locator("#login-button").click();

    await expect(page1).toHaveURL(/inventory.html/);
    await expect(page2.locator("#login-button")).toBeVisible();

    await page2.getByPlaceholder("Username").fill("local_user");
    await page2.getByPlaceholder("Password").fill("secret_sauce");

    await page2.getByRole("button", { name: "Login" }).click();
  } finally {
    await context1.close();
    await context2.close();
  }
});
