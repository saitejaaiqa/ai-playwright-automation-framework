import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { users, expectedCounts, productCatalog } from '../test-data/users';

test.describe('SauceDemo UI automation suite', () => {
  test('successful login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standardUser.username, users.standardUser.password);

    const inventoryPage = new InventoryPage(page);
    await page.waitForURL('**/inventory.html');
    await expect(page).toHaveURL(/\/inventory\.html/);
    await expect(inventoryPage.productTitle).toContainText('Products');
    await expect(inventoryPage.productItems).toHaveCount(expectedCounts.inventory);
  });

  test('invalid login validation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.invalidUser.username, users.invalidUser.password);

    await expect(loginPage.errorMessage).toContainText('Username and password do not match any user in this service');
  });

  test('product validation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standardUser.username, users.standardUser.password);

    const inventoryPage = new InventoryPage(page);
    await page.waitForURL('**/inventory.html');
    await expect(inventoryPage.productTitle).toContainText('Products');
    await expect(inventoryPage.productItems).toHaveCount(expectedCounts.inventory);
    await expect(page.locator(`[data-test="add-to-cart-${productCatalog.backpack.id}"]`)).toBeVisible();
  });

  test('add to cart flow', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standardUser.username, users.standardUser.password);

    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addToCart(productCatalog.backpack.id);
    await inventoryPage.openCart();

    const cartPage = new CartPage(page);
    await expect(cartPage.cartItemName(productCatalog.backpack.name)).toBeVisible();
  });

  test('logout functionality', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standardUser.username, users.standardUser.password);

    const inventoryPage = new InventoryPage(page);
    await page.waitForURL('**/inventory.html');
    await inventoryPage.logout();

    await page.waitForURL('**/');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.loginButton).toBeVisible();
  });
});
