
import { type Locator } from '@playwright/test';

export class ProductCardComponent {
  readonly name: Locator;
  readonly price: Locator;
  readonly addButton: Locator;
  readonly removeButton: Locator;

  constructor(readonly root: Locator) {
    this.name = root.locator(
      '[data-test="inventory-item-name"]'
    );

    this.price = root.locator(
      '[data-test="inventory-item-price"]'
    );

    this.addButton = root.getByRole('button', {
      name: 'Add to cart'
    });

    this.removeButton = root.getByRole('button', {
      name: 'Remove'
    });
  }

  async addToCart() {
    await this.addButton.click();
  }

  async removeFromCart() {
    await this.removeButton.click();
  }

  async getPriceText(): Promise<string> {
    return await this.price.innerText();
  }
}
