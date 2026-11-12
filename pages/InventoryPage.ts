import { type Page, type Locator } from "@playwright/test";
import { HeaderComponent } from "../components/HeaderComponent";
import { ProductCardComponent } from '../components/ProductCardComponent';

export class InventoryPage {
  readonly page: Page;

  readonly header: HeaderComponent;

  readonly sortDropdown: Locator;

  constructor(page: Page) {
    this.page = page;

    this.header = new HeaderComponent(page);

    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
  }


  product(productName: string): ProductCardComponent {
  const root = this.page
    .locator('[data-test="inventory-item"]')
    .filter({
      has: this.page
        .locator('[data-test="inventory-item-name"]')
        .getByText(productName, { exact: true })
    });

  return new ProductCardComponent(root);
}

  async sortByPriceLowToHigh() {
    await this.sortDropdown.selectOption("lohi");
  }
}
