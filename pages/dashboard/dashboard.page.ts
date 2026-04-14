import { type Page, type Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the Hudl Dashboard Page.
 *
 * This is the page users land on after successful login.
 * Handles post-login verification and user menu interactions.
 */
export class DashboardPage {
  readonly page: Page;
  readonly dashboardURL: string;

  // --- Locators ---
  readonly userAvatar: Locator;
  readonly userName: Locator;
  readonly userEmail: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page, dashboardURL: string) {
    this.page = page;
    this.dashboardURL = dashboardURL;

    // User menu elements
    this.userAvatar = page.locator('.u-avatar__content-container');
    this.userName = page.locator('[class*="displayName"]');
    this.userEmail = page.locator('[class*="globalUserItemEmail"]');
    this.logoutButton = page.locator('[data-qa-id="hui-logout"]');
  }

  // ===================
  // Actions
  // ===================

  /**
   * Open user dropdown menu by clicking on avatar.
   */
  async openUserMenu(): Promise<void> {
    await this.userAvatar.click();
  }

  /**
   * Logout from the application.
   * Opens user menu and clicks logout.
   */
  async logout(): Promise<void> {
    await this.openUserMenu();
    await this.logoutButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.logoutButton.click();
  }

  // ===================
  // Assertions
  // ===================

  /**
   * Assert that the dashboard is loaded after successful login.
   * Verifies URL matches the expected dashboard URL from env file.
   */
  async assertPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(this.dashboardURL, { timeout: 15000 });
  }

  /**
   * Assert that the user has navigated away from the login page.
   * Verifies the current URL does NOT match the given login URL pattern.
   */
  async assertNotOnLoginPage(loginURL: string | RegExp): Promise<void> {
    await expect(this.page).not.toHaveURL(loginURL, { timeout: 15000 });
  }

  /**
   * Assert page title matches expected.
   */
  async assertPageTitle(expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  /**
   * Assert user avatar is visible (indicates logged in state).
   */
  async assertUserAvatarVisible(): Promise<void> {
    await expect(this.userAvatar).toBeVisible();
  }

  /**
   * Assert the user display name in dropdown.
   * Opens user menu first to make elements visible.
   */
  async assertUserName(expectedName: string): Promise<void> {
    await this.openUserMenu();
    await expect(this.userName).toContainText(expectedName);
  }

  /**
   * Assert the user email in dropdown.
   * Requires user menu to be open.
   */
  async assertUserEmail(expectedEmail: string): Promise<void> {
    await expect(this.userEmail).toContainText(expectedEmail);
  }

  /**
   * Get the current page URL.
   */
  getCurrentURL(): string {
    return this.page.url();
  }

  /**
   * Get the page title.
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }
}
