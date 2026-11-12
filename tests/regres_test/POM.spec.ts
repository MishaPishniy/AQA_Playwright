import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";

test("POM Login", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.login("standard_user", "secret_sauce");

  await expect(page).toHaveURL(/inventory.html/);
});

test("POM Login error User", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.login("locked_out_user", "secret_sauce");

  //await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out.')
});
