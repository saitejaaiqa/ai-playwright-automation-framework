import { test, expect } from '@playwright/test';
import { DemoApi } from '../api/demoApi';

test.describe('Demo API validation', () => {
  test('GET API returns a valid JSON payload and passes schema validation', async ({ request }) => {
    const api = new DemoApi(request);
    const post = await api.validatePostResponse(1);

    expect(post).toHaveProperty('userId', 1);
    expect(post).toHaveProperty('id', 1);
    expect(post).toHaveProperty('title');
    expect(post).toHaveProperty('body');
    expect(typeof post.userId).toBe('number');
    expect(typeof post.id).toBe('number');
    expect(typeof post.title).toBe('string');
    expect(typeof post.body).toBe('string');
  });

  test('GET API validates HTTP status, response structure, and required fields', async ({ request }) => {
    const api = new DemoApi(request);
    const response = await api.getPost(1);

    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();
    expect(response.body).toEqual(expect.objectContaining({
      id: 1,
    }));
    expect(response.body).toHaveProperty('userId');
    expect(response.body).toHaveProperty('title');
    expect(response.body).toHaveProperty('body');
    expect(typeof response.body.userId).toBe('number');
    expect(typeof response.body.id).toBe('number');
    expect(typeof response.body.title).toBe('string');
    expect(typeof response.body.body).toBe('string');

    api.validateSchema(response.body);
  });
});
