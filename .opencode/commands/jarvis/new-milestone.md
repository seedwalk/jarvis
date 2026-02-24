---
name: jarvis-new-milestone
description: Create a new milestone locally and in Linear
argument-hint: "[milestone objective]"
tools:
  - read
  - write
  - bash
  - question
---

<objective>
Create a new milestone for this repository and prepare the Linear parent ticket.
</objective>

<process>
1. Validate `.jarvis/config.json` exists; if missing, route user to `/jarvis-setup`.
2. Read config and extract:
   - `linear.mode`
   - `linear.team`
   - optional `linear.project`
3. Resolve milestone objective from argument; if missing, ask one focused question.
4. Create a local milestone folder:
   - `.jarvis/milestones/<slug>/`
   - `.jarvis/milestones/<slug>/MILESTONE.md`
   - Include objective, status `draft`, created date, team, and project (if present).
5. Create parent issue in Linear:
   - Prefer MCP integration when `linear.mode = mcp`
   - If `linear.mode = api`, use `LINEAR_API_KEY`
   - If integration is unavailable, keep local files and return a clear manual fallback payload (title + description) for copy/paste.
6. Update local milestone file with created Linear issue ID/URL when available.
7. Confirm completion with local path and Linear link (or fallback payload).
</process>

<offer_next>
Comandos sugeridos:
- `/jarvis-research-milestone <milestone-id>`
- `/jarvis-plan-milestone <milestone-id>`
</offer_next>
