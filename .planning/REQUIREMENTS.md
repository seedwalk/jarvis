# Requirements: Jarvis Linear-First GSD for OpenCode

**Defined:** 2026-02-24
**Core Value:** A small team can reliably run the full Jarvis flow end-to-end with Linear free-tier constraints, with consistent issue state transitions and traceable execution.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Core Workflow

- [ ] **CORE-01**: User can run `/jarvis-setup` to configure OAuth/API credentials and validate Linear team access on free tier.
- [ ] **CORE-02**: User can run `/jarvis-new-milestone` and create/update a canonical Linear parent entity for the milestone goal.
- [ ] **CORE-03**: User can run `/jarvis-research-milestone` and persist research context to linked Linear issue objects.
- [ ] **CORE-04**: User can run `/jarvis-plan-milestone` and create phase parent issues plus task sub-issues with Definition of Done, risks, and dependencies.
- [ ] **CORE-05**: User can run `/jarvis-research-phase <phase-id>` and persist findings to a linked phase research issue and phase parent summary.
- [ ] **CORE-06**: User can run `/jarvis-execute-phase <phase-id>` and update task/phase statuses in Linear based on execution progress.
- [ ] **CORE-07**: User can run `/jarvis-verify-phase <phase-id>` and record structured UAT verification outcome (pass/fail evidence) in Linear comments.
- [ ] **CORE-08**: User can run `/jarvis-close-phase <phase-id>` and close only when Definition of Done criteria are satisfied.
- [ ] **CORE-09**: User can run `/jarvis-ship` to produce single-commit ship flow and PR context linked to the relevant Linear milestone/phase.
- [ ] **CORE-10**: User can rerun any mutating command without creating duplicate Linear entities through deterministic correlation IDs and idempotent upsert behavior.
- [ ] **CORE-11**: User can rely on guarded lifecycle transitions, where invalid state jumps are rejected with actionable error feedback.

### Linear Integration

- [ ] **LIN-01**: User can complete OAuth-based authentication lifecycle (authorize, refresh, revoke) for Linear API usage in v1.
- [ ] **LIN-02**: User can operate under free-tier limits with bounded retries, pagination, and rate-limit-safe concurrency behavior.
- [ ] **LIN-03**: User can trust webhook event processing because signature/timestamp validation and dedupe are enforced before state updates.
- [ ] **LIN-04**: User can map milestone/phase/task semantics to Linear project or milestone, parent issue, and sub-issue hierarchy consistently.
- [ ] **LIN-05**: User can inspect execution audit trails for each command run, including correlation ID, target issue IDs, and mutation outcomes.

### Delivery Signals and Docs

- [ ] **SIG-01**: User can keep Linear status aligned with development reality through PR/commit-linked status convergence.
- [ ] **DOC-01**: User can find Docusaurus docs updated to reflect current `/jarvis-*` behavior and Linear-first lifecycle conventions.

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Reliability and Insights

- **REL-01**: User can detect and remediate drift between intended lifecycle graph and actual Linear state through guided repair commands.
- **REL-02**: User can reconstruct full execution timelines from replayable mutation plans across milestone and phase history.

### Reporting

- **RPT-01**: User can generate milestone health synthesis (progress, risk, blockers) directly from Linear issue graph.

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| MCP-first integration in v1 | Free-tier strategy is API/OAuth-only for this milestone |
| Paid-tier Linear-dependent capabilities | Must remain viable for free-tier teams |
| Command namespace migration to `/gsd-*` | Keep `/jarvis-*` compatibility during core refactor |
| Polling-heavy synchronization | Webhook-first model is required for reliability and rate-limit safety |
| Dual operational source of truth (Linear + markdown as equal inputs) | Linear must be canonical to avoid drift |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| CORE-01 | TBA | Pending |
| CORE-02 | TBA | Pending |
| CORE-03 | TBA | Pending |
| CORE-04 | TBA | Pending |
| CORE-05 | TBA | Pending |
| CORE-06 | TBA | Pending |
| CORE-07 | TBA | Pending |
| CORE-08 | TBA | Pending |
| CORE-09 | TBA | Pending |
| CORE-10 | TBA | Pending |
| CORE-11 | TBA | Pending |
| LIN-01 | TBA | Pending |
| LIN-02 | TBA | Pending |
| LIN-03 | TBA | Pending |
| LIN-04 | TBA | Pending |
| LIN-05 | TBA | Pending |
| SIG-01 | TBA | Pending |
| DOC-01 | TBA | Pending |

**Coverage:**
- v1 requirements: 18 total
- Mapped to phases: 0
- Unmapped: 18

---
*Requirements defined: 2026-02-24*
*Last updated: 2026-02-24 after initial definition*
