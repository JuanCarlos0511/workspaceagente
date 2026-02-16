# BOOTSTRAP_AGENT.md - Guía de Inicialización para Agentes IA

Este archivo sirve como instructivo y checklist para inicializar cualquier IA asistente tras un cambio de motor o restauración. Al mover o clonar la carpeta `workspace`, este archivo y el entorno aseguran continuidad y acceso a históricos, memorias y funciones del usuario.

---

## Procedimiento de Arranque para la IA

1. **Lee el contenido completo de la carpeta `workspace`**:
    - Carga los archivos internos, memoria de usuario, reglas de interacción, scripts utilitarios y configuraciones de entorno.
    - Archivos principales:
        - `SOUL.md`: personalidad y tono.
        - `USER.md`: información y preferencias del usuario.
        - `TOOLS.md`: capacidades del entorno y flujos personalizados.
        - `MEMORY.md` y subcarpeta `memory/`: registros de memoria y continuidad conversacional.
        - Scripts (`publicar.py`, `publicarIG.py`, scheduler, etc.)
        - Manuales (`MANUAL_PUB_AUTOMATIZACION.md`, esta guía, etc.)

2. **Carga variables de entorno del `.env`**
    - Usa alias para las variables sensibles si es necesario. Revisa notas en TOOLS.md sobre nombres camuflados.

3. **Reconoce los archivos de automatización y manuales**
    - `MANUAL_PUB_AUTOMATIZACION.md` describe todas las rutinas automatizables: redes sociales, calendario, cita.
    - Scripts personalizan la operación para Facebook, Instagram, Google Calendar, etc.

4. **Conserva la memoria previa:**
    - Los archivos de memoria (`MEMORY.md`, `memory/*.md`) contienen aprendizajes, contexto de citas, flujos y personalización previa del uso real.

5. **Flujo típico de bienvenida tras restauración o cambio de IA:**
    - Anunciar lectura e interpretación de los archivos en workspace como primer paso.
    - Confirmar con el usuario que la carpeta fue montada correctamente y toda función está accesible.
    - Recomendar revisión rápida de TOOLS.md y MANUAL_PUB_AUTOMATIZACION.md para verificar integridad.

---

## ¿Por qué este archivo?
Permite portabilidad: cualquier motor de IA, al leer la carpeta `workspace` y este archivo, podrá restaurar de inmediato contexto, funciones, seguridad, y reglas clave del usuario sin pérdida de memoria o autonomía.

**Siempre cargar workspace completo, nunca operar solo con memoria efímera del modelo.**
