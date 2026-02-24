# Architecture

**Analysis Date:** 2026-02-24

## Pattern Overview

**Overall:** Prompt-as-code orchestration architecture with declarative command specs and file-based project state.

**Key Characteristics:**
- Command behavior is defined in Markdown contracts with frontmatter and structured workflow sections in `.opencode/commands/jarvis/*.md` and `.opencode/commands/gsd/*.md`.
- Complex work is delegated to specialized agents defined in `.opencode/agents/*.md`, while orchestrator commands reference shared workflows in `.opencode/get-shit-done/workflows/*.md`.
- Execution state is persisted to repository files (`.planning/*`, `.jarvis/*`, `.specs/*`) instead of in-memory session objects.

## Layers

**Distribution Layer:**
- Purpose: Install and remove command packs and shared workflow assets.
- Location: `bin/install.js`.
- Contains: Node.js installer logic for local/global install targets and recursive asset copy.
- Depends on: Node core modules (`fs`, `os`, `path`) and packaged assets at `.opencode/commands/jarvis/` and `.opencode/get-shit-done/`.
- Used by: `jarvis-cc` CLI entrypoint defined in `package.json`.

**Command Definition Layer:**
- Purpose: Define top-level slash command intent, process steps, required tools, and routing.
- Location: `.opencode/commands/jarvis/*.md` and `.opencode/commands/gsd/*.md`.
- Contains: Frontmatter metadata (`name`, `description`, `tools`) plus structured sections like `<objective>`, `<process>`, `<offer_next>`.
- Depends on: Shared workflow docs and templates under `.opencode/get-shit-done/`.
- Used by: OpenCode command runtime when a slash command is invoked.

**Workflow Specification Layer:**
- Purpose: Provide reusable, detailed orchestration logic for planning/execution/verification flows.
- Location: `.opencode/get-shit-done/workflows/*.md`.
- Contains: Step-by-step orchestration protocols, model-routing rules, and expected subagent call patterns.
- Depends on: Templates in `.opencode/get-shit-done/templates/*.md` and references in `.opencode/get-shit-done/references/*.md`.
- Used by: Commands that include `<execution_context>` pointers (for example `./.opencode/get-shit-done/workflows/execute-phase.md` from `.opencode/commands/jarvis/execute-phase.md`).

**Agent Contract Layer:**
- Purpose: Define role-specialized execution behavior for spawned subagents.
- Location: `.opencode/agents/*.md` (for example `gsd-planner`, `gsd-executor`, `gsd-verifier`, `gsd-codebase-mapper`).
- Contains: Role definitions, strict execution flow, output formats, and quality/safety rules.
- Depends on: Workflow/template files and the `.planning/` artifacts referenced by the orchestrators.
- Used by: Task-spawning orchestrator commands such as `.opencode/commands/jarvis/plan-phase.md` and `.opencode/commands/jarvis/execute-phase.md`.

**Project State and Memory Layer:**
- Purpose: Persist planning state, milestone runtime state, and product context across sessions.
- Location: `.planning/`, `.jarvis/`, and `.specs/`.
- Contains: Planning artifacts (`PROJECT.md`, `ROADMAP.md`, `STATE.md`), runtime config (`.jarvis/config.json`), milestones (`.jarvis/milestones/*/MILESTONE.md`), and product/spec memory (`.specs/*.md`).
- Depends on: Command and agent writers updating files consistently.
- Used by: Nearly all orchestrator commands and subagents.

**Documentation Site Layer:**
- Purpose: Publish user documentation for the command pack.
- Location: `docs-site/`.
- Contains: Docusaurus config (`docs-site/docusaurus.config.js`), docs pages (`docs-site/docs/intro.md`), UI entry (`docs-site/src/pages/index.js`), and styles (`docs-site/src/css/custom.css`).
- Depends on: Docusaurus + React dependencies in `docs-site/package.json`.
- Used by: GitHub Actions deployment workflow at `.github/workflows/deploy-docs.yml`.

## Data Flow

**Install and Runtime Wiring Flow:**

1. `jarvis-cc` executes `bin/install.js` from `package.json` bin mapping.
2. Installer copies command specs from `.opencode/commands/jarvis/` and shared assets from `.opencode/get-shit-done/` into either `./.opencode/` (local) or `~/.config/opencode/` (global).
3. OpenCode reads installed command files and exposes slash commands like those defined in `.opencode/commands/jarvis/help.md` and `.opencode/commands/jarvis/new-project.md`.

**Phase Planning and Execution Flow:**

1. Orchestrator command (for example `.opencode/commands/jarvis/plan-phase.md`) parses arguments, loads `.planning/` context, and references workflow instructions.
2. Orchestrator spawns role-specific agents (`gsd-phase-researcher`, `gsd-planner`, `gsd-plan-checker`) with inlined context; agents write artifacts like `*-PLAN.md` into `.planning/phases/...`.
3. Execution command (`.opencode/commands/jarvis/execute-phase.md`) groups plans by wave, spawns `gsd-executor`, then uses `gsd-verifier` to produce `*-VERIFICATION.md` and update `.planning/STATE.md` and `.planning/ROADMAP.md`.

