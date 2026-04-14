import { test as base, type Page } from '@playwright/test';
import { LoginPage } from '../pages/login/login.page';
import { DashboardPage } from '../pages/dashboard/dashboard.page';
import { EnvConfigReader } from '../config/env.config';
import { LoginTestData } from '../utils/test-data/login-test-data/login.test.data';

type Credentials = {
  email: string;
  password: string;
};

/**
 * Custom fixture types — extend this as the framework grows.
 */
type CustomFixtures = {
  credentials: Credentials;
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  authenticatedPage: Page;
};

export const test = base.extend<CustomFixtures>({
  // Provides validated credentials from the env file
  // eslint-disable-next-line no-empty-pattern
  credentials: async ({}, use) => {
    const config = EnvConfigReader.getInstance();
    await use(config.getCredentials());
  },

  // Provides LoginPage already navigated to /login
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.assertPageLoaded(LoginTestData.EMAIL_SCREEN_URL);
    await use(loginPage);
  },

  // Provides DashboardPage with environment-specific URL
  dashboardPage: async ({ page }, use) => {
    const config = EnvConfigReader.getInstance();
    const dashboardPage = new DashboardPage(page, config.getDashboardURL());
    await use(dashboardPage);
  },

  // Provides a page that is already logged in — handles the entire login flow
  // so tests that need authenticated state don't repeat login steps
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

export { expect } from '@playwright/test';
