# Codebase Concerns

**Analysis Date:** 2026-02-24

## Tech Debt

**Installer/distribution mismatch:**
- Issue: Runtime assets and agent definitions are required by commands but are not versioned in git, while the installer hard-fails if assets are missing.
- Files: `bin/install.js`, `.gitignore`, `package.json`, `.opencode/get-shit-done/INSTALLED_FILES.json`, `.opencode/commands/jarvis/plan-phase.md`
- Impact: Fresh clones and published package contents can diverge from local dev state; installs can fail or install incomplete command packs.
- Fix approach: Version `.opencode/get-shit-done/` and `.opencode/agents/` (or move to a generated release artifact), then enforce a prepublish validation that checks required paths before `npm publish`.

**Command surface fragmentation:**
- Issue: Command inventory is split across tracked, untracked, and deleted files; user-facing docs and install payload are out of sync.
- Files: `README.md`, `.opencode/commands/jarvis/help.md`, `.opencode/commands/jarvis/close-phase.md`, `.opencode/commands/jarvis/`
- Impact: Users cannot reliably discover or run the intended command set after installation.
- Fix approach: Define a single canonical manifest for command registration, generate help/docs from that manifest, and fail CI when referenced commands do not exist.

**Shell-heavy parsing in command logic:**
- Issue: Multiple commands parse structured data with `grep`/`cut`/`ls` pipelines instead of robust parsers.
- Files: `.opencode/commands/jarvis/check-todos.md`, `.opencode/commands/jarvis/remove-phase.md`, `.opencode/commands/jarvis/new-project.md`
- Impact: Small formatting changes in markdown/json can break workflows silently.
- Fix approach: Standardize machine-readable files (JSON/YAML) and use deterministic parsing patterns in command instructions.

## Known Bugs

**Install fails when bundled assets are absent:**
- Symptoms: Installer exits with `Error: Source assets not found`.
- Files: `bin/install.js`, `.opencode/get-shit-done/`
- Trigger: Running `npx jarvis-cc ...` from a package/checkout without `.opencode/get-shit-done/` present.
- Workaround: Ensure `.opencode/get-shit-done/` exists locally before install; avoid publishing from a workspace missing this folder.

**Documented command does not match available command file:**
- Symptoms: Users are told to run `/jarvis-close-phase`, but command file is not present in current workspace state.
- Files: `README.md`, `.opencode/commands/jarvis/close-phase.md`
- Trigger: Following command list in `README.md` after command removal/rename.
- Workaround: Use currently present phase commands in `.opencode/commands/jarvis/` and update docs in lockstep.

**Update messaging references wrong command namespace:**
- Symptoms: Update warning references `commands/gsd/` while installer writes `commands/jarvis/`.
- Files: `.opencode/commands/jarvis/update.md`, `bin/install.js`
- Trigger: Running `/jarvis-update` and reading the clean-install warning.
- Workaround: Trust actual installer paths from `bin/install.js`; treat `update.md` warning text as stale.

## Security Considerations

**Destructive delete path in workflow instructions:**
- Risk: `rm -rf` is used for phase deletion and depends on interpolated phase path correctness.
- Files: `.opencode/commands/jarvis/remove-phase.md`
- Current mitigation: Command includes future-phase validation and confirmation step.
- Recommendations: Require strict path validation (`.planning/phases/` prefix + exact match), and prefer move-to-trash/archive before permanent deletion.

**Host path disclosure in shipped metadata:**
- Risk: Absolute local filesystem paths are stored in metadata file, exposing maintainer machine paths if distributed.
- Files: `.opencode/get-shit-done/INSTALLED_FILES.json`
- Current mitigation: None detected.
- Recommendations: Store only repository-relative paths in distributable metadata.

## Performance Bottlenecks

**Very large command specs increase model/context cost:**
- Problem: Core command specs are long monoliths and include embedded multi-stage workflows.
- Files: `.opencode/commands/jarvis/new-project.md`, `.opencode/commands/jarvis/progress.md`, `.opencode/commands/jarvis/remove-phase.md`
- Cause: Single-file orchestration for many responsibilities.
- Improvement path: Split commands into smaller referenced workflow modules and keep command entry files thin.

**Recursive full-copy installer scales poorly with asset growth:**
- Problem: Installer copies all command and asset files every run with no diffing.
- Files: `bin/install.js`
- Cause: `copyDirectory` always traverses and overwrites every file.
- Improvement path: Add checksum/mtime-based skip logic or atomic sync strategy.

## Fragile Areas

**Phase renumbering/removal workflow:**
- Files: `.opencode/commands/jarvis/remove-phase.md`, `.opencode/commands/jarvis/plan-phase.md`, `.opencode/commands/jarvis/progress.md`
- Why fragile: Multiple dependent updates (directories, filenames, roadmap references, dependencies) are coordinated through manual instruction steps.
- Safe modification: Change numbering rules in one place, add a dry-run mode, and validate all references before write operations.
- Test coverage: No automated tests detected for phase mutation scenarios.

**Project initialization workflow:**
- Files: `.opencode/commands/jarvis/new-project.md`
- Why fragile: Command performs git init, multiple commits, dynamic agent spawning, and conditional research branches in one flow.
- Safe modification: Isolate setup, research, requirements, and roadmap into separate commands/workflows with explicit handoff files.
- Test coverage: No automated tests detected for init edge cases (nested repos, no git, partial failures).

## Scaling Limits

**Operational scale of command maintenance:**
- Current capacity: Command behavior is maintained via large markdown specs edited manually across many files in `.opencode/commands/jarvis/`.
- Limit: Consistency degrades as command count and cross-references grow.
- Scaling path: Introduce schema-backed command metadata and generated docs/help to keep references synchronized.

## Dependencies at Risk

**Remote changelog dependency:**
- Risk: Update and release messaging depends on external GitHub raw URL availability and repository continuity.
- Impact: `/jarvis-whats-new` and `/jarvis-update` degrade or show stale info when remote is unavailable.
- Migration plan: Add local packaged changelog as primary source and use remote fetch only as optional enhancement.

## Missing Critical Features

**No automated validation pipeline for command pack integrity:**
- Problem: There is no CI job asserting command existence, installer payload completeness, or prompt linting.
- Blocks: Safe releases of `jarvis-cc` and predictable installs in new environments.

## Test Coverage Gaps

**Installer and command-pack regression tests:**
- What's not tested: Install/uninstall flows, required path checks, and command availability after install.
- Files: `bin/install.js`, `package.json`, `.opencode/commands/jarvis/`
- Risk: Packaging regressions reach users undetected.
- Priority: High

**Workflow correctness tests for planning mutations:**
- What's not tested: Remove/renumber phases, todo transitions, and roadmap/state consistency after mutations.
- Files: `.opencode/commands/jarvis/remove-phase.md`, `.opencode/commands/jarvis/check-todos.md`, `.opencode/commands/jarvis/progress.md`
- Risk: Data loss or inconsistent planning state during normal usage.
- Priority: High

**Repository-level quality gates:**
- What's not tested: Lint/type/test checks in CI for core package and docs command content.
- Files: `.github/workflows/deploy-docs.yml`, `package.json`
- Risk: Broken command docs and install logic merge without automated feedback.
- Priority: Medium

---

*Concerns audit: 2026-02-24*
