import { APIRequestContext, APIResponse } from '@playwright/test';

const BASE_URL = 'https://automationexercise.com';

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async get(endpoint: string): Promise<APIResponse> {
    return this.request.get(`${BASE_URL}${endpoint}`);
  }

  async post(endpoint: string, formData: Record<string, string>): Promise<APIResponse> {
    return this.request.post(`${BASE_URL}${endpoint}`, { form: formData });
  }
}
