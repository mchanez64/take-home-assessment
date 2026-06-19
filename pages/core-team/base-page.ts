import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  protected readonly baseUrl = 'https://automationexercise.com';

  constructor(protected readonly page: Page) {}

  async navigate(path = ''): Promise<void> {
    await this.page.goto(`${this.baseUrl}${path}`, { waitUntil: 'domcontentloaded' });
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Use for form button submissions (POST) only — not plain link clicks.
  // Regular link navigation is fast enough for waitForPageLoad; form submissions
  // (POST + server round-trip) can start the navigation after waitForPageLoad
  // already resolves in WebKit, causing a race condition.
  protected async submitAndNavigate(locator: Locator): Promise<void> {
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 15000 }),
      locator.click(),
    ]);
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
