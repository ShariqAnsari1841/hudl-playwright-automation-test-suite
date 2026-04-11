import { type Page, type Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the Hudl Dashboard Page.
 * This is the page users land on after successful login.
 *
 * Used primarily to verify successful login by checking
 * that the URL has changed away from the login page.
 */
export class DashboardPage {
  readonly page: Page;

  // --- Locators ---
  readonly userMenu: Locator;
  readonly globalNavigation: Locator;

  constructor(page: Page) {
    this.page = page;

    // Navigation elements (update after verifying post-login page)
    this.userMenu = page.locator('[data-qa-id="webnav-usermenu"]');
    this.globalNavigation = page.locator('nav');
  }

  // ===================
  // Assertions
  // ===================

  /**
   * Assert that the dashboard is loaded after successful login.
   * Verifies URL has changed away from /login.
   */
  async assertPageLoaded(): Promise<void> {
    await expect(this.page).not.toHaveURL(/.*login.*/, { timeout: 15000 });
    await expect(this.page).toHaveURL(/.*home.*/);
  }

  /**
   * Assert that user is logged in.
   * Uses flexible URL check — just verifies we're NOT on login page.
   * This is more resilient than checking for a specific dashboard URL.
   */
  async assertLoggedIn(): Promise<void> {
    await expect(this.page).not.toHaveURL(/.*login.*/, { timeout: 15000 });
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