import { test } from '../../fixtures/base.fixture';
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
  test('Verify user can login successfully with valid credentials', async ({
    loginPage,
    dashboardPage,
    credentials,
  }) => {
    // Step 1: Submit email and verify password screen appears
    await loginPage.submitEmail(credentials.email);
    await loginPage.assertPasswordScreenLoaded(LoginTestData.PASSWORD_SCREEN_URL);

    // Step 2: Submit password
    await loginPage.submitPassword(credentials.password);

    // Verify: User is redirected away from login page
    await dashboardPage.assertNotOnLoginPage(LoginTestData.PASSWORD_SCREEN_URL);
  });

  test('Verify user is redirected to dashboard after successful login', async ({
    loginPage,
    dashboardPage,
    credentials,
  }) => {
    // Perform complete login using shorthand method
    await loginPage.login(credentials.email, credentials.password);

    // Verify: URL contains /home (dashboard)
    await dashboardPage.assertPageLoaded();
    // Verify: Page title is correct for logged in user
    await dashboardPage.assertPageTitle(LoginTestData.DASHBOARD_PAGE_TITLE);
  });

  test('Verify user avatar is displayed after successful login', async ({
    loginPage,
    dashboardPage,
    credentials,
  }) => {
    // Perform complete login using shorthand method
    await loginPage.login(credentials.email, credentials.password);

    // Verify: User is redirected away from login page
    await dashboardPage.assertNotOnLoginPage(LoginTestData.PASSWORD_SCREEN_URL);
    // Verify: User avatar is visible in the header
    await dashboardPage.assertUserAvatarVisible();
  });

  test('Verify session is maintained after page reload post-login', async ({
    loginPage,
    dashboardPage,
    credentials,
  }) => {
    // Login successfully
    await loginPage.login(credentials.email, credentials.password);
    await dashboardPage.assertNotOnLoginPage(LoginTestData.PASSWORD_SCREEN_URL);

    // Reload the page
    await loginPage.page.reload();

    // Verify: User is still logged in after reload
    await dashboardPage.assertNotOnLoginPage(LoginTestData.PASSWORD_SCREEN_URL);
    // Verify: User avatar is still visible after reload
    await dashboardPage.assertUserAvatarVisible();
  });
});
