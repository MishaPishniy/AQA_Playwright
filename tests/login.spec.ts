import { test, expect } from "../fixtures/testFixtures";
import { getEnv } from "../utils/env";

test("Smoke: успішна авторизація @smoke ", async ({ page, loginPage, inventoryPage, username }) => {

  await test.step("Open login page", async () => {
    await loginPage.open();
  });

  await test.step("Login with valid credential", async () => {
    await loginPage.login(
      username,
      getEnv("TEST_PASSWORD"),
    );
  });

  await test.step("Verify inventory page", async () => {
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventoryPage.title).toHaveText("Products");
    await expect(inventoryPage.inventoryList).toBeVisible();
    await expect(loginPage.loginButton).toBeHidden();
  });
});
