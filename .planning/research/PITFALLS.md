# Domain Pitfalls

**Domain:** Linear-first OpenCode workflow automation (API/OAuth, free-tier)
**Researched:** 2026-02-24

## Critical Pitfalls

### Pitfall 1: Treating GraphQL HTTP 200 as success
**What goes wrong:** Commands assume success when HTTP status is 200, but Linear can return partial data plus `errors`, so workflows continue with bad or missing state.
**Warning signs:** Milestones/phases appear created but missing links or fields; intermittent "ghost" failures without non-200 responses.
**Prevention strategy:** Make `errors[]` inspection mandatory on every GraphQL response; fail fast on mutation errors; log `extensions.code` and operation name in command traces.
**Phase to address:** Integration foundation (API client contract + error model).

### Pitfall 2: Polling-heavy sync and unbounded GraphQL queries
**What goes wrong:** Existing command systems bolt on frequent polling and broad queries (`first` omitted, nested lists), then hit request/complexity limits under normal team usage.
**Warning signs:** `RATELIMITED` GraphQL errors; falling behind after busy periods; sudden failures when multiple users run `/jarvis-*` flows.
**Prevention strategy:** Prefer webhook-triggered updates; use filtered queries and explicit pagination sizes; track and alert on rate/complexity headers (`X-RateLimit-*`, `X-Complexity`); implement exponential backoff + jitter.
**Phase to address:** Sync architecture and resilience hardening.

### Pitfall 3: OAuth token lifecycle assumptions (refresh-token migration gap)
**What goes wrong:** Teams implement once against long-lived tokens, then break when short-lived access tokens and refresh flows are required/default.
**Warning signs:** 401 spikes around token age boundaries; manual re-auth requested by users; "worked for months then stopped" incidents.
**Prevention strategy:** Build refresh-token flow from day one (including secure storage, rotation, revoke handling); support old-token migration path where relevant; add proactive token-expiry refresh job.
**Phase to address:** Auth and secrets management.

### Pitfall 4: Webhook reliability/security shortcuts
**What goes wrong:** Webhook endpoint is slow, not publicly reachable HTTPS, or does not verify signature/timestamp; deliveries retry and may be disabled, or spoofed events are accepted.
**Warning signs:** Duplicate processing bursts after retries; webhook disablement; unexplained external-triggered state changes.
**Prevention strategy:** Keep handler under 5s (ack fast, queue async work), enforce `Linear-Signature` HMAC validation on raw body, validate timestamp freshness, and dedupe by `Linear-Delivery`.
**Phase to address:** Event ingestion + security controls.

### Pitfall 5: Free-tier capacity blind spots (2 teams, 250 issues)
**What goes wrong:** Workflow design assumes unlimited issue volume and team partitioning; free-tier ceilings are reached mid-milestone and automation stalls.
**Warning signs:** New issue creation fails late in cycle; manual cleanup/archiving rituals emerge; "which team gets automation" contention.
**Prevention strategy:** Add hard preflight checks for plan limits before run; define archival/closure policy and rollover rules; model milestone decomposition to stay within issue budget.
**Phase to address:** Operational policy and lifecycle design.

## Moderate Pitfalls

### Pitfall 6: State-model drift between `/jarvis-*` workflow and Linear workflows
**What goes wrong:** Commands assume fixed status names/transitions; real Linear teams vary workflow states, and issue creation defaults can route to Backlog or Triage unexpectedly.
**Warning signs:** Commands "succeed" but issues land in wrong state; repeated manual state corrections; broken phase progression checks.
**Prevention strategy:** Resolve workflow states dynamically per team at runtime; maintain explicit mapping config for milestone/phase/task states; test with Triage-enabled and Triage-disabled teams.
**Phase to address:** Workflow mapping and compatibility layer.

