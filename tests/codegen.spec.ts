import { test, expect } from "../fixtures/testFixtures";
import { getEnv } from "../utils/env";

test("успішна авторизація стандартного користувача", async ({ page, loginPage, inventoryPage, username }) => {
  await loginPage.open();
  await loginPage.login(username, getEnv("TEST_PASSWORD"));

  await expect(page).toHaveURL(new URL("/inventory.html", getEnv("BASE_URL")).href);
  await expect(inventoryPage.title).toHaveText("Products");
  await expect(inventoryPage.inventoryList).toBeVisible();
  await expect(inventoryPage.items).toHaveCount(6);
  await expect(loginPage.loginButton).toBeHidden();
});
