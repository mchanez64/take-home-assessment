import { test as base, createBdd } from 'playwright-bdd';
import { APIResponse } from '@playwright/test';
import { HomePage } from '../../pages/core-team/core/home-page';
import { LoginPage } from '../../pages/core-team/auth/login-page';
import { RegisterPage } from '../../pages/core-team/auth/register-page';
import { ProductListPage } from '../../pages/user-journeys-team/products/product-list-page';
import { CartPage } from '../../pages/user-journeys-team/cart/cart-page';
import { HeaderPage } from '../../pages/core-team/core/header-page';
import { RegistrationDetails } from '../../test-data/users';

// ── Shared state fixture types ────────────────────────────────────────────────

export type ApiResponseState = {
  value: APIResponse | null;
};

export type ApiBodyState = {
  value: Record<string, unknown>;
};

export type ScenarioUserState = {
  apiCreated: { email: string; password: string; name: string } | null;
  newUser: RegistrationDetails | null;
};

export type CartState = {
  products: Array<{ name: string; price: string }>;
};

// ── Fixture registry ──────────────────────────────────────────────────────────

type CustomFixtures = {
  // UI page objects
  homePage: HomePage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
  productListPage: ProductListPage;
  cartPage: CartPage;
  headerPage: HeaderPage;
  // Shared scenario state
  apiResponse: ApiResponseState;
  apiResponseBody: ApiBodyState;
  scenarioUser: ScenarioUserState;
  cartState: CartState;
};

export const test = base.extend<CustomFixtures>({
  homePage:        async ({ page }, use) => use(new HomePage(page)),
  loginPage:       async ({ page }, use) => use(new LoginPage(page)),
  registerPage:    async ({ page }, use) => use(new RegisterPage(page)),
  productListPage: async ({ page }, use) => use(new ProductListPage(page)),
  cartPage:        async ({ page }, use) => use(new CartPage(page)),
  headerPage:      async ({ page }, use) => use(new HeaderPage(page)),
  apiResponse:     async ({}, use) => use({ value: null }),
  apiResponseBody: async ({}, use) => use({ value: {} }),
  scenarioUser:    async ({}, use) => use({ apiCreated: null, newUser: null }),
  cartState:       async ({}, use) => use({ products: [] }),
});

export const { Given, When, Then, Before } = createBdd(test);

Before(async ({ page }) => {
  await page.route(/fundingchoicesmessages\.google\.com/, route => route.abort());
  await page.addInitScript(() => {
    const style = document.createElement('style');
    style.textContent = '.fc-consent-root { display: none !important; pointer-events: none !important; }';
    document.documentElement.appendChild(style);
  });
});
