# Project Research Summary

**Project:** Jarvis Linear-First GSD for OpenCode
**Domain:** Linear-first, command-driven workflow automation
**Researched:** 2026-02-24
**Confidence:** HIGH

## Executive Summary

This is a workflow-automation product that preserves the existing `/jarvis-*` command UX while moving execution truth from local markdown state to Linear. The strongest pattern across all research files is to treat Linear as the canonical operational store and keep local docs as derived artifacts. Experts build this class of system with a strict lifecycle state machine, deterministic IDs for idempotent retries, and a webhook-first convergence loop rather than polling-heavy sync.

The recommended implementation is a Node 24 + TypeScript CLI core using `@linear/sdk`, OAuth PKCE token lifecycle management, and a thin SQLite correlation/idempotency ledger. Architecturally, a hexagonal core (`Workflow Engine`) should isolate domain transitions from adapters (command input, Linear read/write, auth, webhook ingestion, reconciliation). This keeps command compatibility stable while enabling incremental migration command-by-command.

The main delivery risks are not product ideas; they are reliability failures: accepting GraphQL HTTP 200 as success without checking `errors[]`, missing refresh-token handling, weak webhook verification/ack strategy, and duplicate creation from non-idempotent retries. Mitigation is clear and should be non-negotiable in phase planning: central GraphQL response validation, day-one token rotation/revoke support, signed webhooks with fast-ack queueing, and deterministic correlation keys on all write paths.

## Key Findings

### Recommended Stack

Research points to a pragmatic free-tier-safe stack focused on deterministic command execution over infrastructure complexity. Node 24 LTS + TypeScript is the safest baseline for long-lived CLI automation and SDK parity, while SQLite gives durable local correlation/replay state without managed infra.

**Core technologies:**
- `Node.js 24.x` + `TypeScript 5.9.3`: Stable execution base for all `/jarvis-*` operations with strong typing for orchestration refactors.
- `@linear/sdk 75.0.0` + `oauth4webapi 3.8.5`: Official typed Linear access and standards-compliant OAuth PKCE/refresh/revoke lifecycle.
- `better-sqlite3 12.6.2` + `drizzle-orm 0.45.1`: Durable correlation/idempotency/checkpoint ledger with typed migrations.
- `p-queue 9.1.0` + `p-retry 7.1.1`: Central rate-limit-aware concurrency and backoff handling for Linear API quotas.
- `zod 4.1.12` + `pino 10.3.1`: Runtime validation and structured observability for auditable command runs.

**Critical version requirements:**
- Node 24 Active LTS is preferred; Node 18 is EOL and should be avoided.
- Keep SDK/OAuth dependencies current to match Linear OAuth and GraphQL behavior.

### Expected Features

The feature set is coherent: v1 must prove deterministic Linear-first lifecycle execution with secure auth, webhook-driven updates, and safe retries. Differentiation comes from preserving command UX while enforcing lifecycle rigor and generating docs as execution output.

**Must have (table stakes):**
- Deterministic lifecycle orchestration for setup -> new -> research -> plan -> execute -> verify -> close -> ship.
- OAuth + least-privilege auth, refresh/revoke lifecycle, and webhook ingestion with verification.
- Hierarchy mapping (project/milestone/parent/sub-issue) with canonical Jarvis-to-Linear IDs.
- Idempotent retries/replays with correlation IDs and audit-grade mutation traces.
- PR/commit-aware status convergence to prevent tracker/implementation drift.

**Should have (competitive):**
- Preserve `/jarvis-*` command surface while migrating internals to Linear-native state.
- Full lifecycle contract enforcement (invalid transitions fail fast).
- Docs-as-output automation to keep Docusaurus behavior docs aligned with real execution.
- Drift detection and guided remediation between intended and actual Linear graph.

**Defer (v2+):**
- Custom lifecycle DSL and broad bidirectional sync packs.
- Advanced autonomous AI triage/routing.

### Architecture Approach

The recommended architecture is a hexagonal workflow core with explicit boundaries: command adapters feed domain commands into a Workflow Engine, which enforces transitions and idempotency before touching Linear through read/write adapters. Webhook ingestion plus reconciliation provides eventual convergence and repair. Local files are support outputs only, never co-equal runtime truth.

**Major components:**
1. `Workflow Engine` — lifecycle state machine, transition rules, and orchestration policy.
2. `Linear adapters (read/write)` — filtered/paginated queries, mutation execution, retry and rate-limit handling.
3. `Auth & Token Manager` — OAuth exchange/refresh/revoke and actor policy (`user` vs `app`).
4. `Transition Guard + Correlation Store` — deterministic keys, dedupe, replay safety, and cursor tracking.
5. `Webhook Ingestor + Reconciliation Worker` — signature/timestamp validation, async processing, drift repair.
6. `Observability layer` — run IDs, mutation traces, complexity/rate telemetry, and diagnostics.

### Critical Pitfalls

1. **GraphQL false positives on HTTP 200** — always inspect `errors[]`, fail fast, and log `extensions.code` per operation.
2. **Rate-limit collapse from polling/broad queries** — webhook-first updates, strict pagination/filtering, bounded concurrency, and adaptive backoff.
3. **OAuth refresh-token gaps** — implement rotate/refresh/revoke from day one with proactive refresh and migration handling.
4. **Webhook security/reliability shortcuts** — validate HMAC + timestamp, ack within 5s, queue async work, dedupe by delivery ID.
5. **Non-idempotent create paths** — enforce deterministic correlation keys and find-before-create/upsert semantics everywhere.

