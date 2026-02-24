# Jarvis

Jarvis es un asistente personal orientado a ejecucion en **Linear**.
La idea es operar con flujo tipo GSD, pero mapeado a objetos reales de Linear:

- Milestone -> ticket padre
- Phase -> tickets hijo del milestone
- Task plan -> subtickets de cada phase
- Research -> tickets opcionales (milestone y/o phase)

## Que es `jarvis-cc`

`jarvis-cc` es el nombre del paquete npm/CLI instalador de Jarvis para OpenCode.
Es el comando que la gente usa para instalar los comandos `/jarvis-*` en su entorno.

## Instalacion

```bash
# En el repo actual
npx jarvis-cc@latest --opencode --local

# Global en tu maquina
npx jarvis-cc@latest --opencode --global
```

Desinstalar:

```bash
npx jarvis-cc@latest --opencode --local --uninstall
npx jarvis-cc@latest --opencode --global --uninstall
```

## Publicar en npm

```bash
npm login
npm publish --access public
```

Actualizar version:

```bash
npm version patch
git push --follow-tags
```

## Estado actual

Ya incluye un MVP de comandos para OpenCode en `.opencode/commands/jarvis/`.
La base funcional y de producto vive en:

- `/.specs/vision.md`
- `/.specs/product-spec.md`
- `/.specs/propuesta.md`

## Como usar en este repo

1. Abri OpenCode en este repo.
2. Ejecuta `/jarvis-setup`.
3. Segui el flujo milestone -> research -> plan -> execute -> verify -> ship.

Nota de naming:

- En OpenCode los comandos quedaron como `/jarvis-...`.
- Equivalen a tu naming conceptual `/jarvis:...`.

## Objetivo del MVP

Implementar comandos slash para OpenCode que permitan:

- crear milestone
- hacer research
- planificar por phases
- ejecutar y verificar phases
- cerrar con flujo de ship (1 commit + PR)

## Comandos disponibles

- `/jarvis-help`
- `/jarvis-setup`
- `/jarvis-new-milestone`
- `/jarvis-research-milestone`
- `/jarvis-plan-milestone`
- `/jarvis-research-phase <phase-id>`
- `/jarvis-execute-phase <phase-id>`
- `/jarvis-verify-phase <phase-id>`
- `/jarvis-close-phase <phase-id>`
- `/jarvis-ship`

## Flujo recomendado

1. `/jarvis-setup` para conectar MCP de Linear
2. `/jarvis-new-milestone` para crear objetivo padre
3. `/jarvis-research-milestone` para abrir y documentar research
4. `/jarvis-plan-milestone` para crear phases + tasks
5. ejecutar/verificar por phase
6. `/jarvis-ship` para commit unico, push y PR

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

## Estructura tecnica agregada

- `.opencode/commands/jarvis/*.md`: comandos slash de Jarvis
- `bin/install.js`: instalador CLI para npm (`jarvis-cc`)
- `package.json`: metadata/publicacion del paquete
- `.jarvis/config.example.json`: ejemplo de configuracion local
- `.github/pull_request_template.md`: template base para `jarvis-ship`

## Proximos pasos

1. Conectar acciones reales de Linear por MCP en cada comando.
2. Agregar fallback API de Linear con `LINEAR_API_KEY`.
3. Versionar instalador (`npx jarvis-cc`) para usarlo en cualquier repo.

## Nota

Al finalizar cada comando, Jarvis debe sugerir los siguientes comandos posibles.

## Documentacion con Docusaurus + GitHub Pages

- Sitio: `docs-site/`
- Workflow de deploy: `.github/workflows/deploy-docs.yml`

Comandos locales:

```bash
cd docs-site
npm install
npm run start
```

Para publicar en GitHub Pages:

1. En GitHub, habilitar Pages con `Source: GitHub Actions`.
2. Hacer push a `main` con cambios en `docs-site/**`.
3. El workflow `Deploy Docs` construye y publica automaticamente.
