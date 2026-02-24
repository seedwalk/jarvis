---
name: jarvis-research-phase
description: Optional research for a specific phase and research comment sync
argument-hint: "<phase-id>"
tools:
  - read
  - write
  - question
  - webfetch
---

<objective>
Create optional phase-level research and attach it to the phase parent ticket.
</objective>

<process>
1. Resolve phase and parent milestone.
2. Create optional phase research issue when needed.
3. Write research summary:
   - unknowns
   - decision options
   - recommendation
   - risks and mitigations
4. Save in local phase notes.
5. Add research comment to phase parent and research issue.
</process>

<offer_next>
Comandos sugeridos:
- `/jarvis-execute-phase <phase-id>`
- `/jarvis-verify-phase <phase-id>`
</offer_next>
