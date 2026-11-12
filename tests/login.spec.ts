import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

test("Smoke: успішна авторизація @smoke ", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await test.step("Open login page", async () => {
    await loginPage.open();
  });

  await test.step("Login with valid credential", async () => {
    await loginPage.login(
      process.env.USER_NAME ?? "standard_user",
      process.env.USER_PASSWORD ?? "secret_sauce",
    );
  });

  await test.step("'Verify inventory page", async () => {
    await expect(page).toHaveURL(/inventory.html/);
  });
});
