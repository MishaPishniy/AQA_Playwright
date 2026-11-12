import { test, expect, type Page } from "@playwright/test";

// spec: specs/saucedemo-auth.spec.md
// seed: tests/seed.spec.ts

const loginUrl = "https://www.saucedemo.com/";
const inventoryUrl = "https://www.saucedemo.com/inventory.html";
const credentialsError =
  "Epic sadface: Username and password do not match any user in this service";
const accessError =
  "Epic sadface: You can only access '/inventory.html' when you are logged in.";

async function expectLoginPage(page: Page) {
  await expect(page).toHaveURL(loginUrl);
  await expect(page.locator('[data-test="username"]')).toBeVisible();
  await expect(page.locator('[data-test="password"]')).toBeVisible();
  await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  await expect(page.locator('[data-test="inventory-list"]')).toBeHidden();
}

async function openLoginPage(page: Page) {
  await page.goto(loginUrl);
  await expectLoginPage(page);
}

async function expectInventoryPage(page: Page) {
  await expect(page).toHaveURL(inventoryUrl);
  await expect(page.locator('[data-test="title"]')).toBeVisible();
  await expect(page.locator('[data-test="title"]')).toHaveText("Products");
  await expect(page.locator('[data-test="inventory-list"]')).toBeVisible();
  await expect(page.locator('[data-test="username"]')).toBeHidden();
  await expect(page.locator('[data-test="password"]')).toBeHidden();
  await expect(page.locator('[data-test="login-button"]')).toBeHidden();
  await expect(page.locator('[data-test="error"]')).toBeHidden();
}

async function expectLoginError(page: Page, message: string) {
  await expectLoginPage(page);
  await expect(page.locator('[data-test="error"]')).toBeVisible();
  await expect(page.locator('[data-test="error"]')).toHaveText(message);
}

