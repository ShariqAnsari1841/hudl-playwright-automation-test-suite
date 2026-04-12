import { test, expect } from '../../fixtures/base.fixture';
import { LoginTestData } from '../../utils/test-data/login-test-data/login.test.data';
import { generateRandomEmail } from '../../utils/helpers/email.helper';

/**
 * Login Page UI Validation Test Suite
 *
 * Tests the visual elements, UI behavior, and navigation
 * of the Hudl login page across both steps of the login flow.
 *
 * These tests do NOT require valid Hudl credentials.
 * They focus on UI layer validation only.
 *
 * Run:
 *   env=prod npx playwright test tests/login/login-ui.spec.ts
 */
test.describe('Login Page UI', () => {

  // =========================================
  // Email Screen (Step 1) UI Validation
  // =========================================

  test.describe('Email Screen', () => {

    test('should display all email screen elements', async ({ loginPage }) => {
      // Verify: All expected elements are visible
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.continueButton).toBeVisible();
      await expect(loginPage.hudlLogo).toBeVisible();
      await expect(loginPage.pageHeading).toBeVisible();
    });

    test('should display correct page heading', async ({ loginPage }) => {
      // Verify: Heading text matches expected
      await expect(loginPage.pageHeading).toHaveText(LoginTestData.PAGE_HEADING);
    });

    test('should display correct page title', async ({ loginPage }) => {
      // Verify: Browser tab title matches expected
      await expect(loginPage.page).toHaveTitle(LoginTestData.LOGIN_PAGE_TITLE);
    });

    test('should display Hudl logo on email screen', async ({ loginPage }) => {
      // Verify: Logo is visible and rendered
      await expect(loginPage.hudlLogo).toBeVisible();
    });

    test('should redirect to identity provider URL', async ({ loginPage }) => {
      // Verify: URL redirected from hudl.com/login to identity.hudl.com
      await expect(loginPage.page).toHaveURL(LoginTestData.EMAIL_SCREEN_URL);
    });

    test('should have email input field editable', async ({ loginPage }) => {
      // Verify: Email input is interactive
      await expect(loginPage.emailInput).toBeEditable();

      // Verify: Can type in the email field
      await loginPage.fillEmail(LoginTestData.SAMPLE_EMAIL);
      const value = await loginPage.getEmailInputValue();
      expect(value).toBe(LoginTestData.SAMPLE_EMAIL);
    });

    test('should transition from email screen to password screen', async ({
      loginPage,
    }) => {
      // Verify: Email screen is the initial state
      await loginPage.assertEmailScreenLoaded(LoginTestData.EMAIL_SCREEN_URL);
      await expect(loginPage.page).toHaveURL(LoginTestData.EMAIL_SCREEN_URL);

      // Action: Submit valid email
      const randomEmail = generateRandomEmail();
      await loginPage.submitEmail(randomEmail);

      // Verify: Password screen is now visible with correct URL
      await loginPage.assertPasswordScreenLoaded(LoginTestData.PASSWORD_SCREEN_URL);
      await expect(loginPage.page).toHaveURL(LoginTestData.PASSWORD_SCREEN_URL);
    });
  });

  // =========================================
  // Password Screen (Step 2) UI Validation
  // =========================================

  test.describe('Password Screen', () => {
    let randomEmail: string;

    test.beforeEach(async ({ loginPage }) => {
      // Generate random email and navigate to password screen
      randomEmail = generateRandomEmail();
      await loginPage.submitEmail(randomEmail);
      await loginPage.assertPasswordScreenLoaded(LoginTestData.PASSWORD_SCREEN_URL);
    });

    test('should display all password screen elements', async ({ loginPage }) => {
      // Verify: All expected elements are visible
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.continueButton).toBeVisible();
      await expect(loginPage.editEmailLink).toBeVisible();
      await expect(loginPage.passwordVisibilityToggle).toBeVisible();
      await expect(loginPage.forgotPasswordLink).toBeVisible();
      await expect(loginPage.hudlLogo).toBeVisible();
      await expect(loginPage.pageHeading).toBeVisible();
      await expect(loginPage.readOnlyEmailDisplay).toBeVisible();
    });

    test('should display entered email as read-only on password screen', async ({
      loginPage,
    }) => {
      // Verify: Email is displayed as read-only text
      const displayedEmail = await loginPage.getDisplayedEmail();
      expect(displayedEmail).toBe(randomEmail);

      // Verify: Email is not editable
      await loginPage.assertEmailNotEditable();
    });

    test('should mask password by default', async ({ loginPage }) => {
      // Enter a password
      await loginPage.fillPassword(LoginTestData.SAMPLE_PASSWORD);

      // Verify: Password field type is "password" (masked)
      const inputType = await loginPage.getPasswordInputType();
      expect(inputType).toBe(LoginTestData.PASSWORD_TYPE_MASKED);
    });

    test('should toggle password visibility', async ({ loginPage }) => {
      // Enter a password
      await loginPage.fillPassword(LoginTestData.SAMPLE_PASSWORD);

      // Verify: Initially masked
      expect(await loginPage.getPasswordInputType()).toBe(LoginTestData.PASSWORD_TYPE_MASKED);

      // Verify: "Show password" tooltip text is present
      await expect(loginPage.showPasswordTooltip).toContainText(LoginTestData.SHOW_PASSWORD_LABEL);

      // Action: Click toggle to show password
      await loginPage.togglePasswordVisibility();

      // Verify: Password is now visible (type="text")
      expect(await loginPage.getPasswordInputType()).toBe(LoginTestData.PASSWORD_TYPE_VISIBLE);

      // Verify: "Hide password" tooltip text is present
      await expect(loginPage.hidePasswordTooltip).toContainText(LoginTestData.HIDE_PASSWORD_LABEL);

      // Action: Click toggle to hide password again
      await loginPage.togglePasswordVisibility();

      // Verify: Password is masked again
      expect(await loginPage.getPasswordInputType()).toBe(LoginTestData.PASSWORD_TYPE_MASKED);

      // Verify: "Show password" tooltip text is back
      await expect(loginPage.showPasswordTooltip).toContainText(LoginTestData.SHOW_PASSWORD_LABEL);
    });

    test('should navigate to forgot password page', async ({ loginPage }) => {
      // Action: Click forgot password link
      await loginPage.clickForgotPassword();

      // Verify: Navigated to password reset page
      await expect(loginPage.page).toHaveURL(LoginTestData.FORGOT_PASSWORD_URL);
    });

    test('should return to email screen when clicking edit email', async ({
      loginPage,
    }) => {
      // Verify: Currently on password screen
      await expect(loginPage.page).toHaveURL(LoginTestData.PASSWORD_SCREEN_URL);

      // Action: Click edit email
      await loginPage.clickEditEmail();

      // Verify: Back on email screen
      await loginPage.assertEmailScreenLoaded(LoginTestData.EMAIL_SCREEN_URL);
      await expect(loginPage.page).toHaveURL(LoginTestData.EMAIL_SCREEN_URL);

      // Verify: Email field is editable again
      await expect(loginPage.emailInput).toBeEditable();
    });

    test('should preserve email when returning to email screen via edit', async ({
      loginPage,
    }) => {
      // Action: Click edit email
      await loginPage.clickEditEmail();

      // Verify: Email field contains the previously entered email
      const emailValue = await loginPage.getEmailInputValue();
      expect(emailValue).toBe(randomEmail);
    });
  });
});
