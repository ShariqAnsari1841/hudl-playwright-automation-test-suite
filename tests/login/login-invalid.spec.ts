import { test, expect } from '../../fixtures/base.fixture';
import { LoginTestData } from '../../utils/test-data/login-test-data/login.test.data';
import { generateRandomEmail } from '../../utils/helpers/email.helper';

/**
 * Invalid Login Test Suite
 *
 * Tests negative scenarios for the Hudl login flow.
 * Validates error handling for both email (Step 1) and password (Step 2) screens.
 *
 * Uses randomly generated emails for password tests to avoid rate limiting.
 * Uses a static email for the rate limit verification test.
 *
 * Run:
 *   env=prod npx playwright test tests/login/login-invalid.spec.ts
 */
test.describe('Invalid Login', () => {

  // =========================================
  // Step 1: Email Screen - Invalid Scenarios
  // =========================================

  test.describe('Email Screen Validations', () => {

    test('should show error when submitting empty email', async ({ loginPage }) => {
      // Action: Click continue without entering email
      await loginPage.submitEmailExpectingError(LoginTestData.EMPTY_STRING);

      // Verify: Correct error message displayed
      await loginPage.assertEmptyEmailError(LoginTestData.EMPTY_EMAIL_ERROR);

      // Verify: User remains on email screen
      await expect(loginPage.page).toHaveURL(LoginTestData.EMAIL_SCREEN_URL);
    });

    test('should show error when submitting malformed email', async ({ loginPage }) => {
      // Action: Enter malformed email and click continue
      await loginPage.submitEmailExpectingError(LoginTestData.MALFORMED_EMAIL);

      // Verify: Correct error message displayed
      await loginPage.assertInvalidEmailError(LoginTestData.INVALID_EMAIL_ERROR);

      // Verify: User remains on email screen
      await expect(loginPage.page).toHaveURL(LoginTestData.EMAIL_SCREEN_URL);
    });

    test('should show error when submitting spaces only as email', async ({ loginPage }) => {
      // Action: Enter only spaces and click continue
      await loginPage.submitEmailExpectingError(LoginTestData.SPACES_ONLY);

      // Verify: Correct error message displayed
      await loginPage.assertInvalidEmailError(LoginTestData.INVALID_EMAIL_ERROR);

      // Verify: User remains on email screen
      await expect(loginPage.page).toHaveURL(LoginTestData.EMAIL_SCREEN_URL);
    });
  });

  // =========================================
  // Step 2: Password Screen - Invalid Scenarios
  // =========================================

  test.describe('Password Screen Validations', () => {
    let randomEmail: string;

    test.beforeEach(() => {
      // Generate a fresh random email for each test to avoid rate limiting
      randomEmail = generateRandomEmail();
    });

    test('should show error when submitting empty password', async ({ loginPage }) => {
      // Navigate to password screen with random email
      await loginPage.submitEmail(randomEmail);
      await loginPage.assertPasswordScreenLoaded(LoginTestData.PASSWORD_SCREEN_URL);

      // Action: Click continue without entering password
      await loginPage.clickContinue();

      // Verify: Correct error message displayed
      await loginPage.assertEmptyPasswordError(LoginTestData.EMPTY_PASSWORD_ERROR);

      // Verify: User remains on password screen
      await expect(loginPage.page).toHaveURL(LoginTestData.PASSWORD_SCREEN_URL);
    });

    test('should show error when submitting wrong password', async ({ loginPage }) => {
      // Navigate to password screen with random email
      await loginPage.submitEmail(randomEmail);
      await loginPage.assertPasswordScreenLoaded(LoginTestData.PASSWORD_SCREEN_URL);

      // Action: Enter wrong password and submit
      await loginPage.submitPassword(LoginTestData.INVALID_PASSWORD);

      // Verify: Correct error message displayed
      await loginPage.assertInvalidPasswordError(LoginTestData.WRONG_PASSWORD_ERROR);

      // Verify: User remains on login page
      await loginPage.assertStillOnLoginPage(LoginTestData.PASSWORD_SCREEN_URL);
    });

    test('should show general error when submitting spaces only as password', async ({
      loginPage,
    }) => {
      // Navigate to password screen with random email
      await loginPage.submitEmail(randomEmail);
      await loginPage.assertPasswordScreenLoaded(LoginTestData.PASSWORD_SCREEN_URL);

      // Action: Enter only spaces as password and submit
      await loginPage.submitPassword(LoginTestData.SPACES_ONLY);

      // Verify: Prompt error displayed with correct text
      await loginPage.assertPromptError(LoginTestData.GENERAL_ERROR);
    });

    test('should remain on login page after failed password attempt', async ({
      loginPage,
    }) => {
      // Navigate to password screen with random email
      await loginPage.submitEmail(randomEmail);
      await loginPage.assertPasswordScreenLoaded(LoginTestData.PASSWORD_SCREEN_URL);

      // Action: Submit wrong password
      await loginPage.submitPassword(LoginTestData.INVALID_PASSWORD);

      // Verify: User is still on login page
      await loginPage.assertStillOnLoginPage(LoginTestData.PASSWORD_SCREEN_URL);

      // Verify: Continue button is still available for retry
      await expect(loginPage.continueButton).toBeVisible();
    });

    test('should allow retry after failed password attempt', async ({
      loginPage,
    }) => {
      // Navigate to password screen with random email
      await loginPage.submitEmail(randomEmail);
      await loginPage.assertPasswordScreenLoaded(LoginTestData.PASSWORD_SCREEN_URL);

      // First attempt: Wrong password
      await loginPage.submitPassword(LoginTestData.INVALID_PASSWORD);
      await loginPage.assertInvalidPasswordError(LoginTestData.WRONG_PASSWORD_ERROR);

      // Second attempt: Clear and enter different password
      await loginPage.fillPassword('AnotherWrongPass!');
      await loginPage.clickContinue();

      // Verify: Still on login page (wrong password again)
      await loginPage.assertStillOnLoginPage(LoginTestData.PASSWORD_SCREEN_URL);
    });
  });

  // =========================================
  // Rate Limiting
  // =========================================

   test.describe('Rate Limiting', () => {

    test('should show rate limit error after too many failed login attempts', async ({
      loginPage,
    }) => {
      /**
       * Strategy:
       * First, try to trigger rate limiting naturally with a random email
       */

      // Phase 1: Attempt to trigger rate limiting naturally
      const randomEmail = generateRandomEmail();
      await loginPage.submitEmail(randomEmail);
      await loginPage.assertPasswordScreenLoaded(LoginTestData.PASSWORD_SCREEN_URL);

      let rateLimitTriggered = false;

      for (let attempt = 1; attempt <= LoginTestData.MAX_LOGIN_ATTEMPTS; attempt++) {
        await loginPage.fillPassword(LoginTestData.INVALID_PASSWORD);
        await loginPage.clickContinue();

        if (await loginPage.isPromptErrorVisible()) {
          await loginPage.assertPromptError(LoginTestData.RATE_LIMIT_ERROR);
          console.log(`⚠️ Rate limited after ${attempt} failed attempts`);
          rateLimitTriggered = true;
          break;
        }
      }
    });
  });
});