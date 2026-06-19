import { Page, Locator } from '@playwright/test';
import { BasePage } from '../../core-team/base-page';

export class ProductListPage extends BasePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly productCards: Locator;
  readonly allProductsHeading: Locator;
  readonly searchedProductsHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.productCards = page.locator('.product-image-wrapper');
    this.allProductsHeading = page.locator('h2:has-text("All Products")');
    this.searchedProductsHeading = page.locator('h2:has-text("Searched Products")');
  }

  async goto(): Promise<void> {
    await this.navigate('/products');
  }

  async isOnAllProductsPage(): Promise<boolean> {
    return this.allProductsHeading.isVisible({ timeout: 5000 }).catch(() => false);
  }

  async searchFor(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.submitAndNavigate(this.searchButton);
  }

  async getProductCount(): Promise<number> {
    return this.productCards.count();
  }

  async isSearchResultsHeadingVisible(): Promise<boolean> {
    return this.searchedProductsHeading.isVisible({ timeout: 5000 }).catch(() => false);
  }

  async hoverAndAddToCart(index: number): Promise<{ name: string; price: string }> {
    const card = this.productCards.nth(index);
    const name = ((await card.locator('.productinfo h2').textContent()) ?? '').trim();
    const price = ((await card.locator('.productinfo p').textContent()) ?? '').trim();
    await this.dismissCookieConsent();
    await card.hover();
    // Wait for the overlay animation to complete before clicking
    const overlayBtn = card.locator('.product-overlay .btn');
    await overlayBtn.waitFor({ state: 'visible', timeout: 5000 });
    await overlayBtn.click();
    // Wait for the cart modal to appear before the caller proceeds
    await this.page.locator('#cartModal').waitFor({ state: 'visible', timeout: 5000 });
    return { name, price };
  }

  async clickContinueShopping(): Promise<void> {
    await this.dismissCookieConsent();
    const continueBtn = this.page.locator('button:has-text("Continue Shopping")');
    await continueBtn.click();
    // Wait for the modal to fully close rather than a hardcoded sleep
    await continueBtn.waitFor({ state: 'hidden', timeout: 5000 });
  }

  async clickViewCart(): Promise<void> {
    await this.page.locator('#cartModal .modal-body a:has-text("View Cart")').click();
    // Wait for the cart table to be present rather than domcontentloaded,
    // which times out on this site due to ad scripts firing after page load.
    await this.page.locator('#cart_info_table').waitFor({ state: 'visible', timeout: 15000 });
  }

}
