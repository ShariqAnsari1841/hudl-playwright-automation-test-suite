import { test } from '../../fixtures/base.fixture';
import { LoginTestData } from '../../utils/test-data/login-test-data/login.test.data';

test.describe('Valid Login', () => {
  test('Verify user can login successfully with valid credentials', async ({
    loginPage,
    dashboardPage,
    credentials,
  }) => {
    // Step through the two-step flow explicitly to validate each transition
    await loginPage.submitEmail(credentials.email);
    await loginPage.assertPasswordScreenLoaded(LoginTestData.PASSWORD_SCREEN_URL);
    await loginPage.submitPassword(credentials.password);
    await dashboardPage.assertNotOnLoginPage(LoginTestData.PASSWORD_SCREEN_URL);
  });

  test('Verify user is redirected to dashboard after successful login', async ({
    loginPage,
    dashboardPage,
    credentials,
  }) => {
    await loginPage.login(credentials.email, credentials.password);
    await dashboardPage.assertPageLoaded();
    await dashboardPage.assertPageTitle(LoginTestData.DASHBOARD_PAGE_TITLE);
  });

  test('Verify user avatar is displayed after successful login', async ({
    loginPage,
    dashboardPage,
    credentials,
  }) => {
    await loginPage.login(credentials.email, credentials.password);
    await dashboardPage.assertNotOnLoginPage(LoginTestData.PASSWORD_SCREEN_URL);
    await dashboardPage.assertUserAvatarVisible();
  });

  test('Verify session is maintained after page reload post-login', async ({
    loginPage,
    dashboardPage,
    credentials,
  }) => {
    await loginPage.login(credentials.email, credentials.password);
    await dashboardPage.assertNotOnLoginPage(LoginTestData.PASSWORD_SCREEN_URL);

    // Reload to ensure session cookies persist
    await loginPage.page.reload();

    await dashboardPage.assertNotOnLoginPage(LoginTestData.PASSWORD_SCREEN_URL);
    await dashboardPage.assertUserAvatarVisible();
  });
});
