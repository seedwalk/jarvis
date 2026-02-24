---
name: jarvis-help
description: Show Jarvis commands for Linear-first workflow
---

<reference>
# Jarvis Command Reference

## Setup

- `/jarvis-setup`
  - Configura Jarvis para este repo
  - Valida modo de integracion con Linear (MCP o API fallback)

## Milestones

- `/jarvis-new-milestone [objetivo]`
  - Crea milestone local y prepara ticket padre en Linear
- `/jarvis-research-milestone [milestone-id]`
  - Crea/actualiza Spike Research del milestone
- `/jarvis-plan-milestone [milestone-id]`
  - Genera phases y tasks

## Fases

- `/jarvis-research-phase <phase-id>`
  - Research opcional por fase
- `/jarvis-execute-phase <phase-id>`
  - Ejecuta tasks de fase y resume resultados
- `/jarvis-verify-phase <phase-id>`
  - UAT/QA checklist y decision pass/fail

## Shipping

- `/jarvis-ship`
  - 1 commit final, push, PR template

## Regla de uso

Al terminar cada comando, Jarvis debe mostrar bloque "Comandos sugeridos".
</reference>
