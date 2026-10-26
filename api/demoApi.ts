import { APIRequestContext, expect } from '@playwright/test';
import { env } from '../utils/env';

export class DemoApi {
  constructor(private readonly request: APIRequestContext) {}

  async getPost(postId = 1): Promise<{ status: number; body: any }> {
    const response = await this.request.get(`${env.apiBaseUrl}/posts/${postId}`);
    const body = await response.json();

    return {
      status: response.status(),
      body,
    };
  }

  async validatePostResponse(postId = 1): Promise<any> {
    const { status, body } = await this.getPost(postId);

    expect(status).toBe(200);
    expect(body).toHaveProperty('userId');
    expect(body).toHaveProperty('id', postId);
    expect(body).toHaveProperty('title');
    expect(body).toHaveProperty('body');

    return body;
  }
}
