import { test, expect } from "../fixtures/testFixtures";
import { parsePrice } from "../utils/priceUtils";

test("Додавання рюкзака до кошика", async ({ loginInPage, inventoryPage }) => {
  await expect(loginInPage).toHaveURL(/\/inventory\.html$/);

  // Додаємо товар
  await inventoryPage.product("Sauce Labs Onesie").addToCart();
  const products = inventoryPage.product("Sauce Labs Backpack");
  await products.addToCart();
  // Перевіряємо лічильник
  await expect(inventoryPage.header.cartBadge).toHaveText("2");
});

test("Перевірка ціни рюкзака", async ({ loginInPage, inventoryPage }) => {
  await expect(loginInPage).toHaveURL(/\/inventory\.html$/);

  // Додаємо товар
  const products = inventoryPage.product("Sauce Labs Backpack");
  const priceText = await products.getPriceText();
  const price = parsePrice(priceText);

  //Перевірка ціни
  expect(price).toBe(29.99);

  // Додавання товару в корзину
  await products.addToCart();
  
  // Перевіряємо лічильник
  await expect(inventoryPage.header.cartBadge).toHaveText("1");
});