**Codebase Mapping Flow:**

1. `.opencode/commands/jarvis/map-codebase.md` routes to `./.opencode/get-shit-done/workflows/map-codebase.md`.
2. Workflow spawns four `gsd-codebase-mapper` agents with focus areas (tech/arch/quality/concerns).
3. Agents write codebase references directly into `.planning/codebase/*.md` and return only confirmation metadata.

**State Management:**
- State is file-centric and explicit: `.planning/STATE.md` holds ongoing execution state, `.planning/ROADMAP.md` holds phase progression, `.planning/config.json` holds workflow behavior flags, `.jarvis/config.json` holds integration/runtime settings.

## Key Abstractions

**Command-as-Contract Document:**
- Purpose: Treat each slash command file as both API contract and execution prompt.
- Examples: `.opencode/commands/jarvis/new-project.md`, `.opencode/commands/jarvis/execute-phase.md`, `.opencode/commands/gsd/map-codebase.md`.
- Pattern: YAML frontmatter + XML-like semantic sections (`<objective>`, `<process>`, `<success_criteria>`).

**Workflow Context Pointer:**
- Purpose: Decouple concise command entrypoints from detailed reusable workflows.
- Examples: `.opencode/commands/jarvis/map-codebase.md` → `./.opencode/get-shit-done/workflows/map-codebase.md`; `.opencode/commands/jarvis/execute-phase.md` → `./.opencode/get-shit-done/workflows/execute-phase.md`.
- Pattern: `<execution_context>` points to canonical workflow documents.

**Agent Role Specialization:**
- Purpose: Separate concerns across planner/executor/verifier/researcher/mapping actors.
- Examples: `.opencode/agents/gsd-planner.md`, `.opencode/agents/gsd-executor.md`, `.opencode/agents/gsd-verifier.md`, `.opencode/agents/gsd-codebase-mapper.md`.
- Pattern: Dedicated role prompts with strict input/output contracts and bounded responsibilities.

**File-Based Planning Artifact Model:**
- Purpose: Represent project lifecycle as durable markdown/json artifacts.
- Examples: `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, `.planning/phases/*/*-PLAN.md`, `.planning/phases/*/*-SUMMARY.md`.
- Pattern: Explicit artifact creation and updates at each command stage.

## Entry Points

**Installer CLI Entry Point:**
- Location: `bin/install.js`.
- Triggers: `npx jarvis-cc@latest --opencode --local|--global` via `package.json`.
- Responsibilities: Validate source asset directories, copy command/workflow assets, uninstall installed commands when requested.

**Slash Command Entry Points:**
- Location: `.opencode/commands/jarvis/*.md` and `.opencode/commands/gsd/*.md`.
- Triggers: User slash commands in OpenCode (for example `/jarvis-plan-phase`, `/jarvis-execute-phase`, `/gsd-map-codebase`).
- Responsibilities: Orchestrate per-command flow, invoke subagents/workflows, route user to next command.

**Documentation Web Entry Point:**
- Location: `docs-site/src/pages/index.js` with site config at `docs-site/docusaurus.config.js`.
- Triggers: Docusaurus server (`npm run start`) and GitHub Pages deployment (`.github/workflows/deploy-docs.yml`).
- Responsibilities: Render and publish docs content from `docs-site/docs/`.

## Error Handling

**Strategy:** Fail-fast validations at command/installer boundaries with explicit user-facing fallback paths.

**Patterns:**
- Installer hard-fails on invalid state using `fail()` + `process.exit(1)` in `bin/install.js` and prevents contradictory flags (`--local` with `--global`).
- Command workflows define explicit guard checks and fallback routing (for example `.opencode/commands/jarvis/new-project.md` checks for existing `.planning/PROJECT.md`; `.opencode/commands/jarvis/new-milestone.md` declares manual fallback payload when Linear integration is unavailable).

## Cross-Cutting Concerns

**Logging:** Console-first logging in installer (`console.log`, `console.error`) at `bin/install.js`; command/report output is structured markdown emitted by command and agent files.
**Validation:** Preconditions are encoded as workflow/command guard steps in files like `.opencode/commands/jarvis/new-project.md` and `.opencode/get-shit-done/workflows/execute-phase.md`.
**Authentication:** Integration auth is configuration-driven via `.jarvis/config.json` and environment variables referenced in command contracts (`LINEAR_API_KEY`, `LINEAR_TEAM_ID`, `LINEAR_PROJECT_ID` in `README.md` and command docs).

---

*Architecture analysis: 2026-02-24*
