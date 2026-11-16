import { test as base, expect, Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { getEnv } from "../utils/env";
import { CartPage } from "../pages/CartPage";
import { ProductDetailsPage } from "../pages/ProductDetailsPage";

type MyFixtures = {
  username: string;
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  loginInPage: Page;
  cartPage: CartPage;
  productDetailsPage: ProductDetailsPage;
};
export const test = base.extend<MyFixtures>({
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  productDetailsPage: async ({ page }, use) => {
    await use(new ProductDetailsPage(page));
  },
  username: [async ({}, use) => {
    await use(getEnv("TEST_USERNAME"));
  }, { option: true }],
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },

  loginInPage: async ({ page, loginPage, inventoryPage, username }, use) => {
    await loginPage.open();
    await loginPage.login(username, getEnv("TEST_PASSWORD"));
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventoryPage.inventoryList).toBeVisible();
    await use(page);
  },
});

export { expect };