test.describe("SauceDemo — авторизація", () => {
  test("Успішний вхід стандартного користувача", async ({ page }) => {
    // Передумова: відкрити головну сторінку й перевірити видимість полів та кнопки Login.
    await openLoginPage(page);

    // 1. Ввести standard_user у Username.
    await page.locator('[data-test="username"]').fill("standard_user");

    // 2. Ввести secret_sauce у Password.
    await page.locator('[data-test="password"]').fill("secret_sauce");

    // 3. Натиснути Login.
    await page.locator('[data-test="login-button"]').click();

    // Очікуваний результат: URL каталогу, Products і список товарів; форма входу прихована.
    await expectInventoryPage(page);
  });

  test("Неправильний пароль", async ({ page }) => {
    // Передумова: відкрити головну сторінку й перевірити видимість полів та кнопки Login.
    await openLoginPage(page);

    // 1. Ввести standard_user у Username.
    await page.locator('[data-test="username"]').fill("standard_user");

    // 2. Ввести wrong_password у Password.
    await page.locator('[data-test="password"]').fill("wrong_password");

    // 3. Натиснути Login.
    await page.locator('[data-test="login-button"]').click();

    // Очікуваний результат: форма входу видима, каталог прихований, помилка невірних облікових даних.
    await expectLoginError(page, credentialsError);
  });

  test("Невідомий користувач", async ({ page }) => {
    // Передумова: відкрити головну сторінку й перевірити видимість полів та кнопки Login.
    await openLoginPage(page);

    // 1. Ввести unknown_user у Username.
    await page.locator('[data-test="username"]').fill("unknown_user");

    // 2. Ввести secret_sauce у Password.
    await page.locator('[data-test="password"]').fill("secret_sauce");

    // 3. Натиснути Login.
    await page.locator('[data-test="login-button"]').click();

    // Очікуваний результат: форма входу видима, каталог прихований, помилка невірних облікових даних.
    await expectLoginError(page, credentialsError);
  });

  test("Обидва поля порожні", async ({ page }) => {
    // Передумова: відкрити сторінку входу з порожніми полями.
    await openLoginPage(page);
    await expect(page.locator('[data-test="username"]')).toHaveValue("");
    await expect(page.locator('[data-test="password"]')).toHaveValue("");

    // 1. Натиснути Login, не заповнюючи поля.
    await page.locator('[data-test="login-button"]').click();

    // Очікуваний результат: сторінка входу, прихований каталог і помилка обов'язкового Username.
    await expectLoginError(page, "Epic sadface: Username is required");
  });

  test("Порожнє ім'я користувача", async ({ page }) => {
    // Передумова: відкрити головну сторінку й перевірити видимість полів та кнопки Login.
    await openLoginPage(page);

    // 1. Залишити Username порожнім.
    await expect(page.locator('[data-test="username"]')).toHaveValue("");

    // 2. Ввести secret_sauce у Password.
    await page.locator('[data-test="password"]').fill("secret_sauce");

    // 3. Натиснути Login.
    await page.locator('[data-test="login-button"]').click();

    // Очікуваний результат: сторінка входу, прихований каталог і помилка обов'язкового Username.
    await expectLoginError(page, "Epic sadface: Username is required");
  });

  test("Порожній пароль", async ({ page }) => {
    // Передумова: відкрити головну сторінку й перевірити видимість полів та кнопки Login.
    await openLoginPage(page);

    // 1. Ввести standard_user у Username.
    await page.locator('[data-test="username"]').fill("standard_user");

    // 2. Залишити Password порожнім.
    await expect(page.locator('[data-test="password"]')).toHaveValue("");

    // 3. Натиснути Login.
    await page.locator('[data-test="login-button"]').click();

    // Очікуваний результат: сторінка входу, прихований каталог і помилка обов'язкового Password.
    await expectLoginError(page, "Epic sadface: Password is required");
  });

  test("Заблокований користувач", async ({ page }) => {
    // Передумова: відкрити головну сторінку й перевірити видимість полів та кнопки Login.
    await openLoginPage(page);

    // 1. Ввести locked_out_user у Username.
    await page.locator('[data-test="username"]').fill("locked_out_user");

    // 2. Ввести secret_sauce у Password.
    await page.locator('[data-test="password"]').fill("secret_sauce");

    // 3. Натиснути Login.
    await page.locator('[data-test="login-button"]').click();

    // Очікуваний результат: сторінка входу, прихований каталог і повідомлення про блокування.
    await expectLoginError(
      page,
      "Epic sadface: Sorry, this user has been locked out.",
    );
  });

  test("Вихід, закриття доступу до каталогу та повторний вхід", async ({
    page,
  }) => {
    // Передумова: відкрити головну сторінку й перевірити видимість полів та кнопки Login.
    await openLoginPage(page);

    // 1. Увійти як standard_user / secret_sauce і перевірити URL каталогу та видимий список товарів.
    await page.locator('[data-test="username"]').fill("standard_user");
    await page.locator('[data-test="password"]').fill("secret_sauce");
    await page.locator('[data-test="login-button"]').click();
    await expectInventoryPage(page);

    // 2. Відкрити меню кнопкою Open Menu.
    await page.getByRole("button", { name: "Open Menu", exact: true }).click();

    // 3. Натиснути Logout.
    await page.locator('[data-test="logout-sidebar-link"]').click();

    // 4. Перевірити повернення на головну, порожні поля, відсутність помилки та прихований каталог.
    await expectLoginPage(page);
    await expect(page.locator('[data-test="username"]')).toHaveValue("");
    await expect(page.locator('[data-test="password"]')).toHaveValue("");
    await expect(page.locator('[data-test="error"]')).toBeHidden();

    // 5. У цьому самому контексті відкрити https://www.saucedemo.com/inventory.html.
    await page.goto(inventoryUrl);

    // 6. Перевірити повернення на сторінку входу та повідомлення про доступ лише після авторизації.
    await expectLoginError(page, accessError);

    // 7. Знову ввести standard_user / secret_sauce і натиснути Login.
    await page.locator('[data-test="username"]').fill("standard_user");
    await page.locator('[data-test="password"]').fill("secret_sauce");
    await page.locator('[data-test="login-button"]').click();

    // Очікуваний результат: повторний вхід відкриває URL каталогу, Products і список товарів.
    await expectInventoryPage(page);
  });

  test("Прямий доступ до каталогу без авторизації", async ({ page }) => {
    // 1. Одразу відкрити https://www.saucedemo.com/inventory.html у новому чистому контексті.
    await page.goto(inventoryUrl);

    // Очікуваний результат: повернення на сторінку входу, прихований каталог і повідомлення про доступ.
    await expectLoginError(page, accessError);
  });
});
