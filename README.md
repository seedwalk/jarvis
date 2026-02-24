# Jarvis

Jarvis es un asistente personal orientado a ejecucion en **Linear**.
La idea es operar con flujo tipo GSD, pero mapeado a objetos reales de Linear:

- Milestone -> ticket padre
- Phase -> tickets hijo del milestone
- Task plan -> subtickets de cada phase
- Research -> tickets opcionales (milestone y/o phase)

## Estado actual

Este repo esta en fase de definicion funcional.
La base vive en `/.specs`:

- `/.specs/vision.md`
- `/.specs/product-spec.md`
- `/.specs/propuesta.md`

## Objetivo del MVP

Implementar comandos slash para OpenCode que permitan:

- crear milestone
- hacer research
- planificar por phases
- ejecutar y verificar phases
- cerrar con flujo de ship (1 commit + PR)

## Comandos objetivo

- `/jarvis:setup`
- `/jarvis:new-milestone`
- `/jarvis:research-milestone`
- `/jarvis:plan-milestone`
- `/jarvis:research-phase <phase-id>`
- `/jarvis:execute-phase <phase-id>`
- `/jarvis:verify-phase <phase-id>`
- `/jarvis:close-phase <phase-id>`
- `/jarvis:ship`

## Flujo recomendado

1. `/jarvis:setup` para conectar MCP de Linear
2. `/jarvis:new-milestone` para crear objetivo padre
3. `/jarvis:research-milestone` para abrir y documentar research
4. `/jarvis:plan-milestone` para crear phases + tasks
5. ejecutar/verificar por phase
6. `/jarvis:ship` para commit unico, push y PR

## Configuracion esperada

- MCP de Linear configurado
- (fallback API) variables:
  - `LINEAR_API_KEY`
  - `LINEAR_TEAM_ID`
  - `LINEAR_PROJECT_ID` (opcional)

## Estructura del proyecto

`/.specs` guarda la memoria y definiciones del sistema.

- `sessions/`: historial de contexto por conversacion
- `templates/session.md`: template de sesion

## Siguientes pasos para arrancar

1. Definir contrato tecnico de cada comando (`input/output`, errores, side effects).
2. Implementar `/jarvis:setup` y conexion MCP Linear.
3. Implementar `new-milestone -> research-milestone -> plan-milestone`.
4. Implementar ejecucion/verificacion por phase.
5. Implementar `ship` con PR template y salida markdown para copiar/pegar.

## Nota

Al finalizar cada comando, Jarvis debe sugerir los siguientes comandos posibles.
