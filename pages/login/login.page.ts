import { type Page, type Locator, expect } from '@playwright/test';

/**
 * Page Object for the Hudl Login Page.
 *
 * Hudl uses a two-step login flow:
 *   Step 1: Enter email → Click Continue → /u/login/identifier
 *   Step 2: Enter password → Click Continue → /u/login/password
 */
export class LoginPage {
  readonly page: Page;

  // Step 1: Email Screen
  readonly emailInput: Locator;
  readonly continueButton: Locator;
  readonly emptyEmailError: Locator;
  readonly invalidEmailError: Locator;

  // Step 2: Password Screen
  readonly readOnlyEmailDisplay: Locator;
  readonly passwordInput: Locator;
  readonly passwordVisibilityToggle: Locator;
  readonly showPasswordTooltip: Locator;
  readonly hidePasswordTooltip: Locator;
  readonly editEmailLink: Locator;
  readonly forgotPasswordLink: Locator;
  readonly emptyPasswordError: Locator;
  readonly invalidPasswordError: Locator;

  // Common across both steps
  readonly hudlLogo: Locator;
  readonly pageHeading: Locator;
  readonly promptErrorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Prefer ID selectors where available for stability
    this.emailInput = page.locator('#username');
    this.continueButton = page.locator('[type="submit"][name="action"]');
    this.emptyEmailError = page.locator('#error-cs-username-required');
    this.invalidEmailError = page.locator('#error-cs-email-invalid');

    this.readOnlyEmailDisplay = page.locator('.ulp-authenticator-selector-text');
    this.passwordInput = page.locator('#password');
    // Using role-based locator — the toggle has role="switch" which stays stable
    // regardless of whether password is currently shown or hidden
    this.passwordVisibilityToggle = page.getByRole('switch');
    this.showPasswordTooltip = page.locator('.show-password-tooltip');
    this.hidePasswordTooltip = page.locator('.hide-password-tooltip');
    this.editEmailLink = page.locator('[data-link-name="edit-username"]');
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot Password' });
    this.emptyPasswordError = page.locator('#error-cs-password-required');
    this.invalidPasswordError = page.locator('#error-element-password');

    this.hudlLogo = page.locator('#custom-prompt-logo');
    this.pageHeading = page.locator('h1');
    this.promptErrorMessage = page.locator('#prompt-alert');
  }

  // Navigation

  async navigate(): Promise<void> {
    await this.page.goto('/login');
  }

  // Actions — Step 1 (Email)

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.continueButton.click();
  }

  // Submits email and waits for the password screen to load.
  // Only use when you expect a valid email that proceeds to Step 2.
  async submitEmail(email: string): Promise<void> {
    await this.fillEmail(email);
    await this.clickContinue();
    await this.passwordInput.waitFor({ state: 'visible', timeout: 10000 });
  }

  // Submits email without waiting for password screen — for invalid email scenarios
  // where Step 2 won't appear (empty email, malformed email, etc.)
  async submitEmailExpectingError(email: string): Promise<void> {
    await this.fillEmail(email);
    await this.clickContinue();
  }

  // Actions — Step 2 (Password)

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.passwordInput.fill(password);
  }

  async submitPassword(password: string): Promise<void> {
    await this.fillPassword(password);
    await this.clickContinue();
  }

  async togglePasswordVisibility(): Promise<void> {
    await this.passwordVisibilityToggle.click();
  }

  async clickEditEmail(): Promise<void> {
    await this.editEmailLink.click();
    await this.emailInput.waitFor({ state: 'visible', timeout: 10000 });
  }

  async clickForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
  }

  // Complete two-step login: email → continue → password → continue
  async login(email: string, password: string): Promise<void> {
    await this.submitEmail(email);
    await this.submitPassword(password);
  }

  // Assertions — Step 1

  async assertEmailScreenLoaded(expectedUrl: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(expectedUrl);
    await expect(this.emailInput).toBeVisible();
    await expect(this.continueButton).toBeVisible();
  }

  async assertEmptyEmailError(expectedText: string): Promise<void> {
    await expect(this.emptyEmailError).toBeVisible();
    await expect(this.emptyEmailError).toContainText(expectedText);
  }

  async assertInvalidEmailError(expectedText: string): Promise<void> {
    await expect(this.invalidEmailError).toBeVisible();
    await expect(this.invalidEmailError).toContainText(expectedText);
  }

  // Assertions — Step 2

  // On the password screen, email is shown as read-only text (not an input).
  // The only way to change it is via the "Edit" link.
  async assertEmailNotEditable(): Promise<void> {
    await expect(this.readOnlyEmailDisplay).toBeVisible();
    await expect(this.emailInput).not.toBeVisible();
    await expect(this.editEmailLink).toBeVisible();
  }

  async getDisplayedEmail(): Promise<string> {
    const text = await this.readOnlyEmailDisplay.textContent();
    return text?.trim() || '';
  }

  async assertPasswordScreenLoaded(expectedUrl: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(expectedUrl);
    await expect(this.passwordInput).toBeVisible();
    await expect(this.continueButton).toBeVisible();
    await expect(this.editEmailLink).toBeVisible();
  }

  async assertEmptyPasswordError(expectedText: string): Promise<void> {
    await expect(this.emptyPasswordError).toBeVisible();
    await expect(this.emptyPasswordError).toContainText(expectedText);
  }

  async assertInvalidPasswordError(expectedText: string): Promise<void> {
    await expect(this.invalidPasswordError).toBeVisible();
    await expect(this.invalidPasswordError).toContainText(expectedText);
  }

  // Common Assertions

  async assertPageLoaded(expectedUrl: string | RegExp): Promise<void> {
    await this.assertEmailScreenLoaded(expectedUrl);
  }

  async assertStillOnLoginPage(expectedUrl: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(expectedUrl);
  }

  // Used for general errors (spaces as password) and rate limiting
  async assertPromptError(expectedText: string): Promise<void> {
    await expect(this.promptErrorMessage).toBeVisible();
    await expect(this.promptErrorMessage).toContainText(expectedText);
  }

  // Returns boolean instead of throwing — useful for conditional checks like rate limiting
  async isPromptErrorVisible(): Promise<boolean> {
    return await this.promptErrorMessage.isVisible().catch(() => false);
  }

  // Returns 'password' when masked, 'text' when visible
  async getPasswordInputType(): Promise<string | null> {
    return await this.passwordInput.getAttribute('type');
  }

  async getEmailInputValue(): Promise<string> {
    return await this.emailInput.inputValue();
  }
}
