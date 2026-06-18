import { expect } from '@playwright/test';
import { When, Then } from '../../../../support/fixtures';

Then('I should be on the All Products page', async ({ productListPage }) => {
  const onPage = await productListPage.isOnAllProductsPage();
  expect(onPage).toBe(true);
});

When('I search for {string}', async ({ productListPage }, term: string) => {
  await productListPage.searchFor(term);
});

Then('I should see the searched products heading', async ({ productListPage }) => {
  const visible = await productListPage.isSearchResultsHeadingVisible();
  expect(visible).toBe(true);
});

Then('I should see at least one product result', async ({ productListPage }) => {
  const count = await productListPage.getProductCount();
  expect(count).toBeGreaterThan(0);
});

When('I hover over the first product and add it to cart', async ({ productListPage, cartState }) => {
  const product = await productListPage.hoverAndAddToCart(0);
  cartState.products = [product];
});

When('I click Continue Shopping', async ({ productListPage }) => {
  await productListPage.clickContinueShopping();
});

When('I hover over the second product and add it to cart', async ({ productListPage, cartState }) => {
  const product = await productListPage.hoverAndAddToCart(1);
  cartState.products = [...cartState.products, product];
});

When('I click View Cart', async ({ productListPage }) => {
  await productListPage.clickViewCart();
});

Then('both products should be added to the cart', async ({ cartPage }) => {
  const itemCount = await cartPage.getCartItemCount();
  expect(itemCount).toBeGreaterThanOrEqual(2);

  const items = await cartPage.getItemDetails();
  expect(items.length).toBeGreaterThanOrEqual(2);
  for (const item of items) {
    expect(item.name).toBeTruthy();
  }
});

Then('the cart should display correct prices quantity and total', async ({ cartPage }) => {
  const items = await cartPage.getItemDetails();
  expect(items.length).toBeGreaterThanOrEqual(2);

  for (const item of items) {
    expect(item.price).toBeTruthy();
    expect(item.quantity).toBeTruthy();
    expect(item.total).toBeTruthy();
    expect(item.quantity).toBe('1');
    expect(item.total).toBe(item.price);
  }
});
