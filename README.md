# Hudl Login Automation Test Suite

A production-ready test automation framework built with **Playwright** and **TypeScript** to validate the Hudl Login flow.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Environment Configuration](#environment-configuration)
- [Running Tests](#running-tests)
- [Code Quality](#code-quality)
- [CI/CD Pipeline](#cicd-pipeline)
- [Viewing Test Reports](#viewing-test-reports)
- [Test Scenarios Covered](#test-scenarios-covered)
- [Design Decisions](#design-decisions)

---

## Tech Stack

| Technology                                            | Purpose                         |
| ----------------------------------------------------- | ------------------------------- |
| [Playwright](https://playwright.dev/)                 | Test automation framework       |
| [TypeScript](https://www.typescriptlang.org/)         | Programming language            |
| [ESLint](https://eslint.org/)                         | Code quality and linting        |
| [Prettier](https://prettier.io/)                      | Code formatting                 |
| [GitHub Actions](https://github.com/features/actions) | CI/CD pipeline                  |
| [dotenv](https://www.npmjs.com/package/dotenv)        | Environment variable management |

---

## Project Structure

<!-- prettier-ignore-start -->
```markdown
hudl-playwright-automation-test-suite/
├── .github/
│   └── workflows/
│       └── playwright.yml              # CI/CD pipeline configuration
├── config/
│   └── env.config.ts                   # Singleton environment config reader
├── env/
│   ├── .env.prod                       # Production credentials (git-ignored)
│   └── .env.staging                    # Staging credentials (git-ignored)
├── env_example/
│   ├── .env.prod.example              # Template for production environment variables
│   └── .env.staging.example           # Template for staging environment variables
├── fixtures/
│   └── base.fixture.ts                # Custom Playwright fixtures
├── pages/
│   ├── login/
│   │   └── login.page.ts             # Login page object model
│   └── dashboard/
│       └── dashboard.page.ts          # Dashboard page object model
├── tests/
│   └── login/
│       ├── login-valid.spec.ts        # Valid login test scenarios
│       ├── login-invalid.spec.ts      # Invalid login test scenarios
│       └── login-ui.spec.ts           # UI validation test scenarios
├── utils/
│   ├── helpers/  
│   │   └── email.helper.ts           # Random email generator utility
│   └── test-data/
│       └── login-test-data/
│           └── login.test.data.ts      # Test data constants
├── .gitignore
├── .prettierrc                        # Prettier configuration
├── .prettierignore                    # Prettier ignore patterns
├── eslint.config.mjs                  # ESLint configuration
├── package.json
├── playwright.config.ts               # Playwright configuration
├── tsconfig.json                      # TypeScript configuration
└── README.md
```
<!-- prettier-ignore-end -->

### Key Design Patterns

- **Page Object Model (POM):** Each page has its own class encapsulating locators and actions
- **Feature-based folder structure:** Tests, pages, and test data organized by feature for scalability
- **Custom Fixtures:** Reusable test setup for credentials, page objects, and authenticated sessions
- **Singleton Config Reader:** Single source of truth for environment configuration

---

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (v18 or higher) — [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** — [Download](https://git-scm.com/)

### Verify Installation

```bash
node --version    # Should be v18+
npm --version     # Should be v9+
git --version     # Should be v2+
```

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone git@github.com:ShariqAnsari1841/hudl-playwright-automation-test-suite.git
cd hudl-playwright-automation-test-suite
```

### 2. Install Dependencies

```bash
npm ci
```

### 3. Install Playwright Browsers

```bash
npx playwright install
```

### 4. Setup Environment Variables

The `env/` folder containing actual credentials is **git-ignored** and won't exist after cloning. Create it using the example templates:

```bash
mkdir -p env
cp env_example/.env.prod.example env/.env.prod
cp env_example/.env.staging.example env/.env.staging
```

---

## Environment Configuration

The framework supports **multiple environments** via separate env files:

| File                               | Environment | Usage                                       |
| ---------------------------------- | ----------- | ------------------------------------------- |
| `env/.env.prod`                    | Production  | `env=prod npx playwright test`              |
| `env/.env.staging`                 | Staging     | `env=staging npx playwright test`           |
| `env_example/.env.prod.example`    | Template    | Reference for required production variables |
| `env_example/.env.staging.example` | Template    | Reference for required staging variables    |

### Required Environment Variables

| Variable        | Description                 | Example                |
| --------------- | --------------------------- | ---------------------- |
| `BASE_URL`      | Base URL of the application | `https://www.hudl.com` |
| `DASHBOARD_URL` | URL after successful login  | `https://fan.hudl.com` |
| `HUDL_EMAIL`    | Test account email          | `test@example.com`     |
| `HUDL_PASSWORD` | Test account password       | `password123`          |

### How Environment Loading Works

1.  `playwright.config.ts` reads the `env` variable (defaults to `prod`)
2.  Loads the corresponding `env/.env.{env}` file using dotenv
3.  `config/env.config.ts` validates all required variables exist
4.  Fixtures and tests access values through the config reader

---

## Running Tests

### Run All Tests (Default: Production)

```bash
npx playwright test
```

### Run Against Specific Environment

```bash
# Production
env=prod npx playwright test

# Staging
env=staging npx playwright test
```

### Run Specific Test Files

```bash
# Only valid login tests
env=prod npx playwright test tests/login/login-valid.spec.ts

# Only invalid login tests
env=prod npx playwright test tests/login/login-invalid.spec.ts

# Only UI validation tests
env=prod npx playwright test tests/login/login-ui.spec.ts
```

### Run in Specific Browser

```bash
# Chromium only
env=prod npx playwright test --project=chromium

# Firefox only
env=prod npx playwright test --project=firefox

# WebKit only
env=prod npx playwright test --project=webkit
```

### Run in Headed Mode (Watch the Browser)

```bash
env=prod npx playwright test --headed
```

### Run in Playwright UI Mode

```bash
env=prod npx playwright test --ui
```

### Using npm Scripts

```bash
npm run test              # Run all tests (prod)
npm run test:prod         # Run all tests (prod)
npm run test:staging      # Run all tests (staging)
npm run test:headed       # Run in headed mode
npm run test:chromium     # Run in Chromium only
npm run test:ui           # Open Playwright UI mode
npm run test:report       # Open last HTML report
```

---

## Code Quality

The project uses **ESLint** for code quality and **Prettier** for consistent formatting.

### Linting (ESLint)

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix
```

### Formatting (Prettier)

```bash
# Check formatting
npm run format:check

# Auto-fix formatting
npm run format
```

### Recommended Workflow

Before committing any changes, run:

```bash
npm run lint
npm run format
npm run format:check
```

This ensures:

- No code quality issues (ESLint)
- Consistent formatting (Prettier)
- CI pipeline won't fail on code quality checks

---

## CI/CD Pipeline

The project includes a **GitHub Actions** pipeline that runs automatically on:

- **Push** to `main` branch
- **Pull** request to `main` branch
- **Manual trigger** with environment selection

### Pipeline Steps

1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Install Playwright browsers
5. Create environment file from GitHub Secrets
6. Run ESLint
7. Check Prettier formatting
8. Run Playwright tests
9. Bundle screenshots and videos with report
10. Upload HTML report as artifact
11. Post Setup Node.js
12. Post Checkout code
13. Complete job

### Manual Trigger

1. Go to **Actions** tab on GitHub
2. Click **"Playwright Tests"** workflow
3. Click **"Run workflow"**
4. Select environment: **prod** or **staging**
5. Click **"Run workflow"**

### GitHub Secrets Required

Set these in **Settings → Secrets and variables → Actions**:

| Secret                  | Description              |
| ----------------------- | ------------------------ |
| `PROD_BASE_URL`         | Production base URL      |
| `PROD_DASHBOARD_URL`    | Production dashboard URL |
| `PROD_HUDL_EMAIL`       | Production test email    |
| `PROD_HUDL_PASSWORD`    | Production test password |
| `STAGING_BASE_URL`      | Staging base URL         |
| `STAGING_DASHBOARD_URL` | Staging dashboard URL    |
| `STAGING_HUDL_EMAIL`    | Staging test email       |
| `STAGING_HUDL_PASSWORD` | Staging test password    |

---

## Viewing Test Reports

### After Local Test Run

```bash
npm run test:report
```

This opens the interactive HTML report in your default browser.

### After CI Pipeline Run

1. Go to **Actions** tab on GitHub
2. Click on a workflow run
3. Scroll to **Artifacts** section
4. Download **playwright-report-{environment}**
5. Unzip the downloaded file
6. Run:

```bash
npx playwright show-report path/to/unzipped/playwright-report
```

The report includes:

- Test results with pass/fail status
- Screenshots on failure
- Video recordings on failure
- Trace viewer for debugging

---

## Test Scenarios Covered

### Valid Login Tests (4 tests)

| #   | Scenario                                                     |
| --- | ------------------------------------------------------------ |
| 1   | Verify user can login successfully with valid credentials    |
| 2   | Verify user is redirected to dashboard after successful login |
| 3   | Verify user avatar is displayed after successful login       |
| 4   | Verify session is maintained after page reload post-login    |

### Invalid Login Tests (9 tests)

#### Email Validation

| #   | Scenario                                                 |
| --- | -------------------------------------------------------- |
| 1   | Verify error is shown when submitting empty email        |
| 2   | Verify error is shown when submitting malformed email    |
| 3   | Verify error is shown when submitting spaces only as email |

#### Password Validation

| #   | Scenario                                                              |
| --- | --------------------------------------------------------------------- |
| 4   | Verify error is shown when submitting empty password                  |
| 5   | Verify error is shown when submitting wrong password                  |
| 6   | Verify general error is shown when submitting spaces only as password |
| 7   | Verify user remains on login page after failed password attempt       |
| 8   | Verify user can retry after failed password attempt                   |

#### Rate Limiting

| #   | Scenario                                                              |
| --- | --------------------------------------------------------------------- |
| 9   | Verify rate limit error is shown after too many failed login attempts |

### UI Validation Tests (14 tests)

#### Email Screen

| #   | Scenario                                                 |
| --- | -------------------------------------------------------- |
| 1   | Verify all email screen elements are displayed           |
| 2   | Verify correct page heading is displayed                 |
| 3   | Verify correct page title is displayed                   |
| 4   | Verify Hudl logo is displayed on email screen            |
| 5   | Verify page redirects to identity provider URL           |
| 6   | Verify email input field is editable                     |
| 7   | Verify transition from email screen to password screen   |

#### Password Screen

| #   | Scenario                                                          |
| --- | ----------------------------------------------------------------- |
| 8   | Verify all password screen elements are displayed                 |
| 9   | Verify entered email is displayed as read-only on password screen |
| 10  | Verify password is masked by default                              |
| 11  | Verify password visibility can be toggled                         |
| 12  | Verify navigation to forgot password page                         |
| 13  | Verify user returns to email screen when clicking edit email      |
| 14  | Verify email is preserved when returning to email screen via edit |

**Total: 27 test scenarios**

---

## Design Decisions

| Decision                      | Rationale                                                                                                                                        |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Page Object Model**         | Separates page interactions from test logic. UI changes only require updating one file                                                           |
| **Custom Fixtures**           | Provides reusable test setup. `loginPage` fixture automatically navigates to login page. `authenticatedPage` fixture handles complete login flow |
| **Multi-environment support** | Separate env files for prod/staging. Switch with single command: `env=staging npx playwright test`                                               |
| **Singleton Config Reader**   | Loads and validates env variables once. Provides type-safe getters. Fails fast with descriptive errors if variables are missing                  |
| **Random Email Generator**    | Prevents rate limiting during negative tests. Each test run uses unique emails                                                                   |
| **Feature-based folders**     | Tests, pages, and data organized by feature (`login/`, `dashboard/`). Easy to scale when new features are added                                  |
| **Two-step login flow**       | Hudl uses email-first, then password login. Page object handles both steps with separate methods for granular control                            |
| **ESLint + Prettier**         | ESLint catches code quality issues. Prettier ensures consistent formatting. Together they enforce team coding standards                          |
| **GitHub Actions CI/CD**      | Automated testing on every push/PR. HTML report uploaded as artifact. Credentials secured via GitHub Secrets                                     |

---

## Notes

- **Hudl Login Flow:** The login page uses a two-step authentication flow.
  - Step 1: Collects the email.
  - Step 2: Collects the password. The page object model reflects this with separate methods for each step.
- **Rate Limiting:** The rate limit test attempts to trigger the error message naturally.
- **Cross-browser:** Tests are configured for Chromium, Firefox, and WebKit. CI runs on Chromium for speed.
