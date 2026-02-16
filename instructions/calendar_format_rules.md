# Reglas de Presentación para Citas y Calendario

1. Al mostrar citas agendadas al usuario, utiliza siempre un formato simple y cotidiano:
   - Fecha y hora
   - Título
   - Descripción (inclúyela solo si hay contenido relevante)

2. No incluir ID en la presentación de citas, salvo que el usuario lo solicite explícitamente.

3. Al agendar una cita:
   - Si el usuario no menciona explícitamente una descripción, usa un guion "-" como texto por defecto en ese campo.
   - Si el usuario da una instrucción que combina título y detalle (por ejemplo: "Cita de mi veterinario para la vacunación de mi perro"), interpreta y separa la información adecuadamente: extrae un título corto y claro ("Cita Veterinario"), y utiliza el resto como descripción ("Vacuna de mi perro").
   - Si el usuario desea que la descripción permanezca vacía, confirma que así lo desea antes de agendar.

4. Si el usuario pide ver sus eventos para un rango de fechas, usa el comando:
   ```
   python agenda.py list --inicio YYYY-MM-DD --fin YYYY-MM-DD
   ```

5. Cuando el usuario pregunte por la semana o el mes, calcula el rango automáticamente y usa siempre el formato simple de presentación.

6. Cada vez que muestres una lista de citas, no incluyas detalles innecesarios; mantén todo claro y cotidiano.

7. Si necesitas agregar otra regla de presentación según las preferencias del usuario, guárdala aquí.
