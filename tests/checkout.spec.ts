import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { checkoutUser, productCatalog, users } from '../test-data/users';

test.describe('SauceDemo purchase flow', () => {
  test('complete end-to-end checkout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standardUser.username, users.standardUser.password);

    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addToCart(productCatalog.backpack.id);
    await inventoryPage.openCart();

    const cartPage = new CartPage(page);
    await expect(cartPage.cartItemName(productCatalog.backpack.name)).toBeVisible();
    await cartPage.checkout();

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.enterCustomerDetails(
      checkoutUser.firstName,
      checkoutUser.lastName,
      checkoutUser.postalCode,
    );
    await checkoutPage.continueCheckout();
    await checkoutPage.validateOrderSummary();
    await checkoutPage.completePurchase();
    await checkoutPage.validateSuccessMessage();
  });
});
