import { type Locator, type Page } from '@playwright/test';
import { HeaderComponent } from '../components/HeaderComponent';
import { ProductCardComponent } from '../components/ProductCardComponent';

export class ProductDetailsPage {
  readonly header: HeaderComponent;
  readonly product: ProductCardComponent;
  readonly backToProductsButton: Locator;

  constructor(page: Page) {
    this.header = new HeaderComponent(page);
    this.product = new ProductCardComponent(page.locator('[data-test="inventory-item"]'));
    this.backToProductsButton = page.getByRole('button', { name: 'Back to products', exact: true });
  }

  async backToProducts() {
    await this.backToProductsButton.click();
  }
}
