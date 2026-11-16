import { type Page, type Locator } from "@playwright/test";
import { HeaderComponent } from "../components/HeaderComponent";
import { ProductCardComponent } from '../components/ProductCardComponent';

export class InventoryPage {
  readonly page: Page;

  readonly header: HeaderComponent;

  readonly sortDropdown: Locator;
  readonly title: Locator;
  readonly inventoryList: Locator;
  readonly items: Locator;
  readonly prices: Locator;

  constructor(page: Page) {
    this.page = page;

    this.header = new HeaderComponent(page);

    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.title = page.locator('[data-test="title"]');
    this.inventoryList = page.locator('[data-test="inventory-list"]');
    this.items = page.locator('[data-test="inventory-item"]');
    this.prices = this.items.locator('[data-test="inventory-item-price"]');
  }


  product(productName: string): ProductCardComponent {
    const root = this.items.filter({
      has: this.page.getByText(productName, { exact: true }),
    });

    return new ProductCardComponent(root);
  }

  async sortByPriceLowToHigh() {
    await this.sortDropdown.selectOption("lohi");
  }
}
