# Nuevas Reglas de Operación para Recordatorios y Confirmaciones

## Almacenamiento de Reglas
Este protocolo regula el funcionamiento de alertas, notificaciones y confirmaciones para eventos agendados. Todas las reglas se almacenan en este archivo.

## Creación de Alertas (Confirmación 24h antes)
- Cada vez que se agenda una cita mediante `agenda.py add`, debes crear automáticamente una tarea programada en Windows para la confirmación del evento.
- El comando a ejecutar será:
  
  schtasks /create /tn "Confirmacion_Cita_{id_evento}" /tr "python c:\ruta\a\tu\script\notificar.py --msg 'Mañana tienes la cita: {titulo}. ¿Confirmas?'" /sc once /st {hora_alerta} /sd {fecha_alerta} /Z
  
  - El parámetro `/Z` garantiza que, si la PC estaba apagada, Windows ejecute la tarea apenas al encender.
  - `{hora_alerta}` y `{fecha_alerta}` deben ser calculados para que la alerta llegue 24h antes de la cita (o según se indique).
  - Reemplaza las variables por los datos propios del evento.

## Script de Notificación
- Se debe crear un script llamado `notificar.py` que reciba un mensaje como argumento y lo muestre al usuario:

```python
import argparse
import ctypes
parser = argparse.ArgumentParser()
parser.add_argument('--msg', required=True)
args = parser.parse_args()
# Lanza popup en Windows
ctypes.windll.user32.MessageBoxW(0, args.msg, "Recordatorio de Cita", 0x40 | 0x1)
# También puede lanzar un print para ser capturado por OpenClaw u otros hooks
print(f"NOTIFICACIÓN_BOT: {args.msg}")
```

- Opcional: Este script puede ser extendido para disparar una petición web/API a OpenClaw (webhook) o a otro bot para máximo control.

## Resumen para el cliente
- El usuario no debe hacer nada manualmente. El sistema agendador crea, en automático, la "alarma".
- Si la PC está apagada en el momento de la alarma, Windows ejecuta la tarea apenas el equipo se encienda.
- Para enviar la alerta de vuelta al bot, `notificar.py` puede imprimir, lanzar una notificación nativa, o usar un webhook.
