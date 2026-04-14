import { test, expect } from '../../fixtures/base.fixture';
import { LoginTestData } from '../../utils/test-data/login-test-data/login.test.data';
import { generateRandomEmail } from '../../utils/helpers/email.helper';

test.describe('Login Page UI', () => {
  test.describe('Email Screen', () => {
    test('Verify all email screen elements are displayed', async ({ loginPage }) => {
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.continueButton).toBeVisible();
      await expect(loginPage.hudlLogo).toBeVisible();
      await expect(loginPage.pageHeading).toBeVisible();
    });

    test('Verify correct page heading is displayed', async ({ loginPage }) => {
      await expect(loginPage.pageHeading).toHaveText(LoginTestData.PAGE_HEADING);
    });

    test('Verify correct page title is displayed', async ({ loginPage }) => {
      await expect(loginPage.page).toHaveTitle(LoginTestData.LOGIN_PAGE_TITLE);
    });

    test('Verify Hudl logo is displayed on email screen', async ({ loginPage }) => {
      await expect(loginPage.hudlLogo).toBeVisible();
    });

    test('Verify page redirects to identity provider URL', async ({ loginPage }) => {
      await expect(loginPage.page).toHaveURL(LoginTestData.EMAIL_SCREEN_URL);
    });

    test('Verify email input field is editable', async ({ loginPage }) => {
      await expect(loginPage.emailInput).toBeEditable();
      await loginPage.fillEmail(LoginTestData.SAMPLE_EMAIL);
      const value = await loginPage.getEmailInputValue();
      expect(value).toBe(LoginTestData.SAMPLE_EMAIL);
    });

    test('Verify transition from email screen to password screen', async ({ loginPage }) => {
      await loginPage.assertEmailScreenLoaded(LoginTestData.EMAIL_SCREEN_URL);

      const randomEmail = generateRandomEmail();
      await loginPage.submitEmail(randomEmail);

      await loginPage.assertPasswordScreenLoaded(LoginTestData.PASSWORD_SCREEN_URL);
    });
  });

  test.describe('Password Screen', () => {
    let randomEmail: string;

    // Navigate to password screen before each test
    test.beforeEach(async ({ loginPage }) => {
      randomEmail = generateRandomEmail();
      await loginPage.submitEmail(randomEmail);
      await loginPage.assertPasswordScreenLoaded(LoginTestData.PASSWORD_SCREEN_URL);
    });

    test('Verify all password screen elements are displayed', async ({ loginPage }) => {
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.continueButton).toBeVisible();
      await expect(loginPage.editEmailLink).toBeVisible();
      await expect(loginPage.passwordVisibilityToggle).toBeVisible();
      await expect(loginPage.forgotPasswordLink).toBeVisible();
      await expect(loginPage.hudlLogo).toBeVisible();
      await expect(loginPage.pageHeading).toBeVisible();
      await expect(loginPage.readOnlyEmailDisplay).toBeVisible();
    });

    test('Verify entered email is displayed as read-only on password screen', async ({
      loginPage,
    }) => {
      const displayedEmail = await loginPage.getDisplayedEmail();
      expect(displayedEmail).toBe(randomEmail);
      await loginPage.assertEmailNotEditable();
    });

    test('Verify password is masked by default', async ({ loginPage }) => {
      await loginPage.fillPassword(LoginTestData.SAMPLE_PASSWORD);
      const inputType = await loginPage.getPasswordInputType();
      expect(inputType).toBe(LoginTestData.PASSWORD_TYPE_MASKED);
    });

    test('Verify password visibility can be toggled', async ({ loginPage }) => {
      await loginPage.fillPassword(LoginTestData.SAMPLE_PASSWORD);

      // Initially masked
      expect(await loginPage.getPasswordInputType()).toBe(LoginTestData.PASSWORD_TYPE_MASKED);
      await expect(loginPage.showPasswordTooltip).toContainText(LoginTestData.SHOW_PASSWORD_LABEL);

      // Toggle to visible
      await loginPage.togglePasswordVisibility();

      expect(await loginPage.getPasswordInputType()).toBe(LoginTestData.PASSWORD_TYPE_VISIBLE);
      await expect(loginPage.hidePasswordTooltip).toContainText(LoginTestData.HIDE_PASSWORD_LABEL);

      // Toggle back to masked
      await loginPage.togglePasswordVisibility();

      expect(await loginPage.getPasswordInputType()).toBe(LoginTestData.PASSWORD_TYPE_MASKED);
      await expect(loginPage.showPasswordTooltip).toContainText(LoginTestData.SHOW_PASSWORD_LABEL);
    });

    test('Verify navigation to forgot password page', async ({ loginPage }) => {
      await loginPage.clickForgotPassword();
      await expect(loginPage.page).toHaveURL(LoginTestData.FORGOT_PASSWORD_URL);
    });

    test('Verify user returns to email screen when clicking edit email', async ({ loginPage }) => {
      await expect(loginPage.page).toHaveURL(LoginTestData.PASSWORD_SCREEN_URL);
      await loginPage.clickEditEmail();
      await loginPage.assertEmailScreenLoaded(LoginTestData.EMAIL_SCREEN_URL);
      await expect(loginPage.emailInput).toBeEditable();
    });

    test('Verify email is preserved when returning to email screen via edit', async ({
      loginPage,
    }) => {
      await loginPage.clickEditEmail();
      const emailValue = await loginPage.getEmailInputValue();
      expect(emailValue).toBe(randomEmail);
    });
  });
});
