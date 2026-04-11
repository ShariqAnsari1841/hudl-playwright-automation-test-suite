import { test, expect } from '../../fixtures/base.fixture';
import { LoginTestData } from '../../utils/test-data/login-test-data/login.test.data';

/**
 * Valid Login Test Suite
 *
 * Tests the happy path of the Hudl login flow.
 * The Hudl login is a TWO-STEP process:
 *   Step 1: Enter email → Click Continue (identity.hudl.com/u/login/identifier)
 *   Step 2: Enter password → Click Continue (identity.hudl.com/u/login/password)
 *
 * Prerequisites:
 *   - Valid Hudl test credentials in env/.env.prod
 *   - Network access to https://www.hudl.com
 *
 * Run:
 *   env=prod npx playwright test tests/login/login-valid.spec.ts
 */
test.describe('Valid Login', () => {

  test('should login successfully with valid credentials', async ({
    loginPage,
    dashboardPage,
    credentials,
  }) => {
    // Step 1: Submit email and verify password screen appears
    await loginPage.submitEmail(credentials.email);
    await loginPage.assertPasswordScreenLoaded();

    // Step 2: Submit password
    await loginPage.submitPassword(credentials.password);

    // Verify: User is redirected away from login page
    await dashboardPage.assertLoggedIn();
  });

  test('should redirect to dashboard after successful login', async ({
    loginPage,
    dashboardPage,
    credentials,
  }) => {
    // Perform complete login using shorthand method
    await loginPage.login(credentials.email, credentials.password);

    // Verify: URL contains /home (dashboard)
    await dashboardPage.assertPageLoaded();
  });

  test('should transition from email screen to password screen', async ({
    loginPage,
    credentials,
  }) => {
    // Verify: Email screen is the initial state
    await loginPage.assertEmailScreenLoaded();
    await expect(loginPage.page).toHaveURL(LoginTestData.EMAIL_SCREEN_URL);

    // Action: Submit valid email
    await loginPage.submitEmail(credentials.email);

    // Verify: Password screen is now visible with correct URL
    await loginPage.assertPasswordScreenLoaded();
    await expect(loginPage.page).toHaveURL(LoginTestData.PASSWORD_SCREEN_URL);
  });

  test('should allow editing email from password screen', async ({
    loginPage,
    credentials,
  }) => {
    // Navigate to password screen
    await loginPage.submitEmail(credentials.email);
    await loginPage.assertPasswordScreenLoaded();

    // Action: Click edit email to go back
    await loginPage.clickEditEmail();

    // Verify: Back on email screen with correct URL
    await loginPage.assertEmailScreenLoaded();
    await expect(loginPage.page).toHaveURL(LoginTestData.EMAIL_SCREEN_URL);

    // Verify: Email field retains the previously entered value
    const emailValue = await loginPage.getEmailInputValue();
    expect(emailValue).toBe(credentials.email);
  });

  test('should maintain session after page reload post-login', async ({
    loginPage,
    dashboardPage,
    credentials,
  }) => {
    // Login successfully
    await loginPage.login(credentials.email, credentials.password);
    await dashboardPage.assertLoggedIn();

    // Reload the page
    await loginPage.page.reload();

    // Verify: User is still logged in after reload
    await dashboardPage.assertLoggedIn();
  });
});