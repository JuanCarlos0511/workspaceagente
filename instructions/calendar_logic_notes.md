# Notas de lógica para gestión de calendario

- Para años no bisiestos, febrero tiene 28 días. Si el usuario solicita eventos del mes, asegúrate de ajustar el rango a 2026-02-28 (no incluir el 29 de febrero en años no bisiestos).

- Siempre valida el año al calcular rangos automáticos para meses, semanas, etc.

- Ante errores de rango por días inexistentes, informa al usuario y sugiere el rango correcto.
