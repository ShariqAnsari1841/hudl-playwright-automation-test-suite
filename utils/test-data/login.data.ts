/**
 * Test data constants for Login page test scenarios.
 * Actual valid credentials are loaded from environment config.
 * This file contains only invalid/edge-case data for negative testing.
 */

export const LoginTestData = {
  // Invalid credentials for negative tests
  INVALID_EMAIL: 'invalid_user@example.com',
  INVALID_PASSWORD: 'WrongPassword123!',
  MALFORMED_EMAIL: 'not-an-email',
  EMPTY_STRING: '',
  EMAIL_WITH_SPACES: '  spaces@example.com  ',

  // Expected UI text
  ERROR_MESSAGE: "We don't recognize that email and/or password",
  PAGE_TITLE: 'Log In',

  // Expected URLs
  LOGIN_URL: '/login',
  HOME_URL: '/home',
} as const;