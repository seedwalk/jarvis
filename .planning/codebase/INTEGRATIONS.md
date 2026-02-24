# External Integrations

**Analysis Date:** 2026-02-24

## APIs & External Services

**Work Tracking:**
- Linear - milestone/phase issue creation and sync target for Jarvis command flows.
  - SDK/Client: MCP integration mode and API fallback are specified in `.opencode/commands/jarvis/setup.md`, `.opencode/commands/jarvis/new-milestone.md`, and `README.md` (no committed JS/TS SDK client implementation in this repository).
  - Auth: `LINEAR_API_KEY` (API fallback), with team/project selectors from `LINEAR_TEAM_ID` and optional `LINEAR_PROJECT_ID` documented in `README.md` and `.specs/product-spec.md`.

**Source Control & Release Metadata:**
- GitHub - repository links, docs hosting, and changelog retrieval.
  - SDK/Client: raw HTTP fetch usage is defined in `.opencode/commands/jarvis/whats-new.md` via `https://raw.githubusercontent.com/rokicool/jarvis-opencode/main/CHANGELOG.md`.
  - Auth: Not required for public changelog fetch path in `.opencode/commands/jarvis/whats-new.md`; repository context for docs uses `GITHUB_REPOSITORY` in `docs-site/docusaurus.config.js`.

**Package Distribution:**
- npm registry - install/update/publish channel for `jarvis-cc`.
  - SDK/Client: npm CLI commands (`npm view`, `npm publish`, `npx jarvis-cc@latest`) in `README.md` and `.opencode/commands/jarvis/update.md`.
  - Auth: npm account token/login required for publish (`npm login`) in `README.md`.

## Data Storage

**Databases:**
- Not detected.
  - Connection: Not applicable.
  - Client: Not applicable.

**File Storage:**
- Local filesystem only for runtime/project state in `.jarvis/` and command distribution content in `.opencode/`.

**Caching:**
- Local file cache only: `~/.config/opencode/cache/jarvis-update-check.json` is referenced for update state reset in `.opencode/commands/jarvis/update.md`.

## Authentication & Identity

**Auth Provider:**
- Linear API key auth for fallback mode.
  - Implementation: env-var based (`LINEAR_API_KEY`) with mode selection in `.jarvis/config.json` and setup flow in `.opencode/commands/jarvis/setup.md`.

## Monitoring & Observability

**Error Tracking:**
- None detected.

**Logs:**
- CLI stdout/stderr logging and user-facing status messages in `bin/install.js` and command markdown workflows (for example `.opencode/commands/jarvis/update.md`).

## CI/CD & Deployment

**Hosting:**
- GitHub Pages for documentation site (`docs-site/build`) configured by `.github/workflows/deploy-docs.yml` and `docs-site/docusaurus.config.js`.

**CI Pipeline:**
- GitHub Actions workflow `Deploy Docs` in `.github/workflows/deploy-docs.yml`.

## Environment Configuration

**Required env vars:**
- `LINEAR_API_KEY` for Linear API fallback in `.opencode/commands/jarvis/setup.md` and `.opencode/commands/jarvis/new-milestone.md`.
- `LINEAR_TEAM_ID` and optional `LINEAR_PROJECT_ID` are documented fallback variables in `README.md` and `.specs/propuesta.md`.
- `GITHUB_REPOSITORY` controls docs site organization/project resolution in `docs-site/docusaurus.config.js`.

**Secrets location:**
- Environment variables (recommended by `.jarvis/README.md`).
- Local runtime file `.jarvis/config.json` is gitignored in `.gitignore` and used for non-secret integration mode/team/project defaults.

## Webhooks & Callbacks

**Incoming:**
- None detected in repository code/config (`.github/workflows/deploy-docs.yml`, `.opencode/commands/jarvis/*.md`, `bin/install.js`).

**Outgoing:**
- HTTP fetch to GitHub raw content endpoint for changelog lookup in `.opencode/commands/jarvis/whats-new.md`.
- npm registry queries/installs (`npm view`, `npx`) in `.opencode/commands/jarvis/update.md` and `README.md`.

---

*Integration audit: 2026-02-24*
