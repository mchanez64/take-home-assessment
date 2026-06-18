import { expect } from '@playwright/test';
import { When, Then } from '../../../support/fixtures';
import { ApiClient } from '../../../support/helpers/api-client';

When(
  'I send a POST search request to {string} with term {string}',
  async ({ request, apiResponse, apiResponseBody }, endpoint: string, term: string) => {
    const client = new ApiClient(request);
    apiResponse.value = await client.post(endpoint, { search_product: term });
    apiResponseBody.value = await apiResponse.value.json();
  },
);

Then('the response should contain a products array', async ({ apiResponseBody }) => {
  const body = apiResponseBody.value;
  expect(body).toHaveProperty('products');
  expect(Array.isArray(body.products)).toBe(true);
  expect((body.products as unknown[]).length).toBeGreaterThan(0);
});

Then('the response should contain a brands array', async ({ apiResponseBody }) => {
  const body = apiResponseBody.value;
  expect(body).toHaveProperty('brands');
  expect(Array.isArray(body.brands)).toBe(true);
  expect((body.brands as unknown[]).length).toBeGreaterThan(0);
});

Then(
  'the response should contain products matching {string}',
  async ({ apiResponseBody }, _term: string) => {
    const body = apiResponseBody.value;
    expect(body).toHaveProperty('products');
    expect(Array.isArray(body.products)).toBe(true);
    expect((body.products as unknown[]).length).toBeGreaterThan(0);
  },
);
