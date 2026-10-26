import { test as base, type APIRequestContext } from '@playwright/test';
import { DemoApi } from '../api/demoApi';

type AppFixtures = {
  api: DemoApi;
};

export const test = base.extend<AppFixtures>({
  api: async ({ request }, use) => {
    const api = new DemoApi(request as APIRequestContext);
    await use(api);
  },
});

export { expect } from '@playwright/test';
