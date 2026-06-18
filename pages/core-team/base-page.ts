import { Page } from '@playwright/test';

export abstract class BasePage {
  protected readonly baseUrl = 'https://automationexercise.com';

  constructor(protected readonly page: Page) {}

  async navigate(path = ''): Promise<void> {
    await this.page.goto(`${this.baseUrl}${path}`, { waitUntil: 'domcontentloaded' });
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async dismissCookieConsent(): Promise<void> {
    await this.page.evaluate(() => {
      const el = document.querySelector<HTMLElement>('.fc-consent-root');
      if (el) {
        el.style.setProperty('display', 'none', 'important');
        el.style.setProperty('pointer-events', 'none', 'important');
        if (document.body) document.body.style.overflow = '';
      }
    });
  }
}
