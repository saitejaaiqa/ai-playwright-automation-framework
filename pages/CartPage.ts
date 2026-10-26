import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('.cart_item');
  }

  cartItemName(name: string) {
    return this.cartItems.filter({ hasText: name });
  }
}
