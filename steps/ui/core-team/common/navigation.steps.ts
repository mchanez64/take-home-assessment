import { expect } from '@playwright/test';
import { Given, When, Then } from '../../../../support/fixtures';

Given('I navigate to the home page', async ({ homePage }) => {
  await homePage.goto();
});

Then('the home page is visible', async ({ homePage }) => {
  const visible = await homePage.isVisible();
  expect(visible).toBe(true);
});

When('I click on Signup Login', async ({ headerPage }) => {
  await headerPage.goToLoginPage();
});

When('I click on Products', async ({ headerPage }) => {
  await headerPage.goToProducts();
});
