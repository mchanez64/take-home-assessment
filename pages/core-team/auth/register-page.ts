import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base-page';
import { RegistrationDetails } from '../../../test-data/users';

export class RegisterPage extends BasePage {
  readonly enterAccountInfoHeading: Locator;
  readonly newsletterCheckbox: Locator;
  readonly offersCheckbox: Locator;
  readonly passwordInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addressInput: Locator;
  readonly countrySelect: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly zipcodeInput: Locator;
  readonly mobileInput: Locator;
  readonly createAccountButton: Locator;
  readonly accountCreatedHeading: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.enterAccountInfoHeading = page.locator('b:has-text("Enter Account Information")');
    this.newsletterCheckbox = page.locator('#newsletter');
    this.offersCheckbox = page.locator('#optin');
    this.passwordInput = page.locator('input[data-qa="password"]');
    this.firstNameInput = page.locator('input[data-qa="first_name"]');
    this.lastNameInput = page.locator('input[data-qa="last_name"]');
    this.addressInput = page.locator('input[data-qa="address"]');
    this.countrySelect = page.locator('select[data-qa="country"]');
    this.stateInput = page.locator('input[data-qa="state"]');
    this.cityInput = page.locator('input[data-qa="city"]');
    this.zipcodeInput = page.locator('input[data-qa="zipcode"]');
    this.mobileInput = page.locator('input[data-qa="mobile_number"]');
    this.createAccountButton = page.locator('button[data-qa="create-account"]');
    this.accountCreatedHeading = page.locator('h2[data-qa="account-created"]');
    this.continueButton = page.locator('a[data-qa="continue-button"]');
  }

  async isEnterAccountInfoVisible(): Promise<boolean> {
    return this.enterAccountInfoHeading.isVisible({ timeout: 5000 }).catch(() => false);
  }

  async fillAccountDetails(details: RegistrationDetails): Promise<void> {
    await this.page.locator('#id_gender1').check();
    await this.passwordInput.fill(details.password);
    await this.page.locator('select[data-qa="days"]').selectOption('1');
    await this.page.locator('select[data-qa="months"]').selectOption('January');
    await this.page.locator('select[data-qa="years"]').selectOption('1990');
    await this.dismissCookieConsent();
    await this.newsletterCheckbox.check();
    await this.offersCheckbox.check();
    await this.firstNameInput.fill(details.firstName);
    await this.lastNameInput.fill(details.lastName);
    await this.addressInput.fill(details.address);
    await this.countrySelect.selectOption(details.country);
    await this.stateInput.fill(details.state);
    await this.cityInput.fill(details.city);
    await this.zipcodeInput.fill(details.zipcode);
    await this.mobileInput.fill(details.mobile);
  }

  async submitRegistration(): Promise<void> {
    await this.dismissCookieConsent();
    await this.createAccountButton.click();
    await this.waitForPageLoad();
  }

  async isAccountCreated(): Promise<boolean> {
    return this.accountCreatedHeading.isVisible({ timeout: 10000 }).catch(() => false);
  }

  async continueAfterRegistration(): Promise<void> {
    await this.continueButton.click();
    await this.waitForPageLoad();
  }
}
