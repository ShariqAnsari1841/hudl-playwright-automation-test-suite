/**
 * Singleton config reader that validates environment variables
 * loaded by playwright.config.ts via dotenv.
 *
 * Fails fast with descriptive errors if any required variable is missing.
 */
export class EnvConfigReader {
  private static instance: EnvConfigReader | undefined;

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

  public static getInstance(): EnvConfigReader {
    if (!EnvConfigReader.instance) {
      EnvConfigReader.instance = new EnvConfigReader();
    }
    return EnvConfigReader.instance;
  }

  // Useful for testing the config reader itself
  public static resetInstance(): void {
    EnvConfigReader.instance = undefined;
  }

  private getRequiredEnv(key: string): string {
    const value = process.env[key]?.trim();

    if (!value) {
      throw new Error(
        `Missing required environment variable: ${key}\n` +
          `  Environment: ${this.environment}\n` +
          `  Check your env/.env.${this.environment} file`,
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
