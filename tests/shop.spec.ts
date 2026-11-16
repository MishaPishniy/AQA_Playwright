// Source: specs/shop-test-cases.md. TC-CART-15 is blocked by Q-02; NFRs are proposed.
import { type Locator } from '@playwright/test';
import { test, expect } from '../fixtures/testFixtures';
import { ProductCardComponent } from '../components/ProductCardComponent';
import { type CartPage } from '../pages/CartPage';
import { type InventoryPage } from '../pages/InventoryPage';

const backpack = 'Sauce Labs Backpack';
const bikeLight = 'Sauce Labs Bike Light';
const requirements = (...ids: string[]) => ({
  annotation: ids.map(description => ({ type: 'requirement', description })),
});

type ProductData = { name: string; description: string; price: string };

async function readProduct(product: { name: Locator; description: Locator; price: Locator }): Promise<ProductData> {
  await expect(product.name).toBeVisible();
  await expect(product.description).not.toHaveText('');
  await expect(product.price).not.toHaveText('');
  return {
    name: (await product.name.innerText()).trim(),
    description: (await product.description.innerText()).trim(),
    price: (await product.price.innerText()).trim(),
  };
}

async function expectContents(cart: CartPage, names: string[]) {
  await expect(cart.cartList).toBeVisible();
  await expect(cart.items).toHaveCount(names.length);
  for (const name of names) {
    await expect(cart.item(name).root).toHaveCount(1);
    await expect(cart.item(name).name).toHaveText(name);
  }
}

async function expectProductData(cart: CartPage, data: ProductData) {
  const item = cart.item(data.name);
  await expect(item.name).toHaveText(data.name);
  await expect(item.description).toHaveText(data.description);
  await expect(item.price).toHaveText(data.price);
}

async function addProducts(inventory: InventoryPage, cart: CartPage, names: string[]) {
  for (const name of names) await inventory.product(name).addToCart();
  await expect(inventory.header.cartBadge).toHaveText(String(names.length));
  await inventory.header.openCart();
  await expectContents(cart, names);
}

test.use({ username: 'standard_user', storageState: { cookies: [], origins: [] } });

