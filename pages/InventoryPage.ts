import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  readonly productTitle: Locator;
  readonly productItems: Locator;
  readonly cartButton: Locator;

  constructor(page: Page) {
    super(page);

    this.productTitle = page.locator('.title');
    this.productItems = page.locator('.inventory_item');
    this.cartButton = page.locator('[data-test="shopping-cart-link"]');
  }

  async addToCart(productId: string) {
    await this.page.locator(`[data-test="add-to-cart-${productId}"]`).click();
  }

  async openCart() {
    await this.cartButton.click();
  }

  async logout() {
    await this.page.locator('#react-burger-menu-btn').click();
    await this.page.getByText('Logout').click();
  }
}
