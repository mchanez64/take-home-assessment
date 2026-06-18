import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base-page';

export class HomePage extends BasePage {
  readonly slider: Locator;

  constructor(page: Page) {
    super(page);
    this.slider = page.locator('#slider');
  }

  async goto(): Promise<void> {
    await this.navigate('/');
  }

  async isVisible(): Promise<boolean> {
    return this.slider.isVisible({ timeout: 5000 }).catch(() => false);
  }
}
