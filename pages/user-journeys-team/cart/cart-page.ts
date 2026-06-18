import { Page, Locator } from '@playwright/test';
import { BasePage } from '../../core-team/base-page';

export interface CartItemDetails {
  name: string;
  price: string;
  quantity: string;
  total: string;
}

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly cartTable: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('#cart_info_table tbody tr');
    this.cartTable = page.locator('#cart_info_table');
  }

  async goto(): Promise<void> {
    await this.navigate('/view_cart');
  }

  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getItemDetails(): Promise<CartItemDetails[]> {
    const count = await this.cartItems.count();
    const items: CartItemDetails[] = [];
    for (let i = 0; i < count; i++) {
      const row = this.cartItems.nth(i);
      items.push({
        name: ((await row.locator('h4 a').textContent()) ?? '').trim(),
        price: ((await row.locator('.cart_price p').textContent()) ?? '').trim(),
        quantity: ((await row.locator('.cart_quantity button').textContent()) ?? '').trim(),
        total: ((await row.locator('.cart_total p').textContent()) ?? '').trim(),
      });
    }
    return items;
  }

}
