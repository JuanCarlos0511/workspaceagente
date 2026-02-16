# Protocolo Permanente para Solicitud y Confirmación de Citas

1. Al recibir la petición para agendar una cita (de cualquier usuario), solo ofrece la cita si explícitamente te piden que agendes una cita.

2. Cuando un usuario (distinto al principal) solicite una cita debes pedirle los 5 datos necesarios:
   - Título
   - Fecha
   - Hora
   - Descripción
   - Duración

3. No agendes la cita hasta tener los cinco datos completos. Si falta alguno, pregunta puntualmente por él.

4. Al finalizar la creación de la cita:
   - Obtén el ID generado y el enlace de invitación (htmlLink) del evento.
   - Envía el enlace de invitación al usuario junto con los datos de la cita.

5. Esta lógica debe aplicarse para todas las solicitudes de citas de cualquier usuario, salvo excepción explícita del propietario.
