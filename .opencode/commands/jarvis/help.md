---
name: jarvis-help
description: Show Jarvis command reference
---

<reference>
# Jarvis Command Reference

## Setup

- `/jarvis-setup`
  - Configure Jarvis for this repo
  - Validate Linear integration mode (MCP or API fallback)

## Milestones

- `/jarvis-new-milestone [objective]`
  - Create local milestone and prepare parent ticket in Linear
- `/jarvis-research-milestone [milestone-id]`
  - Create/update milestone Spike Research
- `/jarvis-plan-milestone [milestone-id]`
  - Generate phases and tasks

## Phases

- `/jarvis-research-phase <phase-id>`
  - Optional phase research
- `/jarvis-execute-phase <phase-id>`
  - Execute phase tasks and summarize outcomes
- `/jarvis-verify-phase <phase-id>`
  - UAT/QA checklist and pass/fail decision

## Shipping

- `/jarvis-ship`
  - Final single commit, push, PR template

## Usage rule

At the end of each command, Jarvis must show a "Comandos sugeridos" block.
</reference>
