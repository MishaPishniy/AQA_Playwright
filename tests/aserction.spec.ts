import { test, expect } from "@playwright/test";
test("Screenshot картки товару", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  await expect(page).not.toHaveURL("https://www.saucedemo.com/inventory.html");

  await expect(page.locator('[data-test="error"]')).toBeHidden();

  await page.getByPlaceholder("Username").fill("standard_user");
  await expect.soft(page.getByPlaceholder("Username")).toHaveValue("standard_user");

  await page.getByPlaceholder("Password").fill("secret_sauce");
  await expect(page.getByPlaceholder("Password")).toHaveValue("secret_sauce");

  await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Login" })).toBeEnabled();

  const button = page.getByRole("button", { name: "Login" });
  const backgroundColor = await button.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  console.log(backgroundColor);

  await expect(page.getByRole("button", { name: "Login" })).toHaveCSS(
    "background-color",
    "rgb(61, 220, 145)",
  );

  await page.getByRole("button", { name: "Login" }).click();


  await expect(page.getByText("Products")).toBeVisible({ timeout: 10000 });
  await expect(page.getByText("Products")).toHaveText("Products");
  await expect(page.getByText("Products")).toContainText("Pro");
  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
  await expect(page.locator(".inventory_item")).toHaveCount(6);

  await expect(
    page.getByRole("button", { name: "Add to cart" }).first(),
  ).toHaveClass(/btn btn_primary/);
  await expect(
    page.getByRole("button", { name: "Add to cart" }).first(),
  ).toHaveCSS("background-color", "rgb(255, 255, 255)");

  await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
});
