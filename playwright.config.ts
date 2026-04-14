import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load env file based on `env` variable: env=prod|staging (defaults to prod)
process.env.env = process.env.env || 'prod';

dotenv.config({
  path: path.resolve(__dirname, `./env/.env.${process.env.env}`),
});

export default defineConfig({
  // Directory where tests are located
  // Directory where tests are located
  testDir: './tests',

  // Run tests in parallel for faster execution

  // Run tests in parallel for faster execution
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry failed tests (0 locally, 1 on CI)

  // Retry failed tests (0 locally, 1 on CI)
  retries: process.env.CI ? 1 : 0,

  // Number of parallel workers

  // Number of parallel workers
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration
  reporter: [['list'], ['html', { open: 'never' }]],

  // Global timeout for each test
  timeout: 60_000,

  // Assertion timeout
  expect: {
    timeout: 10_000,
  },

  // Shared settings for all tests
  use: {
    baseURL: process.env.BASE_URL,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    actionTimeout: 10_000,
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
