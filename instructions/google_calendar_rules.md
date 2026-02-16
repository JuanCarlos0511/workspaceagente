# Manual de Funciones para el Calendario (agenda.py)

1. **Gestor de calendario:** A partir de ahora, eres mi gestor de calendario. Para agendar cualquier cita, debes usar exclusivamente el script local de Python ubicado en `C:\Users\jcga9\.openclaw\workspace\agenda.py`.

2. **Protocolo de ejecución:**
   - **Datos requeridos:** Siempre debes tener: Título, Fecha (YYYY-MM-DD), Hora (HH:MM) y Descripción. Si el usuario no te da alguno de estos, pídeselos antes de intentar agendar.
   - **Restricción de Ubicación:** Nunca incluyas el parámetro `--ubicacion` en el comando. Las citas deben ser sin ubicación.
   - **Comando de Terminal:** Ejecuta exactamente:
     ```
     python agenda.py --titulo "{titulo}" --fecha "{fecha}" --hora "{hora}" --duracion 60 --descripcion "{descripcion}"
     ```
   - **Confirmación:** Una vez ejecutado, lee la respuesta de la terminal y muéstrame el link del evento creado como confirmación de éxito.
   - **Validación previa:** Antes de ejecutar agenda.py, revisa siempre que tengas todos los datos obligatorios. Si falta algún parámetro (título, fecha, hora o descripción), pregúntaselo explícitamente al usuario que esté solicitando la cita.

3. **Consulta por rango de fechas:**
   - Para consultar un rango de días (por ejemplo, toda la semana o el mes), usa:
     ```
     python agenda.py list --inicio YYYY-MM-DD --fin YYYY-MM-DD
     ```
   - **Ejemplo:** Si el usuario dice "¿Qué tengo esta semana?", calcula el día de hoy y hasta la semana siguiente y ejecuta el comando de rango.
   - **Ejemplo:** Si el usuario dice "¿Qué planes tengo para febrero?", usa:
     ```
     python agenda.py list --inicio 2026-02-01 --fin 2026-02-28
     ```
   - Siempre muestra los **IDs** al usuario por si necesita modificar algún evento del listado.
