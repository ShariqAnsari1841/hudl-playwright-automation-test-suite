/**
 * Singleton configuration reader that validates and provides
 * access to environment variables loaded by playwright.config.ts.
 *
 * The .env file is loaded in playwright.config.ts based on env.
 * This class only validates and exposes the loaded values.
 *
 * Usage:
 *   import { EnvConfigReader } from '../config/env.config';
 *   const config = EnvConfigReader.getInstance();
 *   config.getBaseURL();
 *   config.getCredentials();
 */
export class EnvConfigReader {
  private static instance: EnvConfigReader;

  private readonly baseURL: string;
  private readonly dashboardURL: string;
  private readonly email: string;
  private readonly password: string;
  private readonly environment: string;

  private constructor() {
    this.environment = process.env.env || 'prod';
    this.baseURL = this.getRequiredEnv('BASE_URL');
    this.dashboardURL = this.getRequiredEnv('DASHBOARD_URL');
    this.email = this.getRequiredEnv('HUDL_EMAIL');
    this.password = this.getRequiredEnv('HUDL_PASSWORD');
  }

  /**
   * Returns the singleton instance of EnvConfigReader.
   */
  public static getInstance(): EnvConfigReader {
    if (!EnvConfigReader.instance) {
      EnvConfigReader.instance = new EnvConfigReader();
    }
    return EnvConfigReader.instance;
  }

  /**
   * Resets the singleton instance.
   * Useful for testing the config reader itself.
   */
  public static resetInstance(): void {
    EnvConfigReader.instance = undefined as unknown as EnvConfigReader;
  }

  /**
   * Retrieves a required environment variable.
   * Throws descriptive error if the variable is missing.
   */
  private getRequiredEnv(key: string): string {
    const value = process.env[key]?.trim();

    if (!value) {
      throw new Error(
        `\n❌ Missing required environment variable: ${key}\n` +
          `   Current environment: ${this.environment}\n` +
          `   Please check your env/.env.${this.environment} file\n` +
          `   Refer to env/.env.example for required variables\n`,
      );
    }

    return value;
  }

  // --- Public Getters ---

  public getBaseURL(): string {
    return this.baseURL;
  }

  public getEmail(): string {
    return this.email;
  }

  public getPassword(): string {
    return this.password;
  }

  public getEnvironment(): string {
    return this.environment;
  }

  public getCredentials(): { email: string; password: string } {
    return {
      email: this.email,
      password: this.password,
    };
  }

  public getDashboardURL(): string {
    return this.dashboardURL;
  }
}
