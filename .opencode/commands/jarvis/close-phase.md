---
name: jarvis-close-phase
description: Close a phase when DoD is complete and suggest next phase
argument-hint: "<phase-id>"
tools:
  - read
  - write
  - question
---

<objective>
Close a phase safely and keep milestone progression clear.
</objective>

<process>
1. Check latest verification status for phase.
2. If failed verification, do not close; show missing criteria.
3. If passed, mark phase as done in local notes and Linear.
4. Add closure comment:
   - what shipped
   - what was deferred
   - risks to track
5. Propose next phase id.
</process>

<offer_next>
Comandos sugeridos:
- `/jarvis-execute-phase <next-phase-id>`
- `/jarvis-ship`
</offer_next>