test.describe('Shopping Cart — authenticated user', () => {
  test.beforeEach(async ({ loginInPage, inventoryPage, cartPage }) => {
    // Each test has its own authenticated context and verifies A0 through UI.
    await expect(loginInPage).toHaveURL(/\/inventory\.html$/);
    await inventoryPage.header.openCart();
    await expectContents(cartPage, []);
    await cartPage.continueShopping();
    await expect(inventoryPage.inventoryList).toBeVisible();
  });

  test('TC-CART-01 — кнопки всіх невибраних товарів', requirements('FR-001', 'BR-004'), async ({ inventoryPage }) => {
    await expect(inventoryPage.items.first()).toBeVisible();
    const count = await inventoryPage.items.count();
    for (let index = 0; index < count; index++) {
      const product = new ProductCardComponent(inventoryPage.items.nth(index));
      await expect(product.addButton).toBeVisible();
      await expect(product.removeButton).toBeHidden();
    }
  });

  test('TC-CART-02 — додавання одного товару з каталогу', requirements('FR-002', 'FR-003', 'FR-004', 'BR-002', 'BR-004', 'BR-005', 'AC-001'), async ({ page, inventoryPage, cartPage }) => {
    const product = inventoryPage.product(backpack);
    await product.addToCart();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(product.removeButton).toBeVisible();
    await expect(product.addButton).toBeHidden();
    await expect(inventoryPage.header.cartBadge).toHaveText('1');
    await inventoryPage.header.openCart();
    await expectContents(cartPage, [backpack]);
  });

  test('TC-CART-03 — додавання двох різних товарів', requirements('FR-002', 'FR-003', 'FR-004', 'FR-005', 'BR-001', 'BR-002', 'BR-004', 'AC-002'), async ({ inventoryPage, cartPage }) => {
    for (const name of [backpack, bikeLight]) {
      await inventoryPage.product(name).addToCart();
      await expect(inventoryPage.product(name).removeButton).toBeVisible();
      await expect(inventoryPage.product(name).addButton).toBeHidden();
    }
    await expect(inventoryPage.header.cartBadge).toHaveText('2');
    await inventoryPage.header.openCart();
    await expectContents(cartPage, [backpack, bikeLight]);
  });

  test('TC-CART-04 — відкриття кошика та дані кожного товару', requirements('FR-008', 'FR-009', 'BR-001', 'AC-004'), async ({ page, inventoryPage, cartPage }) => {
    // Relational data oracle only: no independent reference prices are specified.
    const data = await Promise.all([backpack, bikeLight].map(name => readProduct(inventoryPage.product(name))));
    await addProducts(inventoryPage, cartPage, [backpack, bikeLight]);
    await cartPage.continueShopping();
    await inventoryPage.header.openCart();
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expectContents(cartPage, [backpack, bikeLight]);
    for (const product of data) {
      await expectProductData(cartPage, product);
      await expect(cartPage.item(product.name).quantity).toBeVisible();
      await expect(cartPage.item(product.name).removeButton).toBeVisible();
    }
    await expect(cartPage.item(backpack).quantity).toHaveText('1');
  });

  test('TC-CART-05 — видалення одного з двох товарів у каталозі', requirements('FR-001', 'FR-007', 'BR-002', 'BR-003', 'BR-004', 'AC-003'), async ({ inventoryPage, cartPage }) => {
    const survivor = await readProduct(inventoryPage.product(bikeLight));
    await addProducts(inventoryPage, cartPage, [backpack, bikeLight]);
    const quantity = await cartPage.item(bikeLight).quantity.innerText();
    await cartPage.continueShopping();
    await inventoryPage.product(backpack).removeFromCart();
    await expect(inventoryPage.header.cartBadge).toHaveText('1');
    await expect(inventoryPage.product(backpack).addButton).toBeVisible();
    await expect(inventoryPage.product(backpack).removeButton).toBeHidden();
    await expect(inventoryPage.product(bikeLight).removeButton).toBeVisible();
    await inventoryPage.header.openCart();
    await expectContents(cartPage, [bikeLight]);
    await expectProductData(cartPage, survivor);
    await expect(cartPage.item(bikeLight).quantity).toHaveText(quantity);
  });

  test('TC-CART-06 — видалення одного з двох товарів у кошику', requirements('FR-001', 'FR-007', 'BR-002', 'BR-003', 'BR-004', 'AC-003'), async ({ inventoryPage, cartPage }) => {
    const survivor = await readProduct(inventoryPage.product(bikeLight));
    await addProducts(inventoryPage, cartPage, [backpack, bikeLight]);
    const quantity = await cartPage.item(bikeLight).quantity.innerText();
    await cartPage.item(backpack).removeFromCart();
    await expectContents(cartPage, [bikeLight]);
    await expectProductData(cartPage, survivor);
    await expect(cartPage.item(bikeLight).quantity).toHaveText(quantity);
    await expect(cartPage.header.cartBadge).toHaveText('1');
    await cartPage.continueShopping();
    await expect(inventoryPage.product(backpack).addButton).toBeVisible();
    await expect(inventoryPage.product(backpack).removeButton).toBeHidden();
    await expect(inventoryPage.product(bikeLight).removeButton).toBeVisible();
  });

  test('TC-CART-07 — видалення останнього товару', requirements('FR-001', 'FR-007', 'FR-011', 'BR-002', 'BR-004'), async ({ inventoryPage, cartPage }) => {
    await addProducts(inventoryPage, cartPage, [backpack]);
    await cartPage.item(backpack).removeFromCart();
    await expectContents(cartPage, []);
    await expect(cartPage.header.cartBadge).toBeHidden();
    await cartPage.continueShopping();
    await expect(inventoryPage.product(backpack).addButton).toBeVisible();
    await expect(inventoryPage.product(backpack).removeButton).toBeHidden();
  });

  test('TC-CART-08 — додавання з деталей товару', requirements('FR-002', 'FR-004', 'FR-012', 'BR-002', 'BR-005'), async ({ page, inventoryPage, productDetailsPage, cartPage }) => {
    await inventoryPage.product(backpack).openDetails();
    await expect(productDetailsPage.product.name).toHaveText(backpack);
    await productDetailsPage.product.addToCart();
    await expect(productDetailsPage.header.cartBadge).toHaveText('1');
    await expect(page).not.toHaveURL(/\/cart\.html$/);
    await productDetailsPage.header.openCart();
    await expectContents(cartPage, [backpack]);
    await expect(cartPage.item(backpack).quantity).toHaveText('1');
  });

  test('TC-CART-09 — Continue Shopping зберігає товар', requirements('FR-010', 'FR-013', 'BR-002', 'AC-005'), async ({ page, inventoryPage, cartPage }) => {
    const data = await readProduct(inventoryPage.product(backpack));
    await addProducts(inventoryPage, cartPage, [backpack]);
    await cartPage.continueShopping();
    await inventoryPage.header.openCart();
    await cartPage.continueShopping();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventoryPage.inventoryList).toBeVisible();
    await inventoryPage.header.openCart();
    await expectContents(cartPage, [backpack]);
    await expectProductData(cartPage, data);
    await expect(cartPage.item(backpack).quantity).toHaveText('1');
    await expect(cartPage.header.cartBadge).toHaveText('1');
  });

  test('TC-CART-10 — каталог → деталі → кошик', requirements('FR-010', 'BR-001', 'BR-002'), async ({ inventoryPage, productDetailsPage, cartPage }) => {
    const data = await readProduct(inventoryPage.product(backpack));
    await addProducts(inventoryPage, cartPage, [backpack]);
    await cartPage.continueShopping();
    await inventoryPage.product(backpack).openDetails();
    await expect(productDetailsPage.product.name).toHaveText(backpack);
    await productDetailsPage.header.openCart();
    await expectContents(cartPage, [backpack]);
    await expectProductData(cartPage, data);
    await expect(cartPage.item(backpack).quantity).toHaveText('1');
    await expect(cartPage.header.cartBadge).toHaveText('1');
  });

  test('TC-CART-11 — кошик → деталі → каталог → кошик', requirements('FR-010', 'BR-002'), async ({ page, inventoryPage, productDetailsPage, cartPage }) => {
    const data = await readProduct(inventoryPage.product(backpack));
    await addProducts(inventoryPage, cartPage, [backpack]);
    await cartPage.item(backpack).openDetails();
    await expect(productDetailsPage.product.name).toHaveText(backpack);
    await productDetailsPage.backToProducts();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await inventoryPage.header.openCart();
    await expectContents(cartPage, [backpack]);
    await expectProductData(cartPage, data);
    await expect(cartPage.item(backpack).quantity).toHaveText('1');
    await expect(cartPage.header.cartBadge).toHaveText('1');
  });

  test('TC-CART-12 — кнопка каталогу після навігації відповідає кошику', requirements('FR-001', 'FR-003', 'BR-004'), async ({ inventoryPage, cartPage }) => {
    await addProducts(inventoryPage, cartPage, [backpack]);
    await cartPage.continueShopping();
    await expect(inventoryPage.product(backpack).removeButton).toBeVisible();
    await expect(inventoryPage.product(backpack).addButton).toBeHidden();
    await expect(inventoryPage.product(bikeLight).addButton).toBeVisible();
    await expect(inventoryPage.product(bikeLight).removeButton).toBeHidden();
  });

  test('TC-CART-13 — доступність Checkout у непорожньому кошику', requirements('FR-014'), async ({ inventoryPage, cartPage }) => {
    // Partial FR-014: checkout destination is unspecified (Q-05).
    await addProducts(inventoryPage, cartPage, [backpack]);
    await expect(cartPage.checkoutButton).toBeVisible();
    await expect(cartPage.checkoutButton).toBeEnabled();
  });
});

test('TC-CART-14 — анонімний прямий доступ до кошика', requirements('BR-006'), async ({ page, loginPage, cartPage }, testInfo) => {
  await page.goto('/cart.html');
  // Positive evidence that the app rendered a denial/login UI, rather than a blank page.
  // No exact redirect, error text or HTTP status is asserted by this requirement.
  await expect(loginPage.loginButton.or(loginPage.errorMessage).first()).toBeVisible();
  await expect(cartPage.cartList).toBeHidden();
  await expect(cartPage.checkoutButton).toBeHidden();
  await expect(cartPage.continueShoppingButton).toBeHidden();
  await testInfo.attach('anonymous-cart-outcome', {
    body: JSON.stringify({ pathname: new URL(page.url()).pathname }),
    contentType: 'application/json',
  });
});
