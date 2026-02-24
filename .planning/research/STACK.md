# Technology Stack

**Project:** Linear-first OpenCode workflow automation (Jarvis)
**Researched:** 2026-02-24
**Scope:** Subsequent milestone; only new stack for Linear API/OAuth operational execution

## Recommended Stack

### Core Runtime and CLI

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Node.js | 24.x (Active LTS) | Runtime for `/jarvis-*` commands and automation workers | Active LTS gives stable long-term support; Node 18 is EOL, so moving to 24 reduces security and dependency risk for 2025+ builds. | HIGH |
| TypeScript | 5.9.3 | Type-safe command and integration code | Best fit for Linear SDK typings and safer orchestration refactors. | HIGH |
| Commander | 14.0.3 | CLI command surface (`/jarvis-*` wrappers + subcommands) | Battle-tested CLI ergonomics with low overhead, ideal for deterministic command orchestration. | HIGH |
| tsx | 4.21.0 | Local dev/run for TypeScript scripts | Fast zero-config script execution for command automation loops. | HIGH |

### Linear Integration Layer

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| `@linear/sdk` | 75.0.0 | Primary typed client for Linear GraphQL | Official SDK, strongly typed models/operations, fastest path to reliable issue-centric flows. | HIGH |
| `oauth4webapi` | 3.8.5 | OAuth 2.0 + PKCE token exchange/refresh/revoke | Standards-first OAuth implementation; fits Linear's PKCE and refresh-token model without framework lock-in. | HIGH |
| `graphql-request` | 7.4.0 (optional) | Raw GraphQL for custom/highly-specific queries | Useful when SDK abstraction is too broad and you need strict query cost control against Linear complexity limits. | MEDIUM |

### Local State and Reliability (Free-Tier Friendly)

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| `better-sqlite3` | 12.6.2 | Local durable store (token metadata, cursor checkpoints, run ledger) | Zero-ops persistence, no paid infra, strong fit for small-team repeatable workflows. | HIGH |
| `drizzle-orm` | 0.45.1 | Typed schema + migrations for SQLite state | Prevents ad hoc state drift as automation logic evolves across milestones. | HIGH |
| `p-retry` | 7.1.1 | Retry/backoff around API operations | Handles transient GraphQL/network failures and rate-limit retries cleanly. | HIGH |
| `p-queue` | 9.1.0 | Concurrency and throughput control | Helps stay inside Linear request/complexity limits with bounded command fan-out. | HIGH |

### Validation, Logging, and Docs Continuity

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| `zod` | 4.1.12 | Runtime validation for config/env/command payloads | Catches malformed operational inputs before side effects in Linear. | HIGH |
| `pino` | 10.3.1 | Structured logs for orchestration runs | Machine-parseable logs make milestone-to-ship runs auditable and repeatable. | HIGH |
| Docusaurus | 3.9.2 | Preserve existing docs platform | Meets constraint to maintain Docusaurus docs while documenting new Linear-first commands and runbooks. | HIGH |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Linear API client | `@linear/sdk` | Apollo Client | Apollo adds cache/runtime complexity not needed for CLI orchestration. |
| OAuth implementation | `oauth4webapi` + Node callback | Passport.js strategy stack | Passport is web-session oriented and heavyweight for CLI-first, PKCE-driven flows. |
| Workflow engine | In-process command orchestration + SQLite ledger | Temporal / Airflow | Operational overhead and hosting complexity conflict with free-tier-first v1. |
| Automation platform | Code-native `/jarvis-*` commands | Zapier/Make/n8n-cloud | Free-tier task caps and vendor workflow lock-in reduce deterministic repeatability. |
| Data store | SQLite local state | Managed Postgres + Redis | Unnecessary infra cost/ops for small-team v1 and local command execution model. |
| Runtime | Node 24 LTS | Bun runtime-first | Bun compatibility is better now, but Node remains the safer default for SDK/tooling parity and ops predictability. |

## Opinionated 2025 Standard Under Free-Tier Constraints

For this milestone, the standard stack is:

1. **Node 24 + TypeScript** as the execution base for all `/jarvis-*` operational commands.
2. **Linear SDK + OAuth 2.0 PKCE** as the integration contract (no unofficial wrappers).
3. **SQLite-backed run ledger** for deterministic retries, cursors, and idempotency without paid infra.
4. **Rate-limit-aware queue/retry layer** to stay reliable within Linear API quotas.
5. **Docusaurus continuity** for command docs/runbooks so process changes remain discoverable and repeatable.

This combination is the best fit for a small team because it minimizes hosting cost and moving parts while preserving operational rigor.

## Installation

```bash
# Core runtime/dev
npm install commander zod pino tsx
npm install -D typescript @types/node vitest

# Linear + OAuth
npm install @linear/sdk oauth4webapi graphql-request

# Reliability + local state
npm install better-sqlite3 drizzle-orm p-retry p-queue

# Docs continuity
npm install @docusaurus/core @docusaurus/preset-classic
```

## What NOT to Use in v1

- Do not adopt managed workflow engines (Temporal/Airflow) before proven scale pressure; they overcomplicate free-tier operations.
- Do not use polling-heavy sync loops as the primary model; Linear explicitly recommends webhooks/event-driven updates to avoid limits.
- Do not introduce a separate paid database/cache layer for v1 orchestration state.
- Do not couple OAuth to browser-session frameworks; keep CLI-native PKCE and explicit token lifecycle handling.

## Sources

- Linear OAuth 2.0 authentication (PKCE, refresh tokens, revoke): https://linear.app/developers/oauth-2-0-authentication (HIGH)
- Linear GraphQL getting started (endpoint, auth modes, SDK recommendation): https://linear.app/developers/graphql (HIGH)
- Linear SDK getting started: https://linear.app/developers/sdk (HIGH)
- Linear rate limiting and complexity guidance: https://linear.app/developers/rate-limiting (HIGH)
- Node.js release statuses (v24 Active LTS, v18 EOL): https://nodejs.org/en/about/previous-releases (HIGH)
- Docusaurus docs/version selector (v3.9.2 current stable): https://docusaurus.io/docs (HIGH)
- npm registry current package versions (queried 2026-02-24):
  - https://www.npmjs.com/package/@linear/sdk
  - https://www.npmjs.com/package/oauth4webapi
  - https://www.npmjs.com/package/typescript
  - https://www.npmjs.com/package/commander
  - https://www.npmjs.com/package/zod
  - https://www.npmjs.com/package/pino
  - https://www.npmjs.com/package/better-sqlite3
  - https://www.npmjs.com/package/drizzle-orm
  - https://www.npmjs.com/package/p-retry
  - https://www.npmjs.com/package/p-queue
  - https://www.npmjs.com/package/tsx (HIGH)
