# Jarvis Linear-First GSD for OpenCode

## What This Is

Jarvis is a GSD workflow for OpenCode where execution lives in Linear instead of local planning Markdown files. It maps milestone, phase, research, and task flows to Linear issues/sub-issues so a small team can run repeatable delivery from intake to ship. Local repo docs remain as support context and memory, while Linear is the operational source of truth.

## Core Value

A small team can reliably run the full Jarvis flow end-to-end with Linear free-tier constraints, with consistent issue state transitions and traceable execution.

## Requirements

### Validated

- ✓ Slash-command driven orchestration exists for Jarvis/GSD flows in `.opencode/commands/jarvis/` and shared workflows in `.opencode/get-shit-done/workflows/` — existing
- ✓ `jarvis-cc` installer supports local/global command-pack install and uninstall via `bin/install.js` — existing
- ✓ Docusaurus documentation site is present and deployable via GitHub Actions (`docs-site/`, `.github/workflows/deploy-docs.yml`) — existing
- ✓ File-based planning/state memory patterns exist (`.planning/`, `.jarvis/`, `.specs/`) and are already used by commands/agents — existing

### Active

- [ ] Replace planning/execution persistence from local Markdown artifacts to Linear issue objects as operational truth (milestone, phase, research, task mapping)
- [ ] Implement Linear integration using API + OAuth flow only for v1 (free-tier compatible), with deterministic and debuggable behavior
- [ ] Preserve current `/jarvis-*` command interface while evolving internals to Linear-first execution
- [ ] Deliver reliable repeatability of full flow: setup -> new milestone -> research milestone -> plan milestone -> execute phase -> verify phase -> close phase -> ship
- [ ] Keep Docusaurus docs continuously updated to reflect actual command behavior and Linear-first flow

### Out of Scope

- MCP-first integration in v1 — excluded because free-tier strategy requires API/OAuth-first implementation
- Paid-tier Linear capabilities — excluded to keep adoption and validation within free-tier constraints
- Command namespace migration to `/gsd-*` in this milestone — deferred to protect compatibility and avoid migration churn

## Context

The repository already contains a mature prompt-as-code orchestration system: command contracts in `.opencode/commands/jarvis/*.md`, reusable workflows in `.opencode/get-shit-done/workflows/*.md`, and role-specialized agents in `.opencode/agents/*.md`. Product intent is documented in `.specs/propuesta.md`, `.specs/README.md`, and `README.md`, all aligning on a Linear-first operating model where milestones/phases/tasks map directly to Linear entities. Existing MVP command set is present and needs evolution from file-centric state toward Linear-centric execution, while keeping local docs/specs as supporting memory. Documentation delivery through Docusaurus is already configured and must stay current as behavior changes.

## Constraints

- **Budget**: Free-tier only for Linear usage — v1 must avoid paid features and depend on free-tier-compatible API/OAuth patterns
- **Integration**: API/OAuth only in v1 — chosen for deterministic control and compatibility under free-tier constraints
- **Compatibility**: Keep existing `/jarvis-*` commands — preserves current usage and avoids adoption friction
- **Quality**: Reliable repeatability is the success bar — flow must work consistently across repeated runs, not only one happy path
- **Documentation**: Docusaurus docs must be maintained with each behavior change — prevents drift between implementation and user guidance

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Make Linear the operational source of truth | Team workflow should live where work is executed and tracked | — Pending |
| Implement v1 integration as API/OAuth only | Free-tier strategy and deterministic behavior are prioritized over MCP path | — Pending |
| Keep `/jarvis-*` command names in this milestone | Maintain user compatibility while refactoring internals | — Pending |
| Include docs maintenance in scope | Docusaurus is part of product usability and must reflect real flow | — Pending |

---
*Last updated: 2026-02-24 after initialization*
