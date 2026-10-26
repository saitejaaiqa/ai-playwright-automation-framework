import { test, expect } from '@playwright/test';
import { DemoApi } from '../api/demoApi';

test.describe('Demo API validation', () => {
  test('GET API returns a valid JSON payload', async ({ request }) => {
    const api = new DemoApi(request);
    const post = await api.validatePostResponse(1);

    expect(post).toHaveProperty('userId', 1);
    expect(post).toHaveProperty('id', 1);
    expect(post).toHaveProperty('title');
    expect(post).toHaveProperty('body');
  });

  test('GET API returns HTTP 200 status and JSON response', async ({ request }) => {
    const api = new DemoApi(request);
    const response = await api.getPost(1);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
    expect(typeof response.body.title).toBe('string');
  });
});
