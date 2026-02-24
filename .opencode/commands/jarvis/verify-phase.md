---
name: jarvis-verify-phase
description: Run UAT checklist for a phase and publish pass/fail comment
argument-hint: "<phase-id>"
tools:
  - read
  - write
  - question
---

<objective>
Verify phase outcomes against DoD and publish UAT evidence.
</objective>

<process>
1. Load phase goal and DoD.
2. Build UAT checklist from DoD.
3. Ask user/validate each criterion with evidence.
4. Record result as PASS or FAIL with reasons.
5. Post UAT comment in phase parent ticket.
6. Update local phase verification notes.
</process>

<offer_next>
Comandos sugeridos:
- `/jarvis-close-phase <phase-id>`
- `/jarvis-execute-phase <phase-id>`
</offer_next>
