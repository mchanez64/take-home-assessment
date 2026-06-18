# Test Strategy & Architecture Document

**Application:** automationexercise.com  
**Role:** Senior Test Architect  
**Date:** June 2026

---

## 1. Overall Test Strategy

The goal is to establish a risk-based, layered testing strategy that provides confidence in the application at the right level, at the right cost. Not every scenario needs an end-to-end browser test — the challenge is to allocate tests across layers efficiently.

### Testing Pyramid

```
          ▲
         /E2E\          Small number of critical user journeys
        /─────\         Slow, brittle if overused, highest confidence
       / Integ \        Service-to-service contracts, API layer
      /─────────\       Fast, isolated, catch regressions early
     /   Unit    \      Business logic, utilities, transformations
    /─────────────\     Fastest, most granular
```

For automationexercise.com, the focus is on the **API and E2E layers** because the application is primarily a UI+API product with no exposed business logic layer to unit test directly. In a real SaaS product, the pyramid would be weighted more towards unit/integration tests.

### Test Selection Rationale

Tests were selected to cover **key user journeys** with the highest business value and risk:

| Area | Scenarios Selected | Rationale |
|---|---|---|
| Auth | Login (success + failure), Register | Core access path — if broken, nothing else works |
| Products | Search, Add to cart | Primary shopping journey |
| API | Product list, Brands list, Product search | Backend health, consumed by frontend |

Coverage is deliberately **not exhaustive** — the goal is to demonstrate a pattern that teams can extend, not to cover every edge case.

---

## 2. Testing Layers

### UI (End-to-End)
- **Tool:** Playwright with BDD (playwright-bdd)
- **Scope:** Critical user journeys — login, registration, product search, add to cart
- **When to use:** User-visible workflows that span multiple pages and require real browser rendering
- **When not to use:** Validation logic, error states that can be verified at the API layer, anything that requires many data permutations

### API
- **Tool:** Playwright's built-in `APIRequestContext`
- **Scope:** REST endpoints — product list, brand list, product search
- **When to use:** Verifying contract and schema of backend responses, status codes, data integrity
- **Advantage over UI:** 10-50x faster, no browser overhead, reliable

### Integration (not implemented — future scope)
- **Tool:** Would use a dedicated contract testing tool (e.g. Pact) or service mesh testing
- **Scope:** Microservice boundaries, event-driven flows, database state verification
- **When to add:** As the platform grows and teams own separate services

---

## 3. Tooling & Framework Choices

### Playwright
**Why Playwright over Cypress or Selenium:**
- Native multi-browser support (Chromium, Firefox, WebKit) in a single runner
- Built-in API testing — no separate HTTP library needed
- Auto-waiting eliminates most explicit waits
- Parallelism out of the box with isolated browser contexts
- First-class TypeScript support
- Active development and strong Playwright ecosystem

### playwright-bdd
**Why BDD:**
- Feature files serve as living documentation readable by non-engineers
- Gherkin scenarios can be written collaboratively with Product Owners before implementation
- Tag-based filtering (`@core`, `@user-journeys`, `@api`) allows per-team execution in CI
- Step re-use across scenarios reduces duplication

**Why playwright-bdd over Cucumber:**
- Cucumber requires its own runner, sandboxed from Playwright's test runner
- playwright-bdd generates standard Playwright spec files, so all Playwright features (fixtures, parallelism, tracing, HTML reports) work natively
- No impedance mismatch between the BDD layer and the underlying runner

### Page Object Model
**Why POM:**
- Centralises selectors — one change propagates everywhere
- Steps stay readable and declarative
- Different teams can evolve their page objects independently
- `BasePage` enforces shared patterns (navigation, wait strategies)

### TypeScript
- Catches selector typos, wrong fixture usage, and type mismatches at compile time
- Dramatically improves IDE support and refactoring confidence

---

## 4. CI/CD Integration