## Implications for Roadmap

Based on the combined research, use a 5-phase plan that prioritizes correctness before breadth.

### Phase 1: Domain Contract and Linear Foundation
**Rationale:** Every later feature depends on stable lifecycle semantics and safe API contracts.
**Delivers:** Lifecycle transition matrix, deterministic identity scheme, Linear read/write adapters with GraphQL error taxonomy, pagination/filtering, and rate-limit-aware client behavior.
**Addresses:** Core lifecycle orchestration, hierarchy mapping prerequisites, audit trace foundations.
**Avoids:** HTTP-200 false success, pagination blind spots, unbounded query complexity.

### Phase 2: Auth, Idempotency, and Reliability Core
**Rationale:** Mutations are unsafe until token lifecycle and duplicate protection are solved.
**Delivers:** OAuth PKCE flow (refresh/revoke/rotation), actor policy enforcement, correlation store schema, idempotent upsert semantics across mutating commands.
**Addresses:** OAuth safety, least privilege, deterministic retries/replays.
**Avoids:** refresh-token outages, actor confusion, duplicate issue creation.

### Phase 3: Command Migration and Lifecycle Execution (MVP)
**Rationale:** With foundation + reliability in place, migrate user-facing flows incrementally without UX churn.
**Delivers:** `/jarvis-setup`, `/jarvis-new-milestone`, research/plan, and phase execution/verify/close mapped to Linear entities; PR/commit-linked status handling.
**Addresses:** Table-stakes command compatibility and end-to-end v1 lifecycle execution.
**Avoids:** state-model drift and invalid transition jumps via guardrails.

### Phase 4: Webhook Convergence and Drift Repair
**Rationale:** Production consistency requires event-driven reconciliation beyond synchronous command writes.
**Delivers:** Public webhook ingestion with HMAC/timestamp checks, async queue worker, drift detection and compensating updates, dead-letter visibility.
**Addresses:** Event-driven updates, sync fidelity, replay confidence.
**Avoids:** polling-heavy fragility, webhook replay/disablement incidents.

### Phase 5: Docs Automation and Legacy State Decommission
**Rationale:** Only deprecate markdown-state inputs after workflow correctness is proven in shadow mode.
**Delivers:** Docs-as-output pipeline, CI docs checks, generated behavior tables, formal removal of markdown as decision input.
**Addresses:** Docusaurus continuity and operational clarity.
**Avoids:** behavior/docs drift and dual-source-of-truth regression.

### Phase Ordering Rationale

- Dependencies enforce this order: lifecycle and adapters before auth/idempotency, then command migration, then webhook reconciliation, then markdown-state deprecation.
- Grouping mirrors architectural boundaries, reducing cross-component churn and limiting migration blast radius.
- Early phases target critical pitfalls first, lowering probability of irreversible data corruption and trust loss.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2:** OAuth migration edge cases (legacy token behavior, secure storage policy by environment).
- **Phase 4:** Deployment topology for webhook endpoint, queue choice, and replay-window policy under free-tier limits.
- **Phase 5:** Docs generation ergonomics and CI enforcement strategy that avoids slowing command iteration.

Phases with standard patterns (can likely skip `/gsd-research-phase`):
- **Phase 1:** Well-documented Linear GraphQL + rate-limit patterns and explicit lifecycle modeling.
- **Phase 3:** Incremental adapter migration is straightforward once foundation constraints are enforced.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Strongly grounded in official Linear/Node/Docusaurus docs plus pinned package versions. |
| Features | MEDIUM | Well-reasoned and source-backed, but differentiator value still needs real usage validation. |
| Architecture | HIGH | Coherent pattern set with explicit boundaries and dependency-aware build order. |
| Pitfalls | HIGH | Risks are concrete, repeated across sources, and tied to clear prevention controls. |

**Overall confidence:** HIGH

### Gaps to Address

- Free-tier operational policy needs concrete thresholds: archival cadence, issue budget rollover, and preflight blocking UX.
- Final actor policy (`user` vs `app`) per command family needs a governance decision and audit requirements sign-off.
- Webhook runtime design (hosting/public ingress/queue) remains implementation-specific and should be validated in phase planning.
- Transition mapping for teams with custom/triage workflows needs fixture-based integration tests before broad rollout.

## Sources

### Primary (HIGH confidence)
- Linear developers docs (`graphql`, `oauth-2-0-authentication`, `oauth-actor-authorization`, `webhooks`, `rate-limiting`, `pagination`, `filtering`, `sdk`, `sdk-errors`) — API behavior, auth lifecycle, event handling, limits, and integration patterns.
- Linear product docs (`github`, `project-milestones`, `parent-and-sub-issues`, `triage`, `integrations`, `linear-asks`, `slack`) — feature expectations and workflow model constraints.
- Node.js official release status page — LTS/EOL runtime requirements.
- Docusaurus official docs — continuity requirements for docs platform.

### Secondary (MEDIUM confidence)
- Linear pricing page — free-tier constraints (2 teams, 250 issues) used for operational planning assumptions.
- Zapier Linear integration page — competitive feature baseline validation.

### Tertiary (LOW confidence)
- Unito Linear integration marketing page — directional signal only for broad sync-pattern comparisons.

---
*Research completed: 2026-02-24*
*Ready for roadmap: yes*
