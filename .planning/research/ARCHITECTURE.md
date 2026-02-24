# Architecture Patterns

**Domain:** Linear-first workflow automation for OpenCode command orchestration
**Researched:** 2026-02-24

## Recommended Architecture

Keep the existing prompt-as-code command/agent contracts, but move operational state to a Linear-backed workflow core.

Use a **hexagonal architecture** around a `Workflow Engine`:

- Inbound adapters: `/jarvis-*` commands and agent outputs
- Core domain: milestone/phase/plan/task lifecycle state machine
- Outbound adapters: Linear GraphQL API, OAuth token service, webhook receiver
- Local files: support context and cache only (not operational truth)

```text
User -> /jarvis-* command
  -> Command Orchestrator (existing)
    -> Workflow Engine (new core)
      -> Linear Read Model (query/filter/pagination)
      -> Transition Guard + Idempotency
      -> Linear Write Model (mutations)
      -> Event Log + Metrics

Linear Webhooks -> Webhook Ingestor -> Reconciliation Worker -> Workflow Engine
```

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|----------------|-------------------|
| Command Orchestrator Adapter | Translate slash command intent into domain commands (`CreateMilestone`, `PlanPhase`, `ExecutePhaseWave`, `VerifyPhase`) | Workflow Engine |
| Workflow Engine (Domain Core) | Enforce lifecycle rules, preconditions, and allowed state transitions | Read Model, Write Model, Transition Guard |
| Transition Guard + Idempotency | Prevent duplicate side effects, enforce exactly-once *semantic* execution for retries/re-runs | Workflow Engine, Correlation Store |
| Linear Read Model Adapter | Fetch canonical state from Linear using GraphQL queries, filtering, pagination | Linear API |
| Linear Write Model Adapter | Perform mutations (`issueCreate`, `issueUpdate`, comments, links/sub-issues) with retry and rate-limit handling | Linear API |
| Auth & Token Manager | OAuth code exchange, refresh token rotation, API key fallback mode, token revocation handling | Linear OAuth endpoints, secret storage |
| Webhook Ingestor | Verify `Linear-Signature`, timestamp freshness, ack within timeout, enqueue events | Linear webhooks, Reconciliation Worker |
| Reconciliation Worker | Compare expected workflow projection vs Linear actual state, repair drift | Read/Write adapters, Correlation Store |
| Correlation Store (thin local/runtime) | Store deterministic mapping keys and last-processed webhook/event cursor; disposable cache | Transition Guard, Reconciliation Worker |
| Observability Layer | Structured logs, command-run IDs, rate-limit/complexity telemetry and failure diagnostics | All components |

## Data Flow

### 1) Command-driven execution (primary)

1. User runs `/jarvis-*` command.
2. Orchestrator builds a domain command with deterministic identifiers (`workspace`, `milestoneSlug`, `phaseNumber`, `planId`, `runId`).
3. Workflow Engine loads current state from **Linear first** (Read Model).
4. Transition Guard validates allowed transition and deduplicates by operation key.
5. Write Model performs Linear mutations.
6. Engine returns updated lifecycle snapshot to command and writes only support artifacts locally (optional mirror/report).

Direction: `Command -> Engine -> Linear (read) -> Guard -> Linear (write) -> Command output`

### 2) Event-driven convergence (secondary)

1. Linear sends webhook event to public endpoint.
2. Ingestor verifies HMAC signature and timestamp, responds fast (`200`) and queues payload.
3. Reconciliation Worker consumes event, reloads related entities from Linear, and compares with expected workflow projection.
4. If drift exists (missing link/state mismatch/partial write), worker applies compensating mutation(s).

Direction: `Linear webhook -> Ingestor -> Queue -> Reconciler -> Linear`

### 3) Recovery and replay

1. On command retry or crash recovery, Engine rehydrates from Linear + correlation store.
2. Idempotency keys block duplicate create/update effects.
3. If uncertain state, reconciler performs read-after-write verification and resolves to a single canonical state.

Direction: `Retry -> Engine -> Linear read -> Guard -> (optional) repair write`

## Patterns to Follow

### Pattern 1: Linear as canonical operational store
**What:** Treat Linear issue graph/status as the source of truth for milestone/phase/task lifecycle.
**When:** Always for runtime state; local markdown is support context only.
**Why:** Eliminates split-brain between docs and tracker.

### Pattern 2: Deterministic workflow identity
**What:** Derive stable IDs from command contracts (milestone slug + phase + plan) and persist as labels/metadata conventions plus local correlation cache.
**When:** For every create/update path.
**Why:** Enables safe retries and repeatable execution.

### Pattern 3: Command + webhook hybrid consistency
**What:** Use synchronous command writes for UX and webhooks for eventual convergence.
**When:** All mutating flows.
**Why:** Command path stays responsive; webhook path repairs missed/partial transitions.