### Pipeline Architecture

```
Developer pushes code
        │
        ├── If core-team UI files changed    → core-team-ui-tests.yml  (3 browsers in parallel)
        ├── If core-team API files changed   → core-team-api-tests.yml  (chromium only)
        ├── If user-journeys UI files changed  → user-journeys-team-ui-tests.yml (3 browsers)
        └── If user-journeys API files changed → user-journeys-team-api-tests.yml (chromium only)

PR / merge to main or develop
        │
        └── ci.yml (full suite — all teams, all test types, all browsers)
                ├── Core Team / UI      → 3 browsers in parallel
                ├── Core Team / API     → chromium only
                ├── User Journeys / UI  → 3 browsers in parallel
                └── User Journeys / API → chromium only
```

### Reusable Workflow Pattern
All team workflows delegate to one of two reusable templates:
- `ui-tests-template.yml` — handles browser matrix, artifact upload, and env injection for UI tests
- `api-tests-template.yml` — handles chromium-only execution for API tests

This means:
- The execution logic lives in one place
- Teams get identical runtime environments
- Changes to the test runner (e.g. Node version upgrade, new env vars) are made once, in the template

### Scalability of the Workflow Design

The naming convention `{team}-{type}-tests.yml` mirrors the folder structure. When a new team is onboarded:
- One new `{team}-ui-tests.yml` and one `{team}-api-tests.yml` are created by copying an existing file and changing the team name and path filters
- No existing workflow files are modified
- The new team's jobs are added to `ci.yml` — the only file that changes across teams

### Browser Strategy in CI
- **UI tests:** All three engines (Chromium, Firefox, WebKit) run in parallel via matrix strategy
- **API tests:** Chromium only — API tests don't render a UI, so multiple browsers add no value
- `fail-fast: false` ensures one browser failure doesn't cancel the others

### Secrets Management
Sensitive credentials (`TEST_USER_EMAIL`, `TEST_USER_PASSWORD`) are stored as GitHub repository secrets and injected at runtime. They never appear in the codebase or logs.

### Artefacts
- HTML reports uploaded per team and per browser, retained 30 days
- Failure screenshots and videos uploaded separately, retained 7 days
- Reports can be extended to publish to a shared dashboard (e.g. Allure, ReportPortal) in future

---

## 5. Scaling Across Multiple Teams

### Two-Level Folder Hierarchy

The framework uses a deliberate two-level hierarchy for all test artefacts:

```
{features|steps}/
  {test-type}/         ← ui, api, mobile, performance, ...
    {team}/            ← core-team, user-journeys-team, checkout-team, ...
```

```
pages/
  {team}/              ← core-team, user-journeys-team, checkout-team, ...
    {component}/       ← auth, products, cart, core, ...
```

**Why this structure enables scalability:**

| Growth dimension | What changes | What is untouched |
|---|---|---|
| New team joins | Add `{team}/` subfolder within each test-type | All other teams' files |
| New test type added (e.g. `mobile/`) | Add new top-level folder alongside `ui/` and `api/` | All existing test types and teams |
| Team adds a new component | Add subfolder within their `pages/{team}/` | All other teams |

Each team owns a **vertical slice**: their feature files, step definitions, and page objects. They can add tests, rename selectors, or restructure their own component hierarchy without touching other teams' code.

### Current Team Ownership

```
features/ui/core-team/     → Core Team
features/ui/user-journeys-team/ → User Journeys Team
features/api/user-journeys-team/ → User Journeys Team
steps/ui/core-team/        → Core Team
steps/ui/user-journeys-team/ → User Journeys Team
steps/api/core-team/       → Core Team
steps/api/user-journeys-team/ → User Journeys Team
pages/core-team/           → Core Team
pages/user-journeys-team/  → User Journeys Team
support/                   → Core Team (shared infrastructure)
playwright.config.ts       → Core Team
```

