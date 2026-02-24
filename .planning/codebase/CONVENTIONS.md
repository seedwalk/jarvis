# Coding Conventions

**Analysis Date:** 2026-02-24

## Naming Patterns

**Files:**
- Use kebab-case for command and workflow docs in `.opencode/commands/jarvis/*.md`, `.opencode/commands/gsd/*.md`, and `.opencode/get-shit-done/workflows/*.md` (example: `.opencode/commands/jarvis/execute-phase.md`).
- Use uppercase snake-case for planning artifact names in `.planning/codebase/*.md` and template names in `.opencode/get-shit-done/templates/codebase/*.md` (example: `.opencode/get-shit-done/templates/codebase/testing.md` emits `TESTING.md`).
- Use lowercase short JS filenames for runtime entry files in `bin/install.js`, `docs-site/src/pages/index.js`, and `docs-site/sidebars.js`.

**Functions:**
- Use camelCase for JavaScript function names in `bin/install.js` (examples: `printHelp`, `copyDirectory`, `fail`).
- Use PascalCase only for React component functions in `docs-site/src/pages/index.js` (example: `Home`).

**Variables:**
- Use camelCase for local constants and mutable bindings in runtime JavaScript files like `bin/install.js` and `docs-site/docusaurus.config.js`.
- Use UPPER_SNAKE_CASE for shell-style env and workflow vars inside markdown workflows in `.opencode/get-shit-done/workflows/execute-phase.md` and `.opencode/commands/gsd/execute-phase.md` (examples: `MODEL_PROFILE`, `COMMIT_PLANNING_DOCS`).

**Types:**
- Use JSDoc type annotations in JS config files rather than TypeScript declarations (examples in `docs-site/docusaurus.config.js` and `docs-site/sidebars.js`).
- TypeScript type/interface declarations are not detected in tracked source files; keep JS+JSDoc style unless a TS migration is introduced.

## Code Style

**Formatting:**
- Dedicated formatter config files are not detected (`.prettierrc*` and `prettier.config.*` not present at `/home/fede/jarvis`).
- Follow the de facto style visible in `bin/install.js`, `docs-site/src/pages/index.js`, and `docs-site/docusaurus.config.js`: semicolon-free Node/CommonJS files, double quotes, two-space indentation, trailing commas in multiline object literals when present.

**Linting:**
- Dedicated lint config files are not detected (`.eslintrc*`, `eslint.config.*`, and `biome.json` not present at `/home/fede/jarvis`).
- Use consistency-by-example from existing files, especially `bin/install.js` and `docs-site/docusaurus.config.js`, because no enforced rule set is committed.

## Import Organization

**Order:**
1. Runtime/platform imports first (`fs`, `os`, `path`) as seen in `bin/install.js`.
2. External package imports next (`react`, `@theme/Layout`, `@docusaurus/Link`) as seen in `docs-site/src/pages/index.js`.
3. Local module exports or assignments last (`module.exports = ...`) as seen in `docs-site/docusaurus.config.js` and `docs-site/sidebars.js`.

**Path Aliases:**
- Alias usage appears only where framework-provided aliases are expected in `docs-site/src/pages/index.js` (`@theme/Layout`, `@docusaurus/Link`).
- Custom repo-level alias config is not detected (no `tsconfig.json`, `jsconfig.json`, or bundler alias config in `/home/fede/jarvis`).

## Error Handling

**Patterns:**
- Fail-fast pattern for CLI argument and filesystem validation: validate early and exit non-zero through a single helper (`fail`) in `bin/install.js`.
- Guard clauses are preferred over nested conditionals (examples at `bin/install.js` checks for `showHelp`, mutually exclusive flags, and missing directories).
- Use non-throwing branch behavior for non-critical teardown operations (example: uninstall path missing logs informational message in `bin/install.js`).

## Logging

**Framework:** console

**Patterns:**
- Use `console.log` for user-facing operational status in CLI and setup flows (`bin/install.js`, `.opencode/commands/jarvis/setup.md`).
- Use `console.error` for fatal errors immediately before exit in `bin/install.js`.
- Workflow and command markdown files favor structured markdown headings/tables over ad-hoc log text for agent responses (examples in `.opencode/commands/gsd/execute-phase.md` and `.opencode/get-shit-done/workflows/execute-phase.md`).

## Comments

**When to Comment:**
- Keep runtime JavaScript minimally commented; only non-obvious logic gets inline comments (examples around copy/install flow in `bin/install.js`).
- Prefer structured semantic sections in markdown command/workflow files (`<objective>`, `<process>`, `<success_criteria>`) instead of inline prose comments, as in `.opencode/commands/jarvis/execute-phase.md` and `.opencode/agents/gsd-executor.md`.

**JSDoc/TSDoc:**
- Use single-line JSDoc type tags for config object typing when needed in JS files (examples in `docs-site/docusaurus.config.js` and `docs-site/sidebars.js`).
- TSDoc blocks for function APIs are not detected in tracked source.

## Function Design

**Size:** Prefer small focused helpers in runtime JS (`install`, `uninstall`, `copyDirectory`, `fail` in `bin/install.js`) and move large orchestration details into markdown workflow documents (`.opencode/get-shit-done/workflows/*.md`).

**Parameters:**
- Pass explicit directory/path arguments to filesystem helpers rather than closing over globals (`install(fromDir, toDir, assetsFromDir, assetsToDir)` and `copyDirectory(fromDir, toDir)` in `bin/install.js`).
- In command/workflow docs, pass explicit placeholders and context blocks (`$ARGUMENTS`, inlined plan/state content) rather than implicit shared state (`.opencode/commands/gsd/execute-phase.md`).

**Return Values:**
- Use side-effect oriented functions for CLI operations with process exit semantics (`printHelp`, `fail`, `uninstall` in `bin/install.js`).
- Use explicit markdown output contracts in workflow docs instead of return objects (`<completion_format>` in `.opencode/agents/gsd-executor.md`).

## Module Design

**Exports:**
- Node CLI module `bin/install.js` is executable script style with no exported API.
- Config modules use CommonJS export assignment (`module.exports`) in `docs-site/docusaurus.config.js` and `docs-site/sidebars.js`.
- Command and agent modules are markdown+frontmatter units with required metadata (`name`, `description`, `tools`) in `.opencode/commands/**/*.md` and `.opencode/agents/*.md`.

**Barrel Files:**
- Barrel files are not used and not needed in current structure; modules are referenced directly by full path (examples in `package.json` and `.opencode/get-shit-done/INSTALLED_FILES.json`).

---

*Convention analysis: 2026-02-24*
