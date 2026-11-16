import { type Locator, type Page } from '@playwright/test';
import { HeaderComponent } from '../components/HeaderComponent';
import { CartItemComponent } from '../components/CartItemComponent';

export class CartPage {
  readonly header: HeaderComponent;
  readonly cartList: Locator;
  readonly items: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(readonly page: Page) {
    this.header = new HeaderComponent(page);
    this.cartList = page.locator('[data-test="cart-list"]');
    this.items = this.cartList.locator('[data-test="inventory-item"]');
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping', exact: true });
    this.checkoutButton = page.getByRole('button', { name: 'Checkout', exact: true });
  }

  item(name: string): CartItemComponent {
    return new CartItemComponent(this.items.filter({ has: this.page.getByText(name, { exact: true }) }));
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}