**Core Team** is responsible for the shared framework layer:
- `pages/core-team/base-page.ts` — BasePage, shared component helpers
- `pages/core-team/core/` — HeaderPage, HomePage (shared across all pages)
- `support/fixtures/index.ts` — fixture registration for all teams
- `support/helpers/` — API clients, shared utilities
- `playwright.config.ts` — framework-level configuration
- CI workflow templates and `ci.yml`

Code ownership is enforced via `.github/CODEOWNERS`, generated from `codeowners.yaml`.

### Tag Strategy
BDD tags (`@core`, `@user-journeys`, `@api`) serve multiple purposes:
- Run one team's suite in isolation: `--grep @core`
- Exclude unstable tests: `--grep-invert @flaky`
- Mark smoke tests: `--grep @smoke`
- Mark regression tests: `--grep @regression`

### Preventing Cross-Team Coupling
- Step definitions should never import page objects from another team's folder
- If a step needs a shared component (e.g. `HeaderPage`), it should go through `support/fixtures`
- Shared pages go into `pages/core-team/core/` under the Core Team

### Onboarding a New Team
1. Create `features/ui/{team}/`, `features/api/{team}/`, `steps/ui/{team}/`, `steps/api/{team}/`, `pages/{team}/`
2. Add BDD tag `@{team}` to feature files
3. Copy an existing team workflow: `core-team-ui-tests.yml` → `{team}-ui-tests.yml`, update the tag and path filters
4. Register new page objects in `support/fixtures/index.ts`
5. Add team jobs to `ci.yml`
6. Add team entry to `codeowners.yaml` and run `npm run generate:codeowners`

---

## 6. Microservices vs Monolithic Architectures

### Monolith
The current automationexercise.com behaves like a monolith — one frontend, one backend, one deployment. The test strategy is straightforward:
- E2E tests hit the deployed application
- API tests call the same base URL
- Environments are differentiated by `BASE_URL` environment variable

### Microservices / SaaS Platform
In a distributed architecture (multiple services, multiple teams), the strategy evolves and on top of the existing UI/e2e and API tests, the following test types could also considered:

**Contract Testing (Pact / OpenAPI):**
- Each service defines the API contract it exposes
- Consumer teams write consumer-driven contract tests
- Provider teams verify against those contracts in CI
- Catches breaking changes before integration testing
- Contract tests provider/consumer generally live in 
development projects (e.g., microservices)

**Service-Level Testing:**
- Each service has its own test suite (unit + integration) living in 
development projects and its own API suite part of the test automation
- E2E tests cover cross-service journeys only — they are expensive and fragile when they span many services

**Test Environment Management:**
- Each service deploys to a shared staging environment on merge
- Feature branch deployments (preview environments) allow PR-level E2E testing without merging to staging
- Environment isolation prevents cross-team interference during testing

**Shared Test Infrastructure:**
- Centralised reporting (Allure Server, ReportPortal, or similar)
- Shared test data service to provision and teardown test accounts
- Shared secrets manager (HashiCorp Vault, AWS Secrets Manager)

---

## 7. Test Data, Environments, and Reliability

### Test Data Strategy

| Type | Approach |
|---|---|
| Static reference data (countries, categories) | Seeded in `test-data/` — versioned with the tests |
| Dynamic entities (user accounts) | Generated at runtime with a timestamp to ensure uniqueness |
| Sensitive credentials | Environment variables — never committed to source control |

**Registration tests** generate a unique email (`testuser_<timestamp>@mailinator.com`) on every run to avoid conflicts with previous runs. Mailinator allows disposable emails without account creation — suitable for test automation.

**Login tests (TC2)** create a fresh account via the `POST /api/createAccount` API before the scenario runs (`Given I create a new account by API`), then delete it via the UI at the end of the same scenario. This makes the test fully self-contained and idempotent — no pre-existing credentials needed, and no leftover accounts after a run.