### Pitfall 7: OAuth actor confusion (`user` vs `app`)
**What goes wrong:** Integrations mix actor modes unintentionally, causing inconsistent audit trail, unexpected permissions, and confusing ownership of automated actions.
**Warning signs:** Same command sometimes posts as user, sometimes app; permissions differ by installer; reviewers cannot trust activity provenance.
**Prevention strategy:** Pick one actor policy per command category and document it; enforce via authorization URL construction and integration tests; include actor metadata in logs.
**Phase to address:** Auth design + governance.

### Pitfall 8: Missing idempotency in command-to-issue orchestration
**What goes wrong:** Retries (network/webhook/re-run) create duplicate milestones/phases/issues because create mutations are treated as one-shot.
**Warning signs:** Multiple nearly identical Linear issues for one command invocation; reruns require manual cleanup; downstream relations point to different duplicates.
**Prevention strategy:** Introduce deterministic external correlation keys (e.g., command run ID in issue metadata/labels); implement upsert/find-before-create patterns; make retries safe by design.
**Phase to address:** Orchestration engine reliability.

## Minor Pitfalls

### Pitfall 9: Pagination/archival blind spots create false "missing data"
**What goes wrong:** Commands read only default first page and exclude archived entities, producing incomplete milestone views and wrong verification outcomes.
**Warning signs:** Counts differ between UI and automation; "not found" for older items that exist; flaky completion checks.
**Prevention strategy:** Standardize cursor pagination utilities; explicitly choose `includeArchived` behavior per use case; verify list completeness in tests.
**Phase to address:** Data access abstraction.

### Pitfall 10: Documentation drift during command-preserving refactor
**What goes wrong:** `/jarvis-*` interface is preserved but semantics change; docs lag implementation, reducing repeatability for small teams.
**Warning signs:** Team asks "is docs or behavior correct?"; onboarding requires tribal knowledge; repeated support questions on command outcomes.
**Prevention strategy:** Add docs-update requirement to Definition of Done; generate command behavior tables from source contracts where possible; run docs validation in CI.
**Phase to address:** Documentation and release discipline.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| API client foundation | Ignoring GraphQL `errors[]` on 200 responses | Central response validator + typed error taxonomy |
| OAuth implementation | Refresh-token flow omitted | Implement refresh/rotate/revoke lifecycle before rollout |
| Sync strategy | Polling and broad queries hit limits | Webhook-first sync + filtered/paginated queries + backoff |
| Webhook ingestion | Signature/timestamp not validated | HMAC + replay-window checks + delivery-id dedupe |
| Workflow mapping | Hardcoded state names | Runtime state discovery + explicit mapping config |
| Free-tier operations | Issue/team caps exceeded mid-cycle | Capacity preflight + archival/rollover policy |
| Reliability hardening | Retry duplicates resources | Correlation IDs + idempotent upsert semantics |
| Docs maintenance | Behavior/docs divergence | CI-gated docs updates per command change |

## Sources

- Linear Developers - GraphQL Getting Started (error handling, defaults, archived behavior): https://linear.app/developers/graphql **(HIGH)**
- Linear Developers - Rate limiting (request + complexity limits, headers, `RATELIMITED`): https://linear.app/developers/rate-limiting **(HIGH)**
- Linear Developers - OAuth 2.0 authentication (refresh tokens default, migration timeline, token lifetimes): https://linear.app/developers/oauth-2-0-authentication **(HIGH)**
- Linear Developers - OAuth actor authorization (`actor=app` vs user mode): https://linear.app/developers/oauth-actor-authorization **(HIGH)**
- Linear Developers - Webhooks (5s timeout, retries, disablement risk, signature verification): https://linear.app/developers/webhooks **(HIGH)**
- Linear Developers - Pagination: https://linear.app/developers/pagination **(HIGH)**
- Linear Developers - Filtering: https://linear.app/developers/filtering **(HIGH)**
- Linear Pricing (free plan constraints incl. 2 teams and 250 issues): https://linear.app/pricing **(MEDIUM)**
