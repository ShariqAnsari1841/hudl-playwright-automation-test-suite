/**
 * Test data constants used across login test scenarios.
 * Actual credentials are loaded from environment variables.
 * These are intentionally invalid values for negative testing.
 */

export const LoginTestData = {
  // Invalid credentials for negative tests
  INVALID_EMAIL: 'invalid_user@example.com',
  INVALID_PASSWORD: 'WrongPassword123!',
  MALFORMED_EMAIL: 'not-an-email',
  EMPTY_STRING: '',
  EMAIL_WITH_SPACES: '  spaces@example.com  ',

  // Expected UI text
  ERROR_MESSAGE: 'We don\'t recognize that email and/or password',
  PAGE_TITLE: 'Log In',
  LOGIN_URL: '/login',
} as const;
