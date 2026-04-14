import { type Page, type Locator, expect } from '@playwright/test';

/**
 * Page Object for the Hudl Dashboard (post-login landing page).
 * Handles post-login verification and user menu interactions.
 */
export class DashboardPage {
  readonly page: Page;
  readonly dashboardURL: string;

  readonly userAvatar: Locator;
  readonly userName: Locator;
  readonly userEmail: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page, dashboardURL: string) {
    this.page = page;
    this.dashboardURL = dashboardURL;

    // Dashboard uses CSS module classes with hashed suffixes (e.g. displayName__gvbG5).
    // Using substring matching where data-qa-id attributes aren't available.
    this.userAvatar = page.locator('.u-avatar__content-container');
    this.userName = page.locator('[class*="displayName"]');
    this.userEmail = page.locator('[class*="globalUserItemEmail"]');
    this.logoutButton = page.locator('[data-qa-id="hui-logout"]');
  }

  // Actions

  async openUserMenu(): Promise<void> {
    await this.userAvatar.click();
  }

  async logout(): Promise<void> {
    await this.openUserMenu();
    await this.logoutButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.logoutButton.click();
  }

  // Assertions

  async assertPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(this.dashboardURL, { timeout: 15000 });
  }

  // Negative check — asserts we've navigated away from the login page URL.
  // More resilient than matching a specific dashboard URL pattern.
  async assertNotOnLoginPage(loginURL: string | RegExp): Promise<void> {
    await expect(this.page).not.toHaveURL(loginURL, { timeout: 15000 });
  }

  async assertPageTitle(expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  async assertUserAvatarVisible(): Promise<void> {
    await expect(this.userAvatar).toBeVisible();
  }

  // Opens user menu first since display name is inside the dropdown
  async assertUserName(expectedName: string): Promise<void> {
    await this.openUserMenu();
    await expect(this.userName).toContainText(expectedName);
  }

  // Requires user menu to already be open
  async assertUserEmail(expectedEmail: string): Promise<void> {
    await expect(this.userEmail).toContainText(expectedEmail);
  }

  getCurrentURL(): string {
    return this.page.url();
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }
}
