import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly summaryInfo: Locator;
  readonly totalLabel: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.summaryInfo = page.locator('.summary_info');
    this.totalLabel = page.locator('.summary_total_label');
    this.successMessage = page.locator('[data-test="complete-header"]');
  }

  async enterCustomerDetails(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueCheckout() {
    await this.continueButton.click();
  }

  async validateOrderSummary() {
    await expect(this.summaryInfo).toBeVisible();
    await expect(this.totalLabel).toContainText('Total');
  }

  async completePurchase() {
    await this.finishButton.click();
  }

  async validateSuccessMessage() {
    await expect(this.successMessage).toHaveText('Thank you for your order!');
  }
}
