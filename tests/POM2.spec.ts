import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import process from "process";
import { getEnv } from '../utils/env';

test.describe("Login in POM",() => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);

    await loginPage.open();
  });

  test('POM Login @T6edd83b6', async ({ page }) => {

    const userName = getEnv('TEST_USERNAME')
    const userPassword = getEnv('TEST_PASSWORD')
    await loginPage.login(userName, userPassword);

    await expect(page).toHaveURL(/inventory.html/);
  });
/*
  test('POM Login error User', async () => {
    await loginPage.login('locked_out_user', 'secret_sauce');

    await expect(loginPage.errorMessage).toContainText(
      'Sorry, this user has been locked out.'
    );
  }); */
});