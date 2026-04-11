import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

/**
 * Load environment variables from the appropriate .env file.
 *
 * Usage from terminal:
 *   env=prod npx playwright test              (uses env/.env.prod)
 *   env=staging npx playwright test           (uses env/.env.staging)
 *   npx playwright test                            (defaults to env/.env.prod)
 *
 * Combined with other Playwright options:
 *   env=prod npx playwright test --headed
 *   env=prod npx playwright test --project=chromium
 *   env=staging npx playwright test --ui
 *   env=prod npx playwright test tests/login/
 */
process.env.env = process.env.env || 'prod';

dotenv.config({
  path: path.resolve(__dirname, `./env/.env.${process.env.env}`),
});

export default defineConfig({
  // Directory where tests are located
  testDir: './tests',

  // Run tests in parallel for faster execution
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry failed tests (0 locally, 2 on CI)
  retries: process.env.CI ? 2 : 0,

  // Number of parallel workers
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],

  // Global timeout for each test
  timeout: 60_000,

  // Assertion timeout
  expect: {
    timeout: 10_000,
  },

  // Shared settings for all tests
  use: {
    // Base URL loaded from environment file
    baseURL: process.env.BASE_URL,

    // Capture screenshot on failure
    screenshot: 'only-on-failure',

    // Record video on failure
    video: 'retain-on-failure',

    // Capture trace on first retry
    trace: 'on-first-retry',

    // Action timeout
    actionTimeout: 10_000,

    // Navigation timeout
    navigationTimeout: 30_000,
  },

  // Configure browser projects
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 },
      },
    },
  ],
});