import { test, expect } from "../fixtures/testFixtures";
import { getEnv } from "../utils/env";
import { parsePrice } from "../utils/priceUtils";

test("username fixtures", async ({ page, loginPage, username }) => {
  await loginPage.open();
  await loginPage.login(username, getEnv("TEST_PASSWORD"));
  await expect(page).toHaveURL(/\/inventory\.html$/);
});

test("login fixtures", async ({ page, loginPage, username }) => {
  await loginPage.open();
  await loginPage.login(username, getEnv("TEST_PASSWORD"));
  await expect(page).toHaveURL(/\/inventory\.html$/);
});

test("login  inventoryPage fixtures", async ({ page, loginPage, inventoryPage, username }) => {
  await loginPage.open();
  await loginPage.login(username, getEnv("TEST_PASSWORD"));
  await expect(page).toHaveURL(/\/inventory\.html$/);
  await inventoryPage.sortByPriceLowToHigh();
  await expect(inventoryPage.sortDropdown).toHaveValue("lohi");
  await expect(inventoryPage.prices.first()).toBeVisible();
  await expect.poll(async () => {
    const prices = (await inventoryPage.prices.allTextContents()).map(parsePrice);
    return {
      multipleProducts: prices.length > 1,
      finitePrices: prices.every(Number.isFinite),
      ascending: prices.every((price, index) => index === 0 || prices[index - 1] <= price),
    };
  }).toEqual({ multipleProducts: true, finitePrices: true, ascending: true });
});

test("login in PAge fixtures", async ({ loginInPage, inventoryPage }) => {
  await expect(loginInPage).toHaveURL(/\/inventory\.html$/);
  await expect(inventoryPage.items).toHaveCount(6);
});

test("User can add product to cart", async ({ loginInPage, inventoryPage }) => {
  await expect(loginInPage).toHaveURL(/\/inventory\.html$/);
  await inventoryPage.product("Sauce Labs Backpack").addToCart();
  await expect(inventoryPage.header.cartBadge).toHaveText("1");
});
