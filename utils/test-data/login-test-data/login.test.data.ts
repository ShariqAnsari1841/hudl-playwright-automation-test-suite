/**
 * Test data constants for Login page test scenarios.
 * Actual valid credentials are loaded from environment config.
 * This file contains only invalid/edge-case data for negative testing.
 */

export const LoginTestData = {
  // Invalid email scenarios (static — use for specific tests only)
  MALFORMED_EMAIL: 'not-an-email',
  EMPTY_STRING: '',
  SPACES_ONLY: '   ',
  EMAIL_WITH_SPACES: '  spaces@example.com  ',

  // Invalid password scenarios
  INVALID_PASSWORD: 'WrongPassword123!',

  // Step 1: Email error messages
  EMPTY_EMAIL_ERROR: 'Enter an email address',
  INVALID_EMAIL_ERROR: 'Enter a valid email.',

  // Step 2: Password error messages
  EMPTY_PASSWORD_ERROR: 'Enter your password.',
  WRONG_PASSWORD_ERROR: 'Incorrect username or password.',

  // Common error messages (prompt-alert)
  GENERAL_ERROR: 'Something went wrong. Try again',
  RATE_LIMIT_ERROR: "You’ve tried to log in too many times, so we’ve temporarily blocked your account. To get help, contact support",

  // Rate limiting config
  MAX_LOGIN_ATTEMPTS: 10,

  // URL patterns
  EMAIL_SCREEN_URL: /.*\/u\/login\/identifier.*/,
  PASSWORD_SCREEN_URL: /.*\/u\/login\/password.*/,
  LOGIN_URL: /.*\/u\/login\/.*/,
} as const;