**Login tests (TC3 — invalid credentials)** use hardcoded invalid values, so no account lifecycle is involved.

**Fallback:** `existingUser` (from environment variables) is defined as a fallback in `When I login with valid credentials` for any scenario that uses that step without the API setup step. The delete guard in `When I delete my account` checks whether the account was test-created before proceeding, preventing accidental deletion of the long-lived `existingUser` account.

In a production-grade framework, a **test data service** would:
- Create accounts via API before the test suite runs
- Clean up after the suite (teardown hooks)
- Prevent state leakage between tests

### Environments
```
local       → developer's machine, against production or a local mock
staging     → shared pre-prod environment, runs on merge to develop
production  → smoke tests only, post-deploy, non-destructive
```

`BASE_URL` would be an environment variable set per pipeline. Currently baked into `BasePage.ts` for simplicity — this would be externalised in a production framework.

### Flaky Test Management

**Root causes of flakiness and mitigations:**

| Cause | Mitigation |
|---|---|
| Timing issues | Playwright's auto-waiting; avoid `page.waitForTimeout()` |
| Shared test data | Isolated data per test run (timestamp-based generation) |
| Test order dependency | Each test creates its own state; no shared mutable state |
| Network latency | `waitUntil: 'domcontentloaded'` instead of `networkidle` where possible |
| Third-party ads / overlays | `Before` hook: network-blocks the consent CDN and injects a CSS rule that hides `.fc-consent-root` before any page script runs |
| Environment instability | Retries in CI (`retries: 2`); retries should not mask real failures |

**Flaky test policy:**
1. Flaky tests are tagged `@flaky` and excluded from the main pipeline: `--grep-invert @flaky`
2. They run nightly in a dedicated pipeline so the team is not blocked during the day
3. A flaky test has 5 business days to be stabilised before it is deleted — a failing test disguised as a flaky test is worse than no test

---

## 8. Trade-offs, Assumptions, and Future Improvements

### Assumptions
- automationexercise.com is a stable third-party site suitable for demonstration purposes; in a real engagement, the AUT would be an internal application
- The existing test account (`TEST_USER_EMAIL`) is long-lived; in production, accounts would be created and torn down per test run
- A single monorepo for all teams is assumed; a multi-repo setup would require a shared npm package for `support/` and `pages/core-team/`

### Known Trade-offs

| Decision | Trade-off |
|---|---|
| Single playwright.config.ts | Simple to start; may need splitting as projects scale to hundreds of tests |
| BDD for all tests | Gherkin overhead isn't worth it for highly technical API tests; a plain Playwright test file may be more readable |
| Typed Playwright fixtures for shared state (`scenarioUser`, `apiResponse`, etc.) | Replaces the earlier `(page as any)` pattern; safe for parallel scenarios and fully type-checked. A dedicated World object would also work but adds a dependency — Playwright fixtures are sufficient here |
| No test data teardown | Leaves registered accounts in the system; acceptable for demo, unacceptable in production |

### Future Improvements (with more time)
1. **API-first teardown** — account *creation* via API is already implemented for TC2 (`Given I create a new account by API`); account *deletion* still goes through the UI. A `DELETE /api/deleteAccount` call in an `After` hook would remove the UI dependency entirely and make cleanup more reliable
2. **Visual regression testing** — Playwright screenshots compared against a baseline using `@playwright/test` or Percy
3. **Allure reporting** — richer reports with step-level screenshots, history trends, and team dashboards
4. **Database seeding** — for environments where direct DB access is available, seed test data before the suite and truncate after
5. **Playwright component testing** — if the frontend is React/Vue, add component tests for isolated UI logic
6. **Test result tracking** — integrate with TestRail or Xray to link automated results back to manual test cases and coverage metrics
7. **Cross-team step library** — a catalogue of reusable Given/When/Then steps for common operations (login, navigate to page) so teams don't re-implement the same steps