### Pattern 4: Explicit transition matrix
**What:** Model allowed transitions (draft -> planned -> in_progress -> verified -> shipped) and reject invalid jumps.
**When:** Before every mutation.
**Why:** Prevents state corruption from prompt drift or manual edits.

### Pattern 5: Rate-limit-aware adapters
**What:** Centralize retry/backoff, parse `X-RateLimit-*` and complexity headers, and downshift query shape.
**When:** All Linear API calls.
**Why:** Keeps flows reliable under free-tier and shared-user limits.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Dual operational truth
**What:** Writing authoritative lifecycle state to both markdown and Linear.
**Why bad:** Divergence and non-repeatable runs.
**Instead:** Linear is authoritative; markdown is generated evidence only.

### Anti-Pattern 2: Name-based status coupling
**What:** Hard-coding state names like "In Progress" in logic.
**Why bad:** Teams can rename workflow states.
**Instead:** Resolve and store workflow state IDs/types, not display names.

### Anti-Pattern 3: Polling-heavy synchronization
**What:** Frequent broad polling for updates.
**Why bad:** Hits API and complexity limits quickly.
**Instead:** Webhooks first, filtered incremental queries second.

### Anti-Pattern 4: OAuth handled in command prompts
**What:** Letting each command implement token lifecycle separately.
**Why bad:** Inconsistent refresh/revocation handling.
**Instead:** Single Auth Manager component with shared token policy.

### Anti-Pattern 5: Non-idempotent create paths
**What:** Creating milestone/phase issues without dedupe keys.
**Why bad:** Duplicates on retries or agent restarts.
**Instead:** Guard every create with deterministic operation keys and read-before-create checks.

## Suggested Build Order and Dependencies

1. **Domain model + transition matrix (foundation)**
   - Define lifecycle entities and allowed transitions independent of transport.
   - Dependency: none.

2. **Linear adapter layer (read/write + rate-limit handling)**
   - Implement GraphQL queries/mutations with pagination/filtering strategy.
   - Dependency: step 1 domain contracts.

3. **Auth & token manager (OAuth + API key fallback)**
   - Implement OAuth code exchange, refresh, revoke, and secure storage.
   - Dependency: step 2 transport client.

4. **Command adapter migration (one command at a time)**
   - Start with `setup` and `new-milestone`, then `research/plan milestone`, then phase commands.
   - Dependency: steps 1-3.

5. **Idempotency and correlation store**
   - Add operation keys and dedupe checks to all mutating flows.
   - Dependency: steps 2-4.

6. **Webhook ingestor + reconciliation worker**
   - Add signature verification, queue, drift detection, and compensating writes.
   - Dependency: steps 2, 3, 5.

7. **Observability and reliability hardening**
   - Add run tracing, retry metrics, dead-letter handling, and replay tooling.
   - Dependency: all previous steps.

8. **Markdown persistence deprecation**
   - Keep generated reports, remove markdown as decision input/state authority.
   - Dependency: stable command + reconciliation behavior in production usage.

## Dependency Notes for Roadmap Phases

- Do **not** migrate `execute-phase` before idempotency exists; it is the highest duplicate-risk path.
- Introduce webhook reconciliation before declaring markdown-state removal complete.
- Keep a temporary "shadow mode" where command outputs compare Linear state vs legacy files for 1-2 cycles to detect drift.

## Scalability Considerations

| Concern | Early (single team) | Growth (multi-team) | Larger scale |
|---------|----------------------|---------------------|--------------|
| API quota | Simple per-command calls | Shared token quotas require batching/filtering | Dedicated app actor + workload partitioning |
| Data volume | Direct issue queries | Cursor pagination by `updatedAt` | Incremental sync windows + reconciliation queues |
| Reliability | Retry in-process | Queue-backed retries and DLQ | Multi-worker reconciler with idempotent consumers |
| State consistency | Command path mostly enough | Webhooks required for drift | Full event/replay and repair pipeline |

## Sources

- Linear GraphQL getting started (auth, errors, issue mutation behavior): https://linear.app/developers/graphql (HIGH)
- Linear OAuth 2.0 authentication (refresh token changes, token lifecycle, client credentials): https://linear.app/developers/oauth-2-0-authentication (HIGH)
- Linear OAuth actor authorization (`actor=app` for service/agent behavior): https://linear.app/developers/oauth-actor-authorization (HIGH)
- Linear Webhooks (signature verification, retries, delivery constraints): https://linear.app/developers/webhooks (HIGH)
- Linear Rate limiting (request limits, complexity headers, RATELIMITED behavior): https://linear.app/developers/rate-limiting (HIGH)
- Linear Pagination and Filtering (incremental query patterns): https://linear.app/developers/pagination, https://linear.app/developers/filtering (HIGH)
- Linear SDK errors (typed error handling patterns): https://linear.app/developers/sdk-errors (HIGH)
- Linear pricing/free-tier constraints (250 issues, 2 teams): https://linear.app/pricing (MEDIUM, marketing page can change)
