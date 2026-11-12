import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { parsePrice } from "../utils/priceUtils";

test("Додавання рюкзака до кошика", async ({ page }) => {
  // Створюємо об'єкти сторінок
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  // Авторизуємося
  await loginPage.open();
  await loginPage.login("standard_user", "secret_sauce");

  // Перевіряємо перехід
  await expect(page).toHaveURL(/inventory.html/);

  // Додаємо товар
  // await inventoryPage.product('Sauce Labs Backpack').addToCart();
  await inventoryPage.product("Sauce Labs Onesie").addToCart();
  const products = inventoryPage.product("Sauce Labs Backpack");
  products.addToCart();
  const priceText = await products.getPriceText();
  const price = Number(priceText.replace("$", ""));
  console.log(priceText);
  console.log(price);
  // Перевіряємо лічильник
  await expect(inventoryPage.header.cartBadge).toHaveText("2");
});

test("Перевірка ціни рюкзака", async ({ page }) => {
  // Створюємо об'єкти сторінок
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  // Авторизуємося
  await loginPage.open();
  await loginPage.login("standard_user", "secret_sauce");

  // Перевіряємо перехід
  await expect(page).toHaveURL(/inventory.html/);

  // Додаємо товар
  const products = inventoryPage.product("Sauce Labs Backpack");
  const priceText = await products.getPriceText();
  const price = parsePrice(priceText);

  //Перевірка ціни
  expect(price).toBe(29.99);

  // Додавання товару в корзину
  products.addToCart();
  
  // Перевіряємо лічильник
  await expect(inventoryPage.header.cartBadge).toHaveText("1");
});
