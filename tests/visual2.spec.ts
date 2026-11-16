import { test, expect } from "../fixtures/testFixtures";

test("Screenshot картки товару", async ({ loginInPage, inventoryPage }) => {
  await expect(loginInPage).toHaveURL(/\/inventory\.html$/);
  await inventoryPage.sortDropdown.selectOption("za");
  await expect(inventoryPage.items.first()).toHaveScreenshot("product-card.png");
});
