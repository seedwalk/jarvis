# Testing Patterns

**Analysis Date:** 2026-02-24

## Test Framework

**Runner:**
- Vitest `^3.0.0` is declared in `.opencode/get-shit-done/package.json` as a dev dependency.
- Config: Not detected (`vitest.config.*` and `jest.config.*` are absent in `/home/fede/jarvis` and `/home/fede/jarvis/.opencode/get-shit-done`).

**Assertion Library:**
- Not explicitly configured in committed runnable test files.
- For future tests in `.opencode/get-shit-done`, use Vitest built-in `expect` to align with declared `vitest` dependency in `.opencode/get-shit-done/package.json`.

**Run Commands:**
```bash
cd .opencode/get-shit-done && npm run test        # Run all tests (configured script)
cd .opencode/get-shit-done && npm run test:watch  # Watch mode (configured script)
Not detected                                       # Coverage command not configured
```

## Test File Organization

**Location:**
- No committed runnable `*.test.*` or `*.spec.*` files detected under `/home/fede/jarvis`, including `.opencode/get-shit-done`.
- Testing guidance exists as process documentation in `.opencode/get-shit-done/references/tdd.md` and execution rules in `.opencode/agents/gsd-executor.md`.

**Naming:**
- No enforced in-repo test filename pattern is currently observable from actual test files.
- Prescriptive guidance in `.opencode/get-shit-done/references/tdd.md` suggests standard suffixes like `*.test.ts` or `*.spec.ts`.

**Structure:**
```
/home/fede/jarvis/
  .opencode/
    get-shit-done/
      package.json                # test and test:watch scripts
      references/tdd.md           # testing methodology and examples
      workflows/execute-plan.md   # plan-level test expectations
```

## Test Structure

**Suite Organization:**
```typescript
// No executable test suite is committed.
// Use the documented Vitest-style pattern from `.opencode/get-shit-done/templates/codebase/testing.md`:
describe("ModuleName", () => {
  describe("functionName", () => {
    it("should handle success case", () => {
      // arrange
      // act
      // assert
    });
  });
});
```

**Patterns:**
- Setup pattern in production workflow is process-driven: prepare state/config first (`.opencode/get-shit-done/workflows/execute-phase.md`, `.opencode/agents/gsd-executor.md`).
- Teardown pattern for runtime commands is manual/explicit cleanup rather than framework hooks (example uninstall behavior in `bin/install.js`).
- Assertion pattern for future tests should follow behavior-first checks documented in `.opencode/get-shit-done/references/tdd.md` (`expect(fn(input)).toBe(output)`).

## Mocking

**Framework:** Not detected in committed test files.

**Patterns:**
```typescript
// No repository-owned test mocks are committed.
// If adding tests under `.opencode/get-shit-done`, align with Vitest mocks
// described in `.opencode/get-shit-done/templates/codebase/testing.md`.
vi.mock("./external-service", () => ({
  fetchData: vi.fn()
}));
```

**What to Mock:**
- External boundaries only (filesystem, network, child processes) when testing CLI flows like `bin/install.js`.
- Third-party/system interactions referenced in workflow docs, keeping plan logic deterministic (`.opencode/get-shit-done/workflows/execute-plan.md`).

**What NOT to Mock:**
- Pure decision logic and plan-parsing behavior documented in `.opencode/get-shit-done/references/tdd.md`.
- Static markdown templates and content files where assertions can be exact string/structure checks.

## Fixtures and Factories

**Test Data:**
```typescript
// Not detected in committed tests.
// Recommended pattern for future tests based on repository shape:
function createPlanFixture(overrides = {}) {
  return {
    phase: "01",
    plan: "01",
    type: "auto",
    ...overrides
  };
}
```

**Location:**
- No dedicated `tests/fixtures` or `tests/factories` directory is detected.
- If added, place under `.opencode/get-shit-done/tests/fixtures/` to align with package-local scripts in `.opencode/get-shit-done/package.json`.

## Coverage

**Requirements:** None enforced in committed configuration.

**View Coverage:**
```bash
Not detected
```

## Test Types

**Unit Tests:**
- Not detected as committed runnable files.
- Quality intent is documented and should be followed when adding unit tests for parser/command logic (`.opencode/get-shit-done/references/tdd.md`, `.opencode/get-shit-done/workflows/execute-plan.md`).

**Integration Tests:**
- Not detected as committed runnable files.
- Existing verification relies on execution workflows and human checkpoints instead of automated integration suites (`.opencode/get-shit-done/references/checkpoints.md`, `.opencode/get-shit-done/workflows/verify-work.md`).

**E2E Tests:**
- Not used as automated framework tests in this repository.

## Common Patterns

**Async Testing:**
```typescript
// No committed async test files detected.
// Documented target pattern in `.opencode/get-shit-done/templates/codebase/testing.md`:
it("should handle async operation", async () => {
  const result = await asyncFunction();
  expect(result).toBe("expected");
});
```

**Error Testing:**
```typescript
// No committed error test files detected.
// Documented target pattern in `.opencode/get-shit-done/templates/codebase/testing.md`:
it("should throw on invalid input", () => {
  expect(() => functionCall()).toThrow("error message");
});
```

---

*Testing analysis: 2026-02-24*
