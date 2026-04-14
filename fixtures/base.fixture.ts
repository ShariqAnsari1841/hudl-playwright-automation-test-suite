import { test as base, type Page } from '@playwright/test';
import { LoginPage } from '../pages/login/login.page';
import { DashboardPage } from '../pages/dashboard/dashboard.page';
import { EnvConfigReader } from '../config/env.config';
import { LoginTestData } from '../utils/test-data/login-test-data/login.test.data';

/**
 * Custom type definition for our test credentials.
 */
type Credentials = {
  email: string;
  password: string;
};

/**
 * Custom type definition for all our fixtures.
 * Extend this interface as the framework grows.
 */
type CustomFixtures = {
  credentials: Credentials;
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  authenticatedPage: Page;
};

/**
 * Extended Playwright test with custom fixtures.
 *
 * === For LOGIN FLOW tests ===
 * Use loginPage + dashboardPage + credentials:
 *
 *   test('verify login', async ({ loginPage, dashboardPage, credentials }) => {
 *     await loginPage.login(credentials.email, credentials.password);
 *     await dashboardPage.assertLoggedIn();
 *   });
 *
 * === For tests that NEED TO BE LOGGED IN first ===
 * Use authenticatedPage (handles login automatically):
 *
 *   test('verify dashboard', async ({ authenticatedPage }) => {
 *     // Already logged in — start testing from here
 *   });
 */
export const test = base.extend<CustomFixtures>({
  // Fixture: Provides validated credentials from env file
  // eslint-disable-next-line no-empty-pattern
  credentials: async ({}, use) => {
    const config = EnvConfigReader.getInstance();
    await use(config.getCredentials());
  },

  // Fixture: Provides LoginPage navigated to /login
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.assertPageLoaded(LoginTestData.EMAIL_SCREEN_URL);
    await use(loginPage);
  },

  // Fixture: Provides DashboardPage with environment-specific URL
  dashboardPage: async ({ page }, use) => {
    const config = EnvConfigReader.getInstance();
    const dashboardPage = new DashboardPage(page, config.getDashboardURL());
    await use(dashboardPage);
  },

  // Fixture: Provides a page that is already logged in
  // Handles the entire login flow automatically
  authenticatedPage: async ({ page }, use) => {
    const config = EnvConfigReader.getInstance();
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page, config.getDashboardURL());

    await loginPage.navigate();
    await loginPage.login(config.getEmail(), config.getPassword());
    await dashboardPage.assertNotOnLoginPage(LoginTestData.PASSWORD_SCREEN_URL);

    await use(page);
  },
});

// Re-export expect so tests only need one import
export { expect } from '@playwright/test';
