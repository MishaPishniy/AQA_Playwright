import { test, expect } from "../fixtures/testFixtures";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { getEnv } from "../utils/env";

test("Fixture", async ({ loginPage }) => {
  await loginPage.open();
  await expect(loginPage.loginButton).toBeVisible();
});

test("Fixture context", async ({ page, loginPage, inventoryPage, username }) => {
  await loginPage.open();
  await loginPage.login(username, getEnv("TEST_PASSWORD"));
  await expect(page).toHaveURL(/\/inventory\.html$/);
  await expect(inventoryPage.inventoryList).toBeVisible();
});

test("Fixture context2", async ({ context, page, loginPage, username }) => {
  await loginPage.open();
  await loginPage.login(username, getEnv("TEST_PASSWORD"));
  await expect(page).toHaveURL(/\/inventory\.html$/);

  const secondPage = await context.newPage();
  await secondPage.goto("/inventory.html");
  await expect(secondPage).toHaveURL(/\/inventory\.html$/);
  await expect(new InventoryPage(secondPage).inventoryList).toBeVisible();
  expect(context.pages()).toHaveLength(2);
});

test("Two independent users", async ({ browser, baseURL, username }) => {
  const context1 = await browser.newContext({ baseURL });
  const context2 = await browser.newContext({ baseURL });

  try {
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    const login1 = new LoginPage(page1);
    const login2 = new LoginPage(page2);

    await login1.open();
    await login2.open();
    await login1.login(username, getEnv("TEST_PASSWORD"));

    await expect(page1).toHaveURL(/\/inventory\.html$/);
    await expect(login2.loginButton).toBeVisible();

    await login2.login("local_user", getEnv("TEST_PASSWORD"));
    await expect(login2.errorMessage).toHaveText(
      "Epic sadface: Username and password do not match any user in this service",
    );
    await expect(login2.loginButton).toBeVisible();
    await expect(new InventoryPage(page1).inventoryList).toBeVisible();
  } finally {
    await context1.close();
    await context2.close();
  }
});
