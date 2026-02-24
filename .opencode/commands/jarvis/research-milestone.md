---
name: jarvis-research-milestone
description: Run milestone research and create/update optional Spike/Research issue
argument-hint: "<milestone-id>"
tools:
  - read
  - write
  - bash
  - question
  - webfetch
---

<objective>
Run research for a milestone and store findings locally and in Linear comments.
</objective>

<process>
1. Resolve milestone by id/slug.
2. If milestone research issue is missing:
   - create `[RESEARCH] Spike - <milestone>` issue (MCP/API if available)
   - otherwise prepare issue draft for manual creation
3. Produce research note:
   - context
   - findings
   - options
   - recommendation
   - risks
4. Save research artifact:
   - `.jarvis/milestones/<id>/research.md` OR section in milestone file
5. Add/update a research comment on Linear issue.
6. Update milestone file with research status and links.
</process>

<offer_next>
Comandos sugeridos:
- `/jarvis-plan-milestone <milestone-id>`
- `/jarvis-research-phase <phase-id>`
</offer_next>
