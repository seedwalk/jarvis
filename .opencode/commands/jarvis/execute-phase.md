---
name: jarvis-execute-phase
description: Execute phase tasks and publish summary to parent phase ticket
argument-hint: "<phase-id>"
tools:
  - read
  - write
  - bash
---

<objective>
Run the tasks of a phase, update status, and leave a clear execution summary.
</objective>

<process>
1. Resolve phase tasks from milestone plan.
2. Execute tasks in dependency order.
3. Keep task status updated (Todo/In Progress/Done).
4. Generate summary:
   - completed
   - pending
   - blockers
   - links to artifacts/PRs
5. Comment summary in phase parent ticket.
6. Store local summary next to milestone notes.
</process>

<offer_next>
Comandos sugeridos:
- `/jarvis-verify-phase <phase-id>`
- `/jarvis-close-phase <phase-id>`
</offer_next>
