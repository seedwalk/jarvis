# Propuesta - Jarvis + Linear via MCP

## 1) Idea central

Jarvis es un GSD orientado a ejecucion en Linear.
El sistema de trabajo real vive en Linear; `.specs` queda como memoria y contexto.

Mapeo conceptual:

- Milestone = ticket padre en Linear
- Research de milestone = ticket hijo opcional
- Phase = ticket hijo del milestone
- Research de phase = ticket hijo opcional de la phase
- Plan task = subticket de cada phase

## 2) Se puede usar MCP de Linear?

Si. Es la opcion recomendada.

Ventajas:

- menos codigo custom al inicio
- herramientas de Linear accesibles directo por Jarvis
- mejor consistencia en creacion/edicion de issues

Arquitectura recomendada:

- MCP de Linear como via principal
- API directa de Linear como fallback

## 3) Flujo operativo

1. `/jarvis:new-milestone`
   - intake de objetivo
   - preguntas faltantes
   - crea ticket padre milestone
   - no crea research automaticamente

2. `/jarvis:research-milestone`
   - crea ticket `Spike/Research` si no existe
   - ejecuta research
   - agrega comentario estructurado de research

3. `/jarvis:plan-milestone`
   - convierte research en phases (tickets hijos)
   - crea subtickets task por phase
   - agrega DoD, dependencias y riesgos por phase

4. `/jarvis:research-phase <phase-id>` (opcional)
   - crea ticket `[RESEARCH][PHASE]` si no existe
   - guarda findings en el research ticket
   - deja resumen en comentario del ticket padre de phase

5. `/jarvis:execute-phase <phase-id>`
   - ejecuta tasks de la phase
   - actualiza estados
   - agrega summary de ejecucion en ticket padre de phase

6. `/jarvis:verify-phase <phase-id>`
   - corre checklist UAT/QA
   - agrega comentario `uat`
   - decide pass/fail

7. `/jarvis:close-phase <phase-id>`
   - cierra phase si cumple DoD
   - propone siguiente phase

8. `/jarvis:ship`
   - deja 1 commit final
   - push de branch
   - crea PR con template
   - imprime en terminal el body markdown en bloque de codigo para copiar/pegar

Regla UX:

- al terminar cualquier comando, Jarvis muestra "Comandos sugeridos".

Comando previo recomendado:

- `/jarvis:setup` para conectar MCP de Linear, validar permisos y guardar team/project por defecto.

## 4) Agentes sugeridos por etapa

- Intake agent: define alcance y gaps
- Research agents: investigacion en paralelo
- Planner agent: phases y tasks
- Checker agent: valida dependencias y DoD
- Executor agents: ejecutan tasks por waves
- Verifier/UAT agent: valida entregables
- Linear sync agent: escribe todo via MCP
- Ship agent: commit unico, push y PR

## 5) Datos minimos de configuracion

- `LINEAR_API_KEY` (para fallback API)
- `LINEAR_TEAM_ID`
- `LINEAR_PROJECT_ID` (opcional recomendado)
- estados base del workflow (Todo, In Progress, In Review, Done)

## 6) Convenciones de tickets

- Milestone parent: `[MILESTONE] <objetivo>`
- Milestone research (opcional): `[RESEARCH] Spike - <tema>`
- Phase child: `[PHASE N] <resultado esperado>`
- Phase research (opcional): `[RESEARCH][PHASE N] <tema>`
- Task sub-issue: `[TASK] <accion concreta>`

Cada phase debe tener:

- objetivo
- Definition of Done
- riesgos
- dependencias
- checklist de verificacion

## 7) Comentarios estandar

Research:

- contexto
- hallazgos clave
- alternativas
- recomendacion
- riesgos

UAT:

- que se verifico
- resultado por criterio
- evidencia
- decision (pass/fail)
- proximos pasos

## 8) Roadmap de implementacion

MVP:

- `setup`
- `new-milestone`, `research-milestone`, `plan-milestone`
- `research-phase` opcional
- sync a Linear via MCP
- sesiones locales en `.specs/sessions`

V2:

- `execute-phase`, `verify-phase`, `close-phase`
- comentarios research/uat automaticos

V3:

- `ship` completo con 1 commit por PR
- PR template + output markdown listo para copiar/pegar
- sugerencias inteligentes de siguiente comando

## 9) Instalacion en un repo

No hace falta que el repo sea publico.

Modos:

- local (recomendado): solo para el repo actual
- global: para todos tus repos

Comando objetivo cuando se publique Jarvis:

- local: `npx jarvis-cc@latest --opencode --local`
- global: `npx jarvis-cc@latest --opencode --global`

Mientras se desarrolla, usar bootstrap local del repo.
