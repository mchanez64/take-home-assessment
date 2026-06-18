import { expect } from '@playwright/test';
import { When, Then } from '../../../../support/fixtures';
import { existingUser, generateRegistrationData } from '../../../../test-data/users';

Then("'New User Signup!' is visible", async ({ loginPage }) => {
  const visible = await loginPage.isNewUserSignupVisible();
  expect(visible).toBe(true);
});

When('I enter a new name and email and click Signup', async ({ loginPage, scenarioUser }) => {
  const user = generateRegistrationData();
  scenarioUser.newUser = user;
  await loginPage.startSignup(user.name, user.email);
});

Then("'ENTER ACCOUNT INFORMATION' is visible", async ({ registerPage }) => {
  const visible = await registerPage.isEnterAccountInfoVisible();
  expect(visible).toBe(true);
});

When('I complete the account details form with newsletter preferences', async ({ registerPage, scenarioUser }) => {
  const user = scenarioUser.newUser ?? generateRegistrationData();
  await registerPage.fillAccountDetails(user);
});

When("I click Create Account", async ({ registerPage }) => {
  await registerPage.submitRegistration();
});

Then("'ACCOUNT CREATED!' is visible", async ({ registerPage }) => {
  const created = await registerPage.isAccountCreated();
  expect(created).toBe(true);
});

When("I click Continue", async ({ registerPage }) => {
  await registerPage.continueAfterRegistration();
});

Then('I should be logged in as the new user', async ({ headerPage }) => {
  const loggedIn = await headerPage.isLoggedIn();
  expect(loggedIn).toBe(true);
});

When('I delete my account', async ({ headerPage, scenarioUser }) => {
  if (!scenarioUser.apiCreated && !scenarioUser.newUser) return;
  await headerPage.deleteAccount();
});

Then("'ACCOUNT DELETED!' is visible", async ({ headerPage, scenarioUser }) => {
  if (!scenarioUser.apiCreated && !scenarioUser.newUser) return;
  const deleted = await headerPage.isAccountDeleted();
  expect(deleted).toBe(true);
});

Then("'Login to your account' is visible", async ({ loginPage }) => {
  const visible = await loginPage.isLoginToYourAccountVisible();
  expect(visible).toBe(true);
});

When('I login with valid credentials', async ({ loginPage, scenarioUser }) => {
  const user = scenarioUser.apiCreated ?? existingUser;
  await loginPage.login(user.email, user.password);
});

When(
  'I login with email {string} and password {string}',
  async ({ loginPage }, email: string, password: string) => {
    await loginPage.login(email, password);
  },
);

Then('I should be logged in successfully', async ({ headerPage }) => {
  const loggedIn = await headerPage.isLoggedIn();
  expect(loggedIn).toBe(true);
});

Then('I should see the login error message', async ({ loginPage }) => {
  const visible = await loginPage.isLoginErrorVisible();
  expect(visible).toBe(true);
});
