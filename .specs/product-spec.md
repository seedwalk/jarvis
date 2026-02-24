# Product Spec - Jarvis (Linear-first)

## 1) Resumen

Jarvis es un asistente personal para convertir ideas en ejecucion real.
El enfoque inicial es GSD sobre Linear: en lugar de planning/phases, trabaja con epicas, tickets y subtickets.

## 2) Objetivo de producto

Reducir friccion entre "se me ocurrio algo" y "ya esta en marcha con seguimiento".

Resultados esperados:

- capturar ideas rapido
- descomponer trabajo en unidades ejecutables
- mantener trazabilidad en sesiones
- cerrar PRs prolijos (1 commit por PR)

## 3) Usuario principal

Fundador/dev que quiere usar lenguaje natural para:

- planificar trabajo
- operarlo en Linear
- ejecutar cambios en codigo
- mantener memoria historica

## 4) Modelo mental de Jarvis

- Input libre del usuario
- Jarvis aclara lo minimo indispensable
- Propone plan accionable
- Lo aterriza en Linear
- Registra contexto en memoria local (`.specs/sessions`)

## 5) Entidades

- Epic: resultado de negocio o bloque funcional grande.
- Ticket: entregable verificable (idealmente 1-3 dias).
- Subticket: accion concreta (horas a 1 dia).
- Session: contexto conversacional con resumen y decisiones.

## 6) Flujo GSD -> Linear (milestone-driven)

1. Usuario ejecuta `/jarvis:new-milestone` y describe objetivo.
2. Jarvis hace preguntas faltantes (scope, deadline, metricas, restricciones).
3. Jarvis crea ticket padre de milestone en Linear.
4. Jarvis crea ticket hijo `Spike/Research` dentro de la milestone.
5. Jarvis ejecuta investigacion, guarda hallazgos y agrega comentario en el ticket de research.
6. Con ese research, Jarvis arma planning en fases.
7. Cada fase se crea como ticket hijo del milestone ("Phase 1", "Phase 2", etc.).
8. Cada fase tiene subtickets task (planes atomicos ejecutables).
9. Al ejecutar tareas, Jarvis publica resumen en el ticket padre de fase.
10. Jarvis agrega comentarios de `research` y `uat` cuando corresponde.

## 7) Comandos slash de OpenCode (MVP)

- `/jarvis:new-milestone`
  - intake guiado, crea milestone parent (sin research automatico).
- `/jarvis:setup`
  - configura MCP de Linear y valida acceso a team/proyecto.
- `/jarvis:research-milestone`
  - crea spike/research si falta, ejecuta research y comenta resultados en Linear.
- `/jarvis:research-phase <phase-id>`
  - research opcional por fase, con ticket dedicado y comentario en fase padre.
- `/jarvis:plan-milestone`
  - genera fases (tickets) y subtickets task por cada fase.
- `/jarvis:plan-phase <phase-id>`
  - refina una fase concreta en tasks ejecutables.
- `/jarvis:execute-phase <phase-id>`
  - ejecuta tasks de la fase y actualiza estado/comentarios.
- `/jarvis:verify-phase <phase-id>`
  - corre checklist UAT/QA, agrega comentario `uat` y decide pass/fail.
- `/jarvis:comment-research <issue-id>`
  - agrega o actualiza comentario de research en ticket indicado.
- `/jarvis:comment-uat <issue-id>`
  - agrega o actualiza comentario de verificacion/UAT.
- `/jarvis:close-phase <phase-id>`
  - cierra fase si cumple DoD y propone siguiente fase.
- `/jarvis:ship`
  - 1 commit final, push, PR con template y body markdown impreso para copiar/pegar.

Regla UX obligatoria:

- al terminar cualquier comando, Jarvis muestra "Comandos sugeridos" aplicables al siguiente paso.

## 8) Integracion con Linear

Configuracion minima:

- `LINEAR_API_KEY`
- `LINEAR_TEAM_ID`
- `LINEAR_PROJECT_ID` (opcional pero recomendado)

Setup esperado:

- `/jarvis:setup` conecta MCP, valida permisos y guarda configuracion local.

Reglas:

- toda propuesta debe mapear a artefactos reales en Linear
- cada sesion debe guardar links a issues/epics creados
- si ya existe ticket similar, priorizar actualizar en vez de duplicar
- estructura recomendada por milestone:
  - ticket padre: Milestone
  - ticket hijo opcional: Spike/Research (se crea con `research-milestone`)
  - tickets hijo de fase: Phase 1..N
  - ticket research por fase: opcional (se crea con `research-phase`)
  - subtickets por fase: task plans

## 9) Git/PR policy (working agreement)

Objetivo: cada PR debe quedar con historia limpia y facil de revisar.

Reglas:

1. Antes de abrir PR, Jarvis verifica commits contra base branch.
2. Si hay mas de 1 commit local no pusheado: squash automatico a 1 commit.
3. Si hay mas de 1 commit ya pusheado: pedir confirmacion para reescritura.
4. Push de branch y creacion de PR con template.
5. Mensaje de commit enfocado en el "por que".

## 10) Memoria y sesiones

Formato de sesion: `YYYY-MM-DD_HHMM_titulo-corto.md`

Cada sesion debe incluir:

- descripcion breve del contexto (2-3 lineas)
- objetivo
- decisiones
- links de Linear
- proximos pasos
- tags

## 11) Evolucion por fases

Fase 1 - Texto + Linear:

- sesiones locales
- creacion/sync de epics y tickets
- rutina diaria (`today`, `unblock`, `wrap`)

Fase 2 - Memoria estructurada:

- hechos, preferencias, pendientes, proyectos
- recuperacion automatica de contexto relevante

Fase 3 - Voz:

- STT (entrada)
- TTS (salida)
- modo manos libres

## 12) Criterios de exito

- de idea a ticket en menos de 2 minutos
- cada sesion cierra con proximos pasos claros
- busqueda historica por fecha/keyword en segundos
- PR creado con un solo commit listo para squash merge

## 13) No objetivos (por ahora)

- reemplazar Linear como sistema de registro
- automatizaciones sin confirmacion en acciones riesgosas
- multiusuario complejo o permisos granulares avanzados

## 14) Riesgos y mitigacion

- Riesgo: sobre-automatizar y crear ruido en Linear.
  - Mitigacion: modo preview antes de sync.
- Riesgo: duplicacion de issues.
  - Mitigacion: busqueda semantica/titulo similar previa.
- Riesgo: contexto pobre.
  - Mitigacion: checklists minimos por sesion.
