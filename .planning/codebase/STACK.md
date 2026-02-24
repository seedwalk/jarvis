# Technology Stack

**Analysis Date:** 2026-02-24

## Languages

**Primary:**
- JavaScript (Node.js) - CLI installer and command-pack runtime in `bin/install.js`, `.opencode/commands/jarvis/*.md`, `.opencode/get-shit-done/package.json`.

**Secondary:**
- Markdown - Command definitions, workflow templates, and product/runtime docs in `.opencode/commands/jarvis/*.md`, `.opencode/get-shit-done/workflows/*.md`, `README.md`, `.specs/*.md`.
- JSON - Package metadata, lockfiles, and local runtime config in `package.json`, `docs-site/package-lock.json`, `.opencode/bun.lock`, `.jarvis/config.json`.
- YAML - CI/CD workflow definition in `.github/workflows/deploy-docs.yml`.
- CSS - Docs site theming in `docs-site/src/css/custom.css`.

## Runtime

**Environment:**
- Node.js >=18 required by the CLI/distribution packages via `package.json` and `.opencode/get-shit-done/package.json` (`engines.node`).
- Node.js 20 is used in CI for docs build/deploy via `.github/workflows/deploy-docs.yml`.

**Package Manager:**
- npm (primary) for publish/install/update flows in `README.md`, `package.json`, `docs-site/package.json`, `.opencode/commands/jarvis/update.md`.
- Bun lockfile is present for `.opencode` plugin dependency pinning in `.opencode/bun.lock`.
- Lockfile: present (`docs-site/package-lock.json`, `.opencode/bun.lock`).

## Frameworks

**Core:**
- Docusaurus 3 (`@docusaurus/core`, `@docusaurus/preset-classic`) for project documentation site in `docs-site/package.json` and `docs-site/docusaurus.config.js`.
- React 19 (`react`, `react-dom`) for docs frontend pages/components in `docs-site/package.json`, `docs-site/src/pages/index.js`.

**Testing:**
- Vitest is declared for bundled GSD package tests in `.opencode/get-shit-done/package.json` (`scripts.test`, `devDependencies.vitest`).

**Build/Dev:**
- Docusaurus CLI scripts (`docusaurus start/build/serve/clear`) in `docs-site/package.json`.
- GitHub Actions Pages pipeline (`actions/setup-node`, `actions/configure-pages`, `actions/deploy-pages`) in `.github/workflows/deploy-docs.yml`.

## Key Dependencies

**Critical:**
- `@docusaurus/core` and `@docusaurus/preset-classic` - power docs generation and static build in `docs-site/package.json`.
- `@opencode-ai/plugin` - OpenCode plugin dependency pinned in `.opencode/package.json` and `.opencode/bun.lock`.
- `@iarna/toml`, `@inquirer/prompts`, `commander`, `chalk`, `ora` - runtime tooling for the included GSD distribution metadata in `.opencode/get-shit-done/package.json`.

**Infrastructure:**
- GitHub Actions official actions (`actions/checkout`, `actions/setup-node`, `actions/configure-pages`, `actions/upload-pages-artifact`, `actions/deploy-pages`) for CI/CD in `.github/workflows/deploy-docs.yml`.
- Node built-ins (`fs`, `os`, `path`) for installer filesystem operations in `bin/install.js`.

## Configuration

**Environment:**
- Runtime config is local JSON at `.jarvis/config.json` (shape documented in `.jarvis/config.example.json`), including `linear.mode`, `linear.team`, optional `linear.project`, `git.base_branch`, and `ship.single_commit_required`.
- Linear API fallback expects env vars `LINEAR_API_KEY`, `LINEAR_TEAM_ID`, and optional `LINEAR_PROJECT_ID` per `README.md`, `.opencode/commands/jarvis/setup.md`, and `.opencode/commands/jarvis/new-milestone.md`.
- Docs site derives repository metadata from `GITHUB_REPOSITORY` in `docs-site/docusaurus.config.js`.

**Build:**
- Docs build config: `docs-site/docusaurus.config.js`, `docs-site/sidebars.js`, `docs-site/src/css/custom.css`.
- Deploy pipeline: `.github/workflows/deploy-docs.yml`.
- Package/distribution config: `package.json`, `docs-site/package.json`, `.opencode/get-shit-done/package.json`, `.opencode/package.json`.

## Platform Requirements

**Development:**
- Node.js 18+ and npm for CLI install/use and docs workflows (`package.json`, `docs-site/package.json`, `.opencode/get-shit-done/package.json`).
- OpenCode environment expected for slash-command execution paths in `.opencode/commands/jarvis/*.md` and installer targets in `bin/install.js`.

**Production:**
- npm registry distribution for `jarvis-cc` package publish/install flows in `README.md`.
- Static docs deployment target is GitHub Pages via `.github/workflows/deploy-docs.yml` and `docs-site/docusaurus.config.js`.

---

*Stack analysis: 2026-02-24*
