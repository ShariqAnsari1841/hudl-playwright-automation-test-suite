import { test as base, Page } from '@playwright/test';
import { EnvConfigReader } from '../config/env.config';

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
  loginPage: Page;
};

/**
 * Extended Playwright test with custom fixtures.
 *
 * Usage in tests:
 *   import { test, expect } from '../../fixtures/base.fixture';
 *
 *   test('example', async ({ credentials, loginPage }) => {
 *     // credentials.email and credentials.password are available
 *     // loginPage is already navigated to the login URL
 *   });
 */
export const test = base.extend<CustomFixtures>({
  // Fixture: Provides validated credentials to tests
  credentials: async ({}, use) => {
    const config = EnvConfigReader.getInstance();
    await use(config.getCredentials());
  },

  // Fixture: Provides a page already navigated to login URL
  loginPage: async ({ page }, use) => {
    await page.goto('/login');
    await use(page);
  },
});

// Re-export expect so tests only need one import
export { expect } from '@playwright/test';