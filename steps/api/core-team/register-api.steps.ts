import { expect } from '@playwright/test';
import { Given } from '../../../support/fixtures';
import { generateRegistrationData } from '../../../test-data/users';
import { ApiClient } from '../../../support/helpers/api-client';

Given('I create a new account by API', async ({ request, scenarioUser }) => {
  const user = generateRegistrationData();
  const client = new ApiClient(request);
  const response = await client.post('/api/createAccount', {
    name: user.name,
    email: user.email,
    password: user.password,
    title: 'Mr',
    birth_date: '1',
    birth_month: '1',
    birth_year: '1990',
    firstname: user.firstName,
    lastname: user.lastName,
    address1: user.address,
    country: user.country,
    state: user.state,
    city: user.city,
    zipcode: user.zipcode,
    mobile_number: user.mobile,
  });
  const body = await response.json();
  expect(body.responseCode).toBe(201);
  scenarioUser.apiCreated = { email: user.email, password: user.password, name: user.name };
});
