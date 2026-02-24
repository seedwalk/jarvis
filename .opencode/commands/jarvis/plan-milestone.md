---
name: jarvis-plan-milestone
description: Generate phases and tasks for a milestone
argument-hint: "<milestone-id>"
tools:
  - read
  - write
  - bash
  - question
---

<objective>
Generate phase and task plan for a milestone.
</objective>

<process>
1. Validate milestone exists under `.jarvis/milestones/`.
2. Read milestone objective and optional research.
3. Generate `PLAN.md` with phases, tasks, dependencies, and acceptance criteria.
4. If Linear integration is available, create/update child issues under the parent milestone issue.
5. Save created issue references back to local milestone files.
6. Return phase list and next execution step.
</process>

<offer_next>
Comandos sugeridos:
- `/jarvis-execute-phase <phase-id>`
- `/jarvis-help`
</offer_next>
