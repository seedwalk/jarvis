---
name: jarvis-new-milestone
description: Create a new milestone context and parent issue draft for Linear
argument-hint: "[milestone objective]"
tools:
  - read
  - write
  - bash
  - question
---

<objective>
Create a milestone skeleton with enough context to plan phases in Linear-first mode.
</objective>

<process>
1. Ensure `.jarvis/config.json` exists. If not, ask user to run `/jarvis-setup`.
2. Read `$ARGUMENTS` as milestone objective. If missing, ask for objective.
3. Ask only missing critical questions:
   - Success metric
   - Target date (optional)
   - Scope boundaries
4. Build a slug and create milestone file:
   - `.jarvis/milestones/YYYY-MM-DD_<slug>.md`
5. Save:
   - title
   - objective
   - constraints
   - success metric
   - planned phases (empty)
   - linear links (empty)
6. Prepare Linear parent issue draft in markdown.
   - If MCP/API is available, create issue and store link.
   - If not, print markdown body ready to copy/paste.
7. Append a new session note in `.specs/sessions/` with brief context.
</process>

<offer_next>
Comandos sugeridos:
- `/jarvis-research-milestone <milestone-id>`
- `/jarvis-plan-milestone <milestone-id>`
</offer_next>
