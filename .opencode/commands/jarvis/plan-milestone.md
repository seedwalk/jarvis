---
name: jarvis-plan-milestone
description: Build phases and task plans for a milestone
argument-hint: "<milestone-id>"
tools:
  - read
  - write
  - bash
  - question
---

<objective>
Create phase-level tickets and task subtickets from milestone context and research.
</objective>

<process>
1. Load milestone file and research (if present).
2. Propose 2-6 phases as outcomes, each with:
   - goal
   - Definition of Done
   - risks
   - dependencies
3. For each phase, create 2-8 task plans (subtasks).
4. Persist planning in milestone file.
5. Sync to Linear when available:
   - create phase child tickets under milestone parent
   - create task sub-issues under each phase
6. Print a concise planning table.
7. Ask for approval only if plan materially changes scope.
</process>

<offer_next>
Comandos sugeridos:
- `/jarvis-execute-phase <phase-id>`
- `/jarvis-verify-phase <phase-id>`
</offer_next>
