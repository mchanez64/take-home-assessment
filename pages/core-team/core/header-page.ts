import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base-page';

export class HeaderPage extends BasePage {
  readonly loginSignupLink: Locator;
  readonly loggedInAs: Locator;
  readonly logoutLink: Locator;
  readonly cartLink: Locator;
  readonly productsLink: Locator;
  readonly deleteAccountLink: Locator;
  readonly accountDeletedHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.loginSignupLink = page.locator('a[href="/login"]');
    this.loggedInAs = page.locator('li:has-text("Logged in as") b');
    this.logoutLink = page.locator('a[href="/logout"]');
    this.cartLink = page.locator('a[href="/view_cart"]').first();
    this.productsLink = page.locator('a[href="/products"]');
    this.deleteAccountLink = page.locator('a[href="/delete_account"]');
    this.accountDeletedHeading = page.locator('h2[data-qa="account-deleted"]');
  }

  async isLoggedIn(): Promise<boolean> {
    return this.loggedInAs.isVisible({ timeout: 3000 }).catch(() => false);
  }

  async goToLoginPage(): Promise<void> {
    await this.loginSignupLink.click();
    await this.waitForPageLoad();
  }

  async goToProducts(): Promise<void> {
    await this.productsLink.click();
    await this.waitForPageLoad();
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
    await this.waitForPageLoad();
  }

  async deleteAccount(): Promise<void> {
    await this.deleteAccountLink.click();
    await this.waitForPageLoad();
  }

  async isAccountDeleted(): Promise<boolean> {
    return this.accountDeletedHeading.isVisible({ timeout: 5000 }).catch(() => false);
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
    await this.waitForPageLoad();
  }
}
