---
name: jarvis-research-milestone
description: Create or update milestone Spike Research
argument-hint: "<milestone-id>"
tools:
  - read
  - write
  - bash
  - question
---

<objective>
Create or update Spike Research for a milestone.
</objective>

<process>
1. Validate milestone exists under `.jarvis/milestones/`.
2. Create or update `RESEARCH.md` in that milestone folder.
3. If Linear integration is available, create/update a linked Spike issue.
4. Save references (issue ID/URL) in the milestone files.
5. Return a concise summary.
</process>

<offer_next>
Comandos sugeridos:
- `/jarvis-plan-milestone <milestone-id>`
- `/jarvis-help`
</offer_next>
