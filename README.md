# Take Home Assessment — Playwright BDD Framework

A test automation framework for [automationexercise.com](https://automationexercise.com), built with **Playwright** and **TypeScript**, using **BDD** (Behaviour-Driven Development) for test authoring and the **Page Object Model (POM)** as the design pattern for page interactions.

Designed for multi-team scalability — each product team owns its feature files, step definitions, and page objects, isolated within their own subfolder under a shared test-type hierarchy.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [Playwright](https://playwright.dev) | Cross-browser automation (Chromium, Firefox, WebKit) |
| [playwright-bdd](https://vitalets.github.io/playwright-bdd) | BDD layer for Playwright using Gherkin syntax |
| [TypeScript](https://www.typescriptlang.org) | Type-safe test and framework code |
| [Gherkin](https://cucumber.io/docs/gherkin/) | Human-readable feature files |

---

## Initial Setup

### Prerequisites

- [Node.js](https://nodejs.org) v18 or higher
- npm v8 or higher

### 1. Install dependencies

```bash
npm install
```

### 2. Install Playwright browsers

```bash
npx playwright install
```

### 3. Configure test credentials (for login tests)

The login tests require an existing account on automationexercise.com. Create one manually at https://automationexercise.com/login, then export the credentials as environment variables:

**macOS / Linux:**
```bash
export TEST_USER_EMAIL=your@email.com
export TEST_USER_PASSWORD=yourpassword
export TEST_USER_NAME="Your Name"
```

**Windows (PowerShell):**
```powershell
$env:TEST_USER_EMAIL="your@email.com"
$env:TEST_USER_PASSWORD="yourpassword"
$env:TEST_USER_NAME="Your Name"
```

> Registration tests generate a unique email per run — no credentials needed for those.

---

## Running Tests

### Run all tests (all browsers, headless)

```bash
npm test
```

### Run API tests only (headless, Chromium)

```bash
npm run test:api
```

### Run UI tests with the browser visible

```bash
npm run test:headed
```

### Run UI tests for a specific browser

```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

> `test:headed`, `test:chromium`, `test:firefox`, and `test:webkit` run **UI tests only** (`--grep @ui`).  
> Use `npm test` to run the full suite (UI + API, all browsers).

### Run tests by tag

```bash
# UI tests only
npx bddgen && npx playwright test --grep @ui

# API tests only
npx bddgen && npx playwright test --grep @api

# Auth scenarios only (login + registration)
npx bddgen && npx playwright test --grep @auth

# Products scenarios only (search, cart, products API)
npx bddgen && npx playwright test --grep @products
```

### Generate CODEOWNERS

```bash
npm run generate:codeowners
```

### View the HTML report

```bash
npm run report
```

---

## Project Structure

```
take-home-assessment/
├── .github/
│   ├── CODEOWNERS                             # Auto-generated — run generate:codeowners
│   └── workflows/
│       ├── ci.yml                             # Full suite on push/PR to main or develop
│       ├── ui-tests-template.yml              # Reusable UI workflow (called by team workflows)
│       ├── api-tests-template.yml             # Reusable API workflow (called by team workflows)
│       ├── core-team-ui-tests.yml             # Core Team: triggered on core-team UI file changes
│       ├── core-team-api-tests.yml            # Core Team: triggered on core-team API file changes
│       ├── user-journeys-team-ui-tests.yml    # User Journeys: triggered on UJ UI file changes
│       └── user-journeys-team-api-tests.yml   # User Journeys: triggered on UJ API file changes
│
├── features/                                  # BDD scenarios (Gherkin)
│   ├── ui/                                    # ← UI test domain
│   │   ├── core-team/                         #   Core Team owns this slice
│   │   │   ├── login.feature
│   │   │   └── register.feature
│   │   └── user-journeys-team/                #   User Journeys Team owns this slice
│   │       └── product-search.feature
│   └── api/                                   # ← API test domain
│       └── user-journeys-team/
│           └── products-api.feature
│
├── pages/                                     # Page Object Model classes
│   ├── core-team/                             # Core Team page objects
│   │   ├── base-page.ts                       #   Abstract base with common helpers (shared)
│   │   ├── auth/
│   │   │   ├── login-page.ts
│   │   │   └── register-page.ts
│   │   └── core/
│   │       ├── header-page.ts                 #   Navigation header (shared)
│   │       └── home-page.ts
│   └── user-journeys-team/                    # User Journeys Team page objects
│       ├── products/
│       │   └── product-list-page.ts
│       └── cart/
│           └── cart-page.ts
│
├── steps/                                     # BDD step definitions
│   ├── ui/                                    # ← UI step domain
│   │   ├── core-team/                         #   Core Team UI steps
│   │   │   ├── auth/
│   │   │   │   └── auth.steps.ts
│   │   │   └── common/
│   │   │       └── navigation.steps.ts
│   │   └── user-journeys-team/                #   User Journeys UI steps
│   │       └── products/
│   │           └── products.steps.ts
│   └── api/                                   # ← API step domain
│       ├── core-team/                         #   Core Team API steps
│       │   ├── common-api.steps.ts
│       │   └── register-api.steps.ts          #   API account creation (shared by UI login TC)
│       └── user-journeys-team/                #   User Journeys API steps
│           └── products-api.steps.ts
│
├── support/
│   ├── fixtures/
│   │   └── index.ts                           # Custom Playwright fixtures (page object DI)
│   └── helpers/
│       └── api-client.ts                      # Typed HTTP client wrapper
│
├── test-data/
│   └── users.ts                               # Typed test data and generators
│
├── codeowners.yaml                            # Source of truth for CODEOWNERS generation
├── .features-gen/                             # Auto-generated spec files — do not edit
├── playwright.config.ts
├── tsconfig.json
├── package.json
├── README.md
└── TEST-STRATEGY.md
```

---

## Scalability Design

The folder hierarchy is deliberately structured in two levels:

```
{features|steps}/
  {test-type}/          ← ui, api, mobile, performance, ...
    {team}/             ← core-team, user-journeys-team, checkout-team, ...
```

**Why this order matters:**

- Adding a **new team** only requires creating a `{team}/` subfolder within each relevant test-type directory — zero impact on existing teams.
- Adding a **new test type** (e.g. `mobile/`, `performance/`) only requires a new top-level folder alongside `ui/` and `api/` — zero impact on existing test types.
- CI workflows follow the same convention: `{team}-{type}-tests.yml`. Each team's pipeline is entirely independent.
- Page objects mirror this under `pages/{team}/` — teams own their component directories and can evolve them independently.

This means the framework can scale from 2 to 20 teams, and from 2 to 10 test types, without any structural refactoring.

---

## How BDD Works in This Framework

```
features/{type}/{team}/*.feature  →  steps/{type}/{team}/*.steps.ts  →  pages/{team}/*.ts
         (what to test)                     (how to test)                  (interactions)
```

### 1. Feature file

Written in plain Gherkin — readable by engineers, QA, and product owners alike:

```gherkin
@ui @auth
Feature: User Login

  Scenario: Login with correct email and password
    Given I create a new account by API
    And I navigate to the home page
    When I login with valid credentials
    Then I should be logged in successfully
```

The `@ui` tag restricts this feature to the UI test suite; `@auth` allows targeted execution by domain (e.g. `--grep @auth`).

### 2. Step definitions

Each Gherkin line maps to a TypeScript function. Fixtures (page objects) are injected automatically:

```typescript
Given('I am on the login page', async ({ loginPage }) => {
  await loginPage.goto();
});
```

### 3. Page Object

Encapsulates all locators and actions for a page — steps stay clean, selectors are centralised:

```typescript
export class LoginPage extends BasePage {
  readonly loginEmailInput = this.page.locator('input[data-qa="login-email"]');

  async login(email: string, password: string): Promise<void> {
    await this.loginEmailInput.fill(email);
    // ...
  }
}
```

### 4. Fixtures

Custom Playwright fixtures in [support/fixtures/index.ts](support/fixtures/index.ts) provide two things via dependency injection:

**Page objects** — instantiated once per test and injected by name:
```typescript
Given('I am on the login page', async ({ loginPage }) => {
  await loginPage.goto();
});
```

**Shared scenario state** — typed mutable objects passed by reference, so any step file can read or write them within the same scenario without `(page as any)` casts:

| Fixture | Type | Used for |
|---|---|---|
| `apiResponse` | `{ value: APIResponse \| null }` | Raw response from the last API call |
| `apiResponseBody` | `{ value: Record<string, unknown> }` | Parsed JSON body of the last API call |
| `scenarioUser` | `{ apiCreated, newUser }` | User created by API setup or UI registration |
| `cartState` | `{ products: Array<{name, price}> }` | Products added to cart during a scenario |

Because Playwright passes fixture values by reference, a step in `register-api.steps.ts` that writes to `scenarioUser.apiCreated` is immediately visible to a step in `auth.steps.ts` that reads it — with full type safety.

### 5. Code generation

`playwright-bdd` generates standard Playwright spec files from `.feature` files into `.features-gen/` before each run. This happens automatically via `npm test` — never edit files in `.features-gen/` directly.

---

## Multi-Team Ownership

Each team owns a vertical slice of the test suite:

| Folder | Owner |
|---|---|
| `features/ui/core-team/`, `steps/ui/core-team/`, `pages/core-team/` | Core Team |
| `features/ui/user-journeys-team/`, `steps/ui/user-journeys-team/`, `pages/user-journeys-team/` | User Journeys Team |
| `features/api/user-journeys-team/`, `steps/api/user-journeys-team/` | User Journeys Team |
| `steps/api/core-team/`, `support/` | Core Team |

Teams trigger their own CI workflow on changes to their files. The main `ci.yml` runs the full suite on PRs to `main`/`develop`.

Code ownership is enforced via `.github/CODEOWNERS` — generated from [codeowners.yaml](codeowners.yaml).

---

## CI/CD

See [TEST-STRATEGY.md](TEST-STRATEGY.md) for the full CI/CD architecture.

### Workflow overview

```
Push to main/develop
       │
       ├── Core Team / UI     → chromium + firefox + webkit  (parallel)
       ├── Core Team / API    → chromium only
       ├── User Journeys / UI → chromium + firefox + webkit  (parallel)
       └── User Journeys / API → chromium only

Per-team push (path-filtered)
       │
       ├── core-team-ui-tests.yml      → triggered on core-team UI file changes
       ├── core-team-api-tests.yml     → triggered on core-team API file changes
       ├── user-journeys-team-ui-tests.yml  → triggered on UJ UI file changes
       └── user-journeys-team-api-tests.yml → triggered on UJ API file changes
```

All team workflows delegate to a shared reusable template (`ui-tests-template.yml` / `api-tests-template.yml`), so execution logic lives in one place.

---

## Onboarding a New Team

1. Create `features/ui/{team}/`, `features/api/{team}/`, `steps/ui/{team}/`, `steps/api/{team}/`, `pages/{team}/`
2. Add BDD tag `@{team}` to feature files
3. Copy an existing team workflow: `core-team-ui-tests.yml` → `{team}-ui-tests.yml`, update the tag and path filters
4. Register new page objects in [support/fixtures/index.ts](support/fixtures/index.ts)
5. Add the team job to [.github/workflows/ci.yml](.github/workflows/ci.yml)
6. Add the team to [codeowners.yaml](codeowners.yaml) and run `npm run generate:codeowners`
