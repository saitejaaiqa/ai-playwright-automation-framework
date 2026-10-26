import { APIRequestContext, expect } from '@playwright/test';
import { env } from '../utils/env';

export class SauceDemoApi {
  constructor(private readonly request: APIRequestContext) {}

  async getInventory(): Promise<{ status: number; body: any[] }> {
    const response = await this.request.get(`${env.apiBaseUrl}/inventory.json`);
    const body = await response.json();

    return {
      status: response.status(),
      body,
    };
  }

  async validateProductList(): Promise<any[]> {
    const { status, body } = await this.getInventory();

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);

    return body;
  }
}
