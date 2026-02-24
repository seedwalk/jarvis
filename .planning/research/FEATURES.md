# Feature Research

**Domain:** Linear-first workflow automation for command-driven delivery lifecycle
**Researched:** 2026-02-24
**Confidence:** MEDIUM

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Linear issue lifecycle orchestration (create/update/transition) | Core automation tools all support create/update triggers/actions for issues | MEDIUM | Must support deterministic transitions for setup -> new -> research -> plan -> execute -> verify -> close -> ship. |
| Bi-directional sync with development signals (PR/commit status) | Linear native GitHub integration automates status from PR/commit lifecycle | MEDIUM | Link work items to branch/PR events so status cannot drift from implementation reality. |
| Intake from communication channels (Slack/email) into Linear | Teams expect turning requests into issues from Slack/email with synced thread context | MEDIUM | Preserve conversational context as comments/attachments on the authoritative issue. |
| Workflow-aware hierarchy (project -> milestone -> parent/sub-issue) | Linear supports projects, milestones, parent/sub-issues, initiative grouping | HIGH | Map Jarvis concepts cleanly: milestone to project/milestone, phase to parent issue, tasks to sub-issues. |
| Idempotent command execution and safe retries | Automation users expect repeated runs not to duplicate issues/state | HIGH | Require stable external IDs in issue metadata, conflict-safe upserts, and replay protection. |
| Role- and scope-safe auth (OAuth + least privilege) | Modern integrations expect user/app-scoped OAuth and revocation support | MEDIUM | Use OAuth token lifecycle (refresh/revoke), avoid admin scope unless required, support app/user actor strategy. |
| Event-driven updates via webhooks (not polling) | Serious automation stacks use webhook triggers for freshness and rate-limit safety | MEDIUM | Verify signatures/timestamps, handle retries, and maintain dead-letter visibility. |
| Observability and auditability of automations | Users need to debug why status changed and by whom | MEDIUM | Log command-to-issue mutation trace, webhook event IDs, and correlation IDs. |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valuable.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Command-compatible Linear-first engine (`/jarvis-*` preserved) | Enables migration without retraining existing users or changing command UX | HIGH | Competitive edge is zero command-surface churn while replacing internals with Linear-native state. |
| Full lifecycle contract enforcement | Guarantees every milestone/phase follows the same state machine end-to-end | HIGH | Encode guardrails so commands fail fast on invalid state instead of silently mutating arbitrary fields. |
| Docs-as-output automation | Keeps Docusaurus docs aligned with actual behavior after each flow change | MEDIUM | Most automation products stop at workflow execution; this adds institutional memory and onboarding leverage. |
| Linear model mapping profiles (free-tier-safe defaults) | Makes setup fast with sensible defaults tuned to free-tier constraints | MEDIUM | Predefined mapping profile for team/state/project/milestone conventions and optional overrides. |
| Drift detection between command intent and Linear truth | Detects stale local planning artifacts and sync mismatches proactively | HIGH | Compare expected lifecycle graph vs live Linear graph; emit remediation commands, not manual checklists. |
| Deterministic replay and timeline reconstruction | Improves trust by letting teams reconstruct exactly what automation did | MEDIUM | Store per-command mutation plans and resulting Linear IDs for replay/debug/audit. |
| Milestone health synthesis from issue graph | Auto-generates milestone progress/risk summaries from issue states and blockers | MEDIUM | Leverages Linear project/milestone progress + relation graph to create actionable status updates. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Parallel truth stores (Linear + local markdown as co-equal state) | Feels safer during migration | Creates divergence, reconciliation burden, and ambiguous source of truth | Keep Linear as operational truth; keep local docs as derived/supporting artifacts only. |
| Polling-heavy sync loops | Looks simpler than webhook infrastructure | Hits rate limits, introduces lag, and increases duplicate/conflict risk | Use webhook-first eventing with bounded fallback polling for incident recovery only. |
| Over-custom workflow DSL in v1 | Teams want fully custom lifecycle scripts immediately | Increases implementation risk and weakens deterministic behavior | Ship opinionated lifecycle with limited extension points; expand after usage evidence. |
| Bidirectional sync of every external field | Sounds comprehensive | Causes noisy writes, accidental overwrite, and ownership confusion | Define field ownership boundaries (Linear-owned vs external-owned) with explicit mapping. |
| Command namespace migration in same milestone | Tempting cleanup (`/gsd-*`) while refactoring internals | Bundles behavior and UX migration risk, harming adoption | Preserve `/jarvis-*` now; schedule namespace migration as a separate milestone. |
| Premium-plan dependent design assumptions | Enables attractive enterprise automations | Violates free-tier success criteria and blocks target teams | Implement free-tier-compatible paths first; feature-flag premium enhancements later. |

## Feature Dependencies

