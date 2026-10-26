import { Page } from '@playwright/test';
import { env } from '../utils/env';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path = '/') {
    await this.page.goto(`${env.baseUrl}${path}`);
  }

  async waitForPageReady() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async captureScreenshot(fileName: string) {
    const screenshotPath = `screenshots/${fileName}.png`;
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    return screenshotPath;
  }
}
