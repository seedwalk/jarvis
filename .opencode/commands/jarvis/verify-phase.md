---
name: jarvis-verify-phase
description: Run UAT/QA checklist for a phase
argument-hint: "<phase-id>"
tools:
  - read
  - write
  - bash
  - question
---

<objective>
Run UAT and QA checklist for a phase and decide pass/fail.
</objective>

<process>
1. Locate phase plan and execution summary.
2. Build a test checklist from phase acceptance criteria.
3. Ask for user validation results when automated checks are not available.
4. Produce a pass/fail decision with failed items and follow-up actions.
5. Save report in the phase folder.
</process>

<offer_next>
Comandos sugeridos:
- `/jarvis-execute-phase <phase-id>`
- `/jarvis-ship`
</offer_next>
