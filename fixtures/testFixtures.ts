import { test as base, expect, Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";

type MyFixtures = {
  username: string;
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  loginInPage: Page;
};
export const test = base.extend<MyFixtures>({
  username: async ({}, use) => {
    const name = "standard_user";
    await use(name);
  },
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },

  loginInPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.USERNAME!, process.env.PASSWORD!);
    await expect(page).toHaveURL(/inventory.html/);
    await use(page);
  },
});

export { expect };
