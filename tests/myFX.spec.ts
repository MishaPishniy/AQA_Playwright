import { test } from "../fixtures/testFixtures";
import { expect } from "@playwright/test";

test("username fixtures", async ({ page, username }) => {
  await page.goto("https://www.saucedemo.com/");

  await page.getByPlaceholder("Username").fill(username);
  await page.getByPlaceholder("Password").fill("secret_sauce");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/inventory.html/);
});

test("login fixtures", async ({ page, loginPage }) => {
  await loginPage.open();
  await loginPage.login("standard_user", "secret_sauce");
  await expect(page).toHaveURL(/inventory.html/);
});

test("login  inventoryPage fixtures", async ({ page, loginPage ,inventoryPage }) => {
  await loginPage.open();
  await loginPage.login("standard_user", "secret_sauce");
  await expect(page).toHaveURL(/inventory.html/);
  await inventoryPage.sortByPriceLowToHigh();
});




test("login in PAge fixtures", async ({loginInPage}) => {
   await expect(loginInPage.locator(".inventory_item")).toHaveCount(6)
});


test('User can add product to cart', async ({ loginInPage }) => {

  await loginInPage
    .locator('[data-test="add-to-cart-sauce-labs-backpack"]')
    .click();

  await expect(
    loginInPage.locator('.shopping_cart_badge')
  ).toHaveText('1');

});
