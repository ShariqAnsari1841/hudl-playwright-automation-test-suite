import { test, expect } from '../../fixtures/base.fixture';
import { LoginTestData } from '../../utils/test-data/login-test-data/login.test.data';
import { generateRandomEmail } from '../../utils/helpers/email.helper';

test.describe('Invalid Login', () => {
  test.describe('Email Screen Validations', () => {
    test('Verify error is shown when submitting empty email', async ({ loginPage }) => {
      await loginPage.submitEmailExpectingError(LoginTestData.EMPTY_STRING);
      await loginPage.assertEmptyEmailError(LoginTestData.EMPTY_EMAIL_ERROR);
      await expect(loginPage.page).toHaveURL(LoginTestData.EMAIL_SCREEN_URL);
    });

    test('Verify error is shown when submitting malformed email', async ({ loginPage }) => {
      await loginPage.submitEmailExpectingError(LoginTestData.MALFORMED_EMAIL);
      await loginPage.assertInvalidEmailError(LoginTestData.INVALID_EMAIL_ERROR);
      await expect(loginPage.page).toHaveURL(LoginTestData.EMAIL_SCREEN_URL);
    });

    test('Verify error is shown when submitting spaces only as email', async ({ loginPage }) => {
      await loginPage.submitEmailExpectingError(LoginTestData.SPACES_ONLY);
      await loginPage.assertInvalidEmailError(LoginTestData.INVALID_EMAIL_ERROR);
      await expect(loginPage.page).toHaveURL(LoginTestData.EMAIL_SCREEN_URL);
    });
  });

  test.describe('Password Screen Validations', () => {
    let randomEmail: string;

    // Fresh random email per test to avoid rate limiting on a single account
    test.beforeEach(() => {
      randomEmail = generateRandomEmail();
    });

    test('Verify error is shown when submitting empty password', async ({ loginPage }) => {
      await loginPage.submitEmail(randomEmail);
      await loginPage.assertPasswordScreenLoaded(LoginTestData.PASSWORD_SCREEN_URL);
      await loginPage.clickContinue();
      await loginPage.assertEmptyPasswordError(LoginTestData.EMPTY_PASSWORD_ERROR);
      await expect(loginPage.page).toHaveURL(LoginTestData.PASSWORD_SCREEN_URL);
    });

    test('Verify error is shown when submitting wrong password', async ({ loginPage }) => {
      await loginPage.submitEmail(randomEmail);
      await loginPage.assertPasswordScreenLoaded(LoginTestData.PASSWORD_SCREEN_URL);
      await loginPage.submitPassword(LoginTestData.INVALID_PASSWORD);
      await loginPage.assertInvalidPasswordError(LoginTestData.WRONG_PASSWORD_ERROR);
      await loginPage.assertStillOnLoginPage(LoginTestData.PASSWORD_SCREEN_URL);
    });

    test('Verify general error is shown when submitting spaces only as password', async ({
      loginPage,
    }) => {
      await loginPage.submitEmail(randomEmail);
      await loginPage.assertPasswordScreenLoaded(LoginTestData.PASSWORD_SCREEN_URL);
      await loginPage.submitPassword(LoginTestData.SPACES_ONLY);
      await loginPage.assertPromptError(LoginTestData.GENERAL_ERROR);
    });

    test('Verify user remains on login page after failed password attempt', async ({
      loginPage,
    }) => {
      await loginPage.submitEmail(randomEmail);
      await loginPage.assertPasswordScreenLoaded(LoginTestData.PASSWORD_SCREEN_URL);
      await loginPage.submitPassword(LoginTestData.INVALID_PASSWORD);
      await loginPage.assertStillOnLoginPage(LoginTestData.PASSWORD_SCREEN_URL);
      await expect(loginPage.continueButton).toBeVisible();
    });

    test('Verify user can retry after failed password attempt', async ({ loginPage }) => {
      await loginPage.submitEmail(randomEmail);
      await loginPage.assertPasswordScreenLoaded(LoginTestData.PASSWORD_SCREEN_URL);

      // First attempt
      await loginPage.submitPassword(LoginTestData.INVALID_PASSWORD);
      await loginPage.assertInvalidPasswordError(LoginTestData.WRONG_PASSWORD_ERROR);

      // Retry with a different password
      await loginPage.fillPassword('AnotherWrongPass!');
      await loginPage.clickContinue();
      await loginPage.assertStillOnLoginPage(LoginTestData.PASSWORD_SCREEN_URL);
    });
  });

  test.describe('Rate Limiting', () => {
    test('Verify rate limit error is shown after too many failed login attempts', async ({
      loginPage,
    }) => {
      const randomEmail = generateRandomEmail();
      await loginPage.submitEmail(randomEmail);
      await loginPage.assertPasswordScreenLoaded(LoginTestData.PASSWORD_SCREEN_URL);

      // Repeatedly submit wrong passwords until Hudl's rate limiter kicks in
      let wasRateLimited = false;

      for (let attempt = 1; attempt <= LoginTestData.MAX_LOGIN_ATTEMPTS; attempt++) {
        await loginPage.fillPassword(LoginTestData.INVALID_PASSWORD);
        await loginPage.clickContinue();

        if (await loginPage.isPromptErrorVisible()) {
          await loginPage.assertPromptError(LoginTestData.RATE_LIMIT_ERROR);
          wasRateLimited = true;
          break;
        }
      }

      // Fail explicitly if rate limiting never triggered
      expect(wasRateLimited).toBe(true);
    });
  });
});
