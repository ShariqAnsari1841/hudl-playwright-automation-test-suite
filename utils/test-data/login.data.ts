/**
 * Test data constants for Login page test scenarios.
 * Actual valid credentials are loaded from environment config.
 * This file contains only invalid/edge-case data for negative testing.
 */

export const LoginTestData = {
  // Invalid email scenarios
  INVALID_EMAIL: 'invalid_user@example.com',
  MALFORMED_EMAIL: 'not-an-email',
  EMPTY_STRING: '',
  EMAIL_WITH_SPACES: '  spaces@example.com  ',

  // Invalid password scenarios
  INVALID_PASSWORD: 'WrongPassword123!',

  // Expected error messages (update these after verifying actual messages)
  EMAIL_ERROR_MESSAGE: 'Enter a valid email.',
  PASSWORD_ERROR_MESSAGE: 'Incorrect username or password.',

  // Expected URLs
  LOGIN_URL: '/u/login/identifier',
  // DASHBOARD_URL: 'https://fan.hudl.com/',
} as const;