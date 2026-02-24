# Vision de Jarvis

## Proposito

Crear un asistente personal que te ayude con tareas abiertas (ideas, decisiones, seguimiento, ejecucion tecnica).

## Principios

1. Flexible: sirve para "lo que se te ocurra".
2. Contextual: cada conversacion nace en un contexto nuevo y claro.
3. Memoria util: cada contexto deja un resumen corto para recuperacion historica.
4. Evolutivo: arrancar por texto y luego sumar voz (STT + TTS).

## Alcance inicial (MVP)

- Conversaciones por contexto con identificador unico.
- Registro de cada sesion con:
  - fecha/hora
  - descripcion breve
  - objetivo
  - decisiones
  - proximos pasos
- Busqueda simple en historico por fecha y palabras clave.

## Roadmap

### Fase 1 - Base textual

- Crear/gestionar sesiones.
- Guardar resumentes por sesion.
- Recuperar contexto historico rapido.

### Fase 2 - Memoria estructurada

- Definir scaffolding de memoria (hechos, preferencias, pendientes, proyectos).
- Reutilizar memoria relevante al abrir nuevas sesiones.

### Fase 3 - Voz

- Speech-to-text para entrada.
- Text-to-speech para salida.
- Modo manos libres para uso diario.

## Criterios de exito

- Encontrar una sesion anterior en segundos.
- Continuar un tema viejo con minimo roce.
- Reducir friccion para capturar y ejecutar ideas.
