export const env = {
  baseUrl: process.env.BASE_URL || 'https://www.saucedemo.com',
  apiBaseUrl: process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com',
  headless: process.env.HEADLESS !== 'false',
  screenshotPath: 'screenshots',
  reportPath: 'reports',
};
