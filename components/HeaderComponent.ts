
import { type Page, type Locator } from '@playwright/test';

export class HeaderComponent {
  readonly cartButton: Locator;
  readonly cartBadge: Locator;
  readonly menuButton: Locator;

  constructor(page: Page) {
    this.cartButton = page.locator(
      '[data-test="shopping-cart-link"]'
    );

    this.cartBadge = page.locator(
      '[data-test="shopping-cart-badge"]'
    );

    this.menuButton = page.locator('#react-burger-menu-btn');
  }

  async openCart() {
    await this.cartButton.click();
  }

  async openMenu() {
    await this.menuButton.click();
  }
}
