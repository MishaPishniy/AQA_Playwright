import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { getEnv } from "../../utils/env";

test("POM Login", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.login(getEnv("TEST_USERNAME"), getEnv("TEST_PASSWORD"));

  await expect(page).toHaveURL(/\/inventory\.html$/);
});

test("POM Login error User", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.login("locked_out_user", getEnv("TEST_PASSWORD"));

  await expect(loginPage.errorMessage).toHaveText("Epic sadface: Sorry, this user has been locked out.");
  await expect(page).toHaveURL(new URL("/", getEnv("BASE_URL")).href);
  await expect(loginPage.loginButton).toBeVisible();
});
