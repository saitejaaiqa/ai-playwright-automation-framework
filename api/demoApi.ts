import { APIRequestContext, expect } from '@playwright/test';
import Ajv, { ErrorObject } from 'ajv';
import { env } from '../utils/env';
import userSchema from './schema/userSchema.json';

export class DemoApi {
  private readonly ajv: Ajv;

  constructor(private readonly request: APIRequestContext) {
    this.ajv = new Ajv({ allErrors: true, strict: false });
  }

  async getPost(postId = 1): Promise<{ status: number; body: any }> {
    const response = await this.request.get(`${env.apiBaseUrl}/posts/${postId}`);
    const body = await response.json();

    return {
      status: response.status(),
      body,
    };
  }

  validateSchema(data: unknown): void {
    const validate = this.ajv.compile(userSchema);
    const isValid = validate(data);

    if (!isValid && validate.errors) {
      const errorSummary = validate.errors
        .map((error: ErrorObject) => `${error.instancePath || '/'} ${error.message}`)
        .join('; ');

      throw new Error(`Schema validation failed: ${errorSummary}`);
    }
  }

  async validatePostResponse(postId = 1): Promise<any> {
    const { status, body } = await this.getPost(postId);

    expect(status).toBe(200);
    expect(body).toEqual(expect.objectContaining({
      id: postId,
    }));
    expect(body).toHaveProperty('userId');
    expect(body).toHaveProperty('title');
    expect(body).toHaveProperty('body');
    expect(typeof body.userId).toBe('number');
    expect(typeof body.id).toBe('number');
    expect(typeof body.title).toBe('string');
    expect(typeof body.body).toBe('string');

    this.validateSchema(body);

    return body;
  }
}
