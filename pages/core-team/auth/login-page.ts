import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base-page';

export class LoginPage extends BasePage {
  readonly loginEmailInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginButton: Locator;
  readonly loginErrorMessage: Locator;
  readonly loginToYourAccountHeading: Locator;
  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupButton: Locator;
  readonly newUserSignupHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.loginEmailInput = page.locator('input[data-qa="login-email"]');
    this.loginPasswordInput = page.locator('input[data-qa="login-password"]');
    this.loginButton = page.locator('button[data-qa="login-button"]');
    this.loginErrorMessage = page.locator('p:has-text("Your email or password is incorrect!")');
    this.loginToYourAccountHeading = page.locator('h2:has-text("Login to your account")');
    this.signupNameInput = page.locator('input[data-qa="signup-name"]');
    this.signupEmailInput = page.locator('input[data-qa="signup-email"]');
    this.signupButton = page.locator('button[data-qa="signup-button"]');
    this.newUserSignupHeading = page.locator('h2:has-text("New User Signup!")');
  }

  async goto(): Promise<void> {
    await this.navigate('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginButton.click();
    await this.waitForPageLoad();
  }

  async startSignup(name: string, email: string): Promise<void> {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
    await this.waitForPageLoad();
  }

  async isLoginToYourAccountVisible(): Promise<boolean> {
    return this.loginToYourAccountHeading.isVisible({ timeout: 5000 }).catch(() => false);
  }

  async isNewUserSignupVisible(): Promise<boolean> {
    return this.newUserSignupHeading.isVisible({ timeout: 5000 }).catch(() => false);
  }

  async isLoginErrorVisible(): Promise<boolean> {
    return this.loginErrorMessage.isVisible({ timeout: 3000 }).catch(() => false);
  }
}
