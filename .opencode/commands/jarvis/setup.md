---
name: jarvis-setup
description: Initialize Jarvis config and Linear integration for this repository
tools:
  - read
  - write
  - bash
  - question
---

<objective>
Configure Jarvis for this repository and leave it ready to run milestone commands.
</objective>

<process>
1. Validate repo root exists and `.specs/` exists. If missing, create:
   - `.specs/`
   - `.specs/sessions/`
2. Ask setup questions:
   - Integration mode: `MCP (Recommended)` or `API fallback`
   - Team key/id for Linear
   - Optional default project key/id
3. Create `.jarvis/config.json` with:
   - `version`
   - `linear.mode`
   - `linear.team`
   - `linear.project` (optional)
   - `git.base_branch` default `main`
   - `ship.single_commit_required` true
4. If user chose API fallback:
   - check `LINEAR_API_KEY` in environment
   - if missing, warn and continue (non-blocking)
5. Create local runtime folders if missing:
   - `.jarvis/milestones/`
   - `.jarvis/templates/`
6. Confirm setup with a short summary and show suggested commands.
</process>

<offer_next>
Comandos sugeridos:
- `/jarvis-new-milestone "objetivo"`
- `/jarvis-help`
</offer_next>
