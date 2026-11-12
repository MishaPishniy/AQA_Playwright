import { test, expect } from "@playwright/test";

test("успішна авторизація стандартного користувача", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  await page.locator('[data-test="username"]').fill("standard_user");
  //  await page.locator('#username').fill('standard_user');
  //  await page.locator('.form_input')
  await page.locator('[data-test="password"]').fill("secret_sauce");
  await page.locator('[placeholder="Username"]');
  await page.locator('[data-test="login-button"]').click();
  await page.locator("input#user-name");
  await page.locator('input[placeholder="Username"]');

  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
  await expect(page.locator('[data-test="title"]')).toHaveText("Products");
  await expect(page.locator('[data-test="inventory-list"]')).toBeVisible();

  const pages = page.locator(".inventory_item_name");
  await expect(pages).toHaveCount(6);

  const proguct = page.locator(".inventory_item_name").first();
  console.log(proguct.textContent());

  await page.locator("button").click();

  await page.locator(".inventory_list  .inventory_item_price");
  await page.locator(".inventory_item > .inventory_item_price");

  await page
    .locator(".inventory_item")
    .filter({ hasText: "Sauce Labs Backpack" });
  await page.locator('.inventory_item:has-text("Sauce Labs Backpack")');
  await page.locator(".inventory_item:has(.inventory_item_name)");

  await page.locator('[data-test^="add-to-cart"]');
  await page.locator('[data-test$="backpack"]');
  await page.locator('[data-test*="sauce-labs"]');

  await page.locator("#user-name");
  await page.locator('//input[@id="user-name"]');
  await page.locator('//input[@id="password"]');
  await page.locator(
    'xpath=//button[@data-test="add-to-cart-sauce-labs-backpack"]',
  );
  await page.locator('//div[text()="Sauce Labs Backpack"]');
  await page.locator('//div[contains(text(),"Backpack")]');
  await page.locator('//button[contains(@data-test,"add-to-cart")]');
  const price = page.locator(
  '//div[text()="Sauce Labs Backpack"]' +
  '/ancestor::div[contains(@class,"inventory_item")][1]' +
  '//div[contains(@class,"inventory_item_price")]'
);
 await page.getByRole('textbox', { name: 'Username' })
  await page.getByRole('textbox', { name: 'Password' })
  await page.getByRole('button', { name: 'Login' , exact:true })


  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByPlaceholder('Username')
  await page.getByTestId('user-name')
});
