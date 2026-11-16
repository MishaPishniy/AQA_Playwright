import { type Locator } from '@playwright/test';

export class CartItemComponent {
  readonly name: Locator;
  readonly description: Locator;
  readonly price: Locator;
  readonly quantity: Locator;
  readonly removeButton: Locator;

  constructor(readonly root: Locator) {
    this.name = root.locator('[data-test="inventory-item-name"]');
    this.description = root.locator('[data-test="inventory-item-desc"]');
    this.price = root.locator('[data-test="inventory-item-price"]');
    this.quantity = root.locator('[data-test="item-quantity"]');
    this.removeButton = root.getByRole('button', { name: 'Remove', exact: true });
  }

  async removeFromCart() {
    await this.removeButton.click();
  }

  async openDetails() {
    await this.name.click();
  }
}
