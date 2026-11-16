import { test, expect } from "../fixtures/testFixtures";

test("Screenshot сторінки товарів", async ({ loginInPage, inventoryPage }) => {
  await expect(loginInPage).toHaveURL(/\/inventory\.html$/);
  await inventoryPage.sortDropdown.selectOption("az");
  await expect(loginInPage).toHaveScreenshot("inventory-page.png", {
    mask: [inventoryPage.items],
  });
});
