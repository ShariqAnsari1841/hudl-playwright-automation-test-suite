import { type Page, type Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the Hudl Login Page.
 *
 * The Hudl login follows a TWO-STEP flow:
 *   Step 1: Enter email → Click Continue (URL: /u/login/identifier)
 *   Step 2: Enter password → Click Continue (URL: /u/login/password)
 *
 * This page object encapsulates both steps and provides
 * a simple login() method for quick authentication in future tests.
 */
export class LoginPage {
  readonly page: Page;

  // --- Step 1: Email Screen Locators ---
  readonly emailInput: Locator;
  readonly continueButton: Locator;
  readonly emptyEmailError: Locator;
  readonly invalidEmailError: Locator;

  // --- Step 2: Password Screen Locators ---
  readonly readOnlyEmailDisplay: Locator;
  readonly passwordInput: Locator;
  readonly passwordVisibilityToggle: Locator;
  readonly showPasswordTooltip: Locator;
  readonly hidePasswordTooltip: Locator;
  readonly editEmailLink: Locator;
  readonly forgotPasswordLink: Locator;
  readonly emptyPasswordError: Locator;
  readonly invalidPasswordError: Locator;

  // --- Common Locators ---
  readonly hudlLogo: Locator;
  readonly pageHeading: Locator;
  readonly promptErrorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Step 1: Email Screen
    this.emailInput = page.locator('#username');
    this.continueButton = page.locator('[type="submit"][name="action"]');
    this.emptyEmailError = page.locator('#error-cs-username-required');
    this.invalidEmailError = page.locator('#error-cs-email-invalid');

    // Step 2: Password Screen
    this.readOnlyEmailDisplay = page.locator('.ulp-authenticator-selector-text');
    this.passwordInput = page.locator('#password');
    this.passwordVisibilityToggle = page.locator('[aria-label="Show password"]');
    this.showPasswordTooltip = page.locator('.show-password-tooltip');
    this.hidePasswordTooltip = page.locator('.hide-password-tooltip');
    this.editEmailLink = page.locator('[data-link-name="edit-username"]');
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot Password' });
    this.emptyPasswordError = page.locator('#error-cs-password-required');
    this.invalidPasswordError = page.locator('#error-element-password');

    // Common elements across both steps
    this.hudlLogo = page.locator('#custom-prompt-logo');
    this.pageHeading = page.locator('h1');
    this.promptErrorMessage = page.locator('#prompt-alert');
  }

  // ===================
  // Navigation
  // ===================

  /**
   * Navigate to the login page.
   * Hudl redirects from /login to identity.hudl.com/u/login/identifier
   */
  async navigate(): Promise<void> {
    await this.page.goto('/login');
  }

  // ===================
  // Step 1: Email Actions
  // ===================

  /**
   * Fill in the email field.
   */
  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  /**
   * Click the Continue button.
   * Used in both Step 1 (email) and Step 2 (password).
   */
  async clickContinue(): Promise<void> {
    await this.continueButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.continueButton.click();
  }

  /**
   * Submit email and wait for password screen to appear.
   * Only use when you expect a valid email that proceeds to Step 2.
   */
  async submitEmail(email: string): Promise<void> {
    await this.fillEmail(email);
    await this.clickContinue();
    await this.passwordInput.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Submit email without waiting for password screen.
   * Use for invalid email scenarios where Step 2 won't appear.
   */
  async submitEmailExpectingError(email: string): Promise<void> {
    await this.fillEmail(email);
    await this.clickContinue();
  }

  // ===================
  // Step 2: Password Actions
  // ===================

  /**
   * Fill in the password field.
   */
  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.passwordInput.fill(password);
  }

  /**
   * Submit password by clicking Continue on password screen.
   */
  async submitPassword(password: string): Promise<void> {
    await this.fillPassword(password);
    await this.clickContinue();
  }

  /**
   * Toggle password visibility using the show/hide button.
   */
  async togglePasswordVisibility(): Promise<void> {
    await this.passwordVisibilityToggle.click();
  }

  /**
   * Click Edit email link to go back to email screen.
   */
  async clickEditEmail(): Promise<void> {
    await this.editEmailLink.click();
    await this.emailInput.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Click Forgot Password link.
   */
  async clickForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
  }

  // ===================
  // Complete Login Flow
  // ===================

  /**
   * Perform a complete two-step login.
   *
   * This is the PRIMARY method for logging in.
   * Use this in any test that needs to authenticate quickly:
   *
   *   await loginPage.login(credentials.email, credentials.password);
   *
   * Step 1: Enter email → Continue → Wait for password screen
   * Step 2: Enter password → Continue
   */
  async login(email: string, password: string): Promise<void> {
    await this.submitEmail(email);
    await this.submitPassword(password);
  }

  // ===================
  // Step 1 Assertions on email screen
  // ===================

  /**
   * Assert that the email screen (Step 1) is loaded and ready.
   * URL pattern: identity.hudl.com/u/login/identifier
   */
  async assertEmailScreenLoaded(expectedUrl: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(expectedUrl);
    await expect(this.emailInput).toBeVisible();
    await expect(this.continueButton).toBeVisible();
  }

  /**
   * Assert empty email error is displayed with correct text.
   */
  async assertEmptyEmailError(expectedText: string): Promise<void> {
    await expect(this.emptyEmailError).toBeVisible();
    await expect(this.emptyEmailError).toContainText(expectedText);
  }

  /**
   * Assert invalid email error is displayed with correct text.
   */
  async assertInvalidEmailError(expectedText: string): Promise<void> {
    await expect(this.invalidEmailError).toBeVisible();
    await expect(this.invalidEmailError).toContainText(expectedText);
  }

  // ===================
  // Step 2 Assertions on password screen
  // ===================

  /**
   * Assert that email is displayed as read-only text on password screen.
   * On the password screen, email is shown as plain text (not an input field).
   * User must click "Edit" link to go back and change email.
   */
  async assertEmailNotEditable(): Promise<void> {
    // Email should be displayed as read-only text, not an editable input
    await expect(this.readOnlyEmailDisplay).toBeVisible();
    await expect(this.emailInput).not.toBeVisible();

    // Edit link should be the only way to change email
    await expect(this.editEmailLink).toBeVisible();
  }

  /**
   * Get the email text displayed on the password screen.
   * This is the read-only email shown above the password field.
   */
  async getDisplayedEmail(): Promise<string> {
    const text = await this.readOnlyEmailDisplay.textContent();
    return text?.trim() || '';
  }

  /**
   * Assert that the password screen (Step 2) is loaded and ready.
   * URL pattern: identity.hudl.com/u/login/password
   */
  async assertPasswordScreenLoaded(expectedUrl: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(expectedUrl);
    await expect(this.passwordInput).toBeVisible();
    await expect(this.continueButton).toBeVisible();
    await expect(this.editEmailLink).toBeVisible();
  }

  /**
   * Assert empty password error is displayed with correct text.
   */
  async assertEmptyPasswordError(expectedText: string): Promise<void> {
    await expect(this.emptyPasswordError).toBeVisible();
    await expect(this.emptyPasswordError).toContainText(expectedText);
  }

  /**
   * Assert invalid/wrong password error is displayed with correct text.
   */
  async assertInvalidPasswordError(expectedText: string): Promise<void> {
    await expect(this.invalidPasswordError).toBeVisible();
    await expect(this.invalidPasswordError).toContainText(expectedText);
  }

  // ===================
  // Common Assertions
  // ===================

  /**
   * Assert that the login page is loaded (initial state — email screen).
   */
  async assertPageLoaded(expectedUrl: string | RegExp): Promise<void> {
    await this.assertEmailScreenLoaded(expectedUrl);
  }

  /**
   * Assert that the user is still on the login page (either step).
   */
  async assertStillOnLoginPage(expectedUrl: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(expectedUrl);
  }

  /**
   * Assert prompt error message is displayed with correct text.
   * Used for general errors (spaces in password) and rate limiting.
   */
  async assertPromptError(expectedText: string): Promise<void> {
    await expect(this.promptErrorMessage).toBeVisible();
    await expect(this.promptErrorMessage).toContainText(expectedText);
  }

  /**
   * Check if prompt error message is currently visible.
   * Returns boolean — useful for conditional checks like rate limiting.
   */
  async isPromptErrorVisible(): Promise<boolean> {
    return await this.promptErrorMessage.isVisible().catch(() => false);
  }

  /**
   * Get the password input type attribute.
   * Returns 'password' when masked, 'text' when visible.
   */
  async getPasswordInputType(): Promise<string | null> {
    return await this.passwordInput.getAttribute('type');
  }

  /**
   * Get the current value in the email input field.
   */
  async getEmailInputValue(): Promise<string> {
    return await this.emailInput.inputValue();
  }
}
