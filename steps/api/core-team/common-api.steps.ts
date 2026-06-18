import { expect } from '@playwright/test';
import { When, Then } from '../../../support/fixtures';
import { ApiClient } from '../../../support/helpers/api-client';

When('I send a GET request to {string}', async ({ request, apiResponse, apiResponseBody }, endpoint: string) => {
  const client = new ApiClient(request);
  apiResponse.value = await client.get(endpoint);
  apiResponseBody.value = await apiResponse.value.json();
});

Then('the response status should be {int}', async ({ apiResponse }, statusCode: number) => {
  expect(apiResponse.value!.status()).toBe(statusCode);
});