```
OAuth + token lifecycle
    └──requires──> Core issue/project/milestone mutation layer
                         └──requires──> Canonical Jarvis↔Linear ID mapping
                                              └──requires──> Idempotency + replay guards

Webhook ingestion + verification
    └──enables──> Event-driven status transitions
                      └──enables──> PR/commit-aware lifecycle automation

Hierarchy mapping (project/milestone/parent/sub-issue)
    └──requires──> Lifecycle state machine definition
                      └──enables──> Phase/task orchestration commands

Docs-as-output automation
    └──depends-on──> Deterministic lifecycle events + audit trail

Parallel truth stores
    └──conflicts──> Linear-as-operational-truth principle
```

### Dependency Notes

- **Mutation layer requires canonical ID mapping:** without stable foreign keys, commands cannot safely upsert or retry.
- **Webhook verification enables trustworthy automation:** unverified events make status transitions unsafe and non-auditable.
- **Hierarchy mapping requires lifecycle state machine:** structural mapping alone is insufficient without allowed transition rules.
- **Docs automation depends on deterministic events:** documentation generation is only trustworthy when execution emits structured, replayable outputs.
- **Parallel truth conflicts with Linear-first operation:** dual-write plans reintroduce the drift this milestone is meant to remove.

## MVP Definition

### Launch With (v1)

Minimum viable product - what is needed to validate Linear-first execution.

- [ ] Deterministic `/jarvis-*` command execution backed by Linear issues/projects/milestones.
- [ ] Canonical lifecycle state machine (setup, new, research, plan, execute, verify, close, ship) with guarded transitions.
- [ ] OAuth-based auth + webhook ingestion with signature verification and retry-safe processing.
- [ ] Idempotent upsert/retry model with correlation IDs and audit logs.
- [ ] Basic docs update pipeline that reflects command behavior and lifecycle mapping.

### Add After Validation (v1.x)

Features to add once core is stable in real team usage.

- [ ] Slack/email intake enrichments with richer template routing and comment-thread policy controls.
- [ ] Milestone health synthesis and auto-generated risk/update summaries.
- [ ] Drift detection workflows and guided remediation commands.

### Future Consideration (v2+)

Features to defer until fit and reliability are proven.

- [ ] User-defined lifecycle DSL and custom transition hooks.
- [ ] Broad bidirectional sync packs across many PM/ticketing tools.
- [ ] Advanced AI triage/routing policies with autonomous reassignment.

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Linear-backed command lifecycle orchestration | HIGH | HIGH | P1 |
| OAuth + webhook + idempotent event processing | HIGH | MEDIUM | P1 |
| Hierarchy mapping (milestone/phase/task) | HIGH | HIGH | P1 |
| PR/commit-linked status automation | HIGH | MEDIUM | P1 |
| Docs-as-output synchronization | MEDIUM | MEDIUM | P2 |
| Slack/email enriched intake rules | MEDIUM | MEDIUM | P2 |
| Drift detection and remediation | MEDIUM | HIGH | P2 |
| Lifecycle DSL customization | MEDIUM | HIGH | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have after initial validation
- P3: Nice to have / future consideration

## Competitor Feature Analysis

| Feature | Linear Native + Integrations | Generic Automation Platforms (Zapier/Unito class) | Jarvis Linear-First Approach |
|---------|-------------------------------|---------------------------------------------------|------------------------------|
| Issue creation and updates | Strong native support | Strong support (triggers/actions, mapping) | Match baseline with command semantics and deterministic retries. |
| Dev workflow status sync (PR/commit) | Strong, deeply integrated | Usually connector-dependent and less opinionated | Reuse native signals but enforce Jarvis lifecycle contract. |
| Intake from Slack/email | Strong via Slack/Asks | Strong via broad connectors | Keep Linear-native intake, then route into command-driven lifecycle states. |
| Two-way external tool sync | Moderate (targeted) | Strong (especially Unito-style bidirectional sync) | Intentionally selective; avoid broad field ownership conflicts in v1. |
| Lifecycle rigor across milestone/phase/task | Moderate (building blocks exist) | Low-moderate (automation-centric, not domain lifecycle-centric) | Differentiate with explicit phase contract and guardrails. |
| Docs/system-of-record alignment | Limited | Limited | Differentiate with automatic documentation updates from execution traces. |

## Sources

- HIGH: https://linear.app/developers/graphql
- HIGH: https://linear.app/developers/oauth-2-0-authentication
- HIGH: https://linear.app/developers/webhooks
- HIGH: https://linear.app/developers/rate-limiting
- HIGH: https://linear.app/docs/github
- HIGH: https://linear.app/docs/parent-and-sub-issues
- HIGH: https://linear.app/docs/project-milestones
- HIGH: https://linear.app/docs/triage
- HIGH: https://linear.app/integrations
- HIGH: https://linear.app/integrations/slack
- HIGH: https://linear.app/integrations/zapier
- HIGH: https://linear.app/integrations/linear-asks
- MEDIUM: https://zapier.com/apps/linear/integrations (validated against Linear Zapier integration page)
- LOW: https://unito.io/integrations/linear/ (marketing-heavy; used only for broad feature pattern signals)

---
*Feature research for: Linear-first OpenCode/Jarvis workflow automation*
*Researched: 2026-02-24*
