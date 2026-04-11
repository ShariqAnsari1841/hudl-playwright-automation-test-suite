import { type Page, type Locator, expect } from '@playwright/test';

/**
 * The Hudl login follows a TWO-STEP flow:
 *   Step 1: Enter email → Click Continue
 *   Step 2: Enter password → Click Continue
 *
 * This page object encapsulates both steps and provides
 * a simple login() method for quick authentication in future tests.
 */
export class LoginPage {
  readonly page: Page;

  // --- Step 1: Email Screen Locators ---
  readonly emailInput: Locator;
  readonly continueButton: Locator;
  readonly emailErrorMessage: Locator;

  // --- Step 2: Password Screen Locators ---
  readonly passwordInput: Locator;
  readonly showPasswordButton: Locator;
  readonly editEmailLink: Locator;
  readonly forgotPasswordLink: Locator;
  readonly passwordErrorMessage: Locator;

  // --- Common Locators ---
  readonly hudlLogo: Locator;
  readonly pageHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    // Step 1: Email Screen
    this.emailInput = page.locator('#username');
    this.continueButton = page.locator('[type="submit"][name="action"]');
    this.emailErrorMessage = page.locator('#error-cs-email-invalid');

    // Step 2: Password Screen
    this.passwordInput = page.locator('#password');
    this.showPasswordButton = page.locator('[aria-label="Show password"]');
    this.editEmailLink = page.locator('[data-link-name="edit-username"]');
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot Password' });
    this.passwordErrorMessage = page.locator('#error-cs-password-invalid');

    // Common elements
    this.hudlLogo = page.locator('#custom-prompt-logo');    
    this.pageHeading = page.locator('h1');
  }

  // ===================
  // Navigation
  // ===================

  /**
   * Navigate to the login page.
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
    await this.continueButton.click();
  }

  /**
   * Submit email and wait for password screen to appear.
   * Only use this when you expect a valid email that proceeds to Step 2.
   */
  async submitEmail(email: string): Promise<void> {
    await this.fillEmail(email);
    await this.clickContinue();
    await this.passwordInput.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Submit email without waiting for password screen.
   * Use this for invalid email scenarios where Step 2 won't appear.
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
    await this.showPasswordButton.click();
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
  // Step 1 Assertions
  // ===================

  /**
   * Assert that the email screen (Step 1) is loaded and ready.
   */
  async assertEmailScreenLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/.*login.*/);
    await expect(this.emailInput).toBeVisible();
    await expect(this.continueButton).toBeVisible();
  }

  /**
   * Assert email validation error is displayed.
   */
  async assertEmailError(): Promise<void> {
    await expect(this.emailErrorMessage).toBeVisible();
  }

  /**
   * Assert email validation error contains specific text.
   */
  async assertEmailErrorText(expectedText: string): Promise<void> {
    await expect(this.emailErrorMessage).toBeVisible();
    await expect(this.emailErrorMessage).toContainText(expectedText);
  }

  // ===================
  // Step 2 Assertions
  // ===================

  /**
   * Assert that the password screen (Step 2) is loaded and ready.
   */
  async assertPasswordScreenLoaded(): Promise<void> {
    await expect(this.passwordInput).toBeVisible();
    await expect(this.continueButton).toBeVisible();
    await expect(this.editEmailLink).toBeVisible();
  }

  /**
   * Assert password error is displayed.
   */
  async assertPasswordError(): Promise<void> {
    await expect(this.passwordErrorMessage).toBeVisible();
  }

  /**
   * Assert password error contains specific text.
   */
  async assertPasswordErrorText(expectedText: string): Promise<void> {
    await expect(this.passwordErrorMessage).toBeVisible();
    await expect(this.passwordErrorMessage).toContainText(expectedText);
  }

  // ===================
  // Common Assertions
  // ===================

  /**
   * Assert that the login page is loaded (initial state — email screen).
   */
  async assertPageLoaded(): Promise<void> {
    await this.assertEmailScreenLoaded();
  }

  /**
   * Assert that the user is still on the login page.
   */
  async assertStillOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/.*login.*/);
  }

  /**
   * Assert no email error messages are displayed.
   */
  async assertNoEmailError(): Promise<void> {
    await expect(this.emailErrorMessage).not.toBeVisible();
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