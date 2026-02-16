import sys
import argparse
import urllib.parse
from datetime import datetime, timedelta
from googleapiclient.discovery import build
from google.oauth2 import service_account

# --- CONFIGURACIÓN ---
SCOPES = ['https://www.googleapis.com/auth/calendar']
SERVICE_ACCOUNT_FILE = 'credentials.json'
CALENDAR_ID = 'jcguzman924324@gmail.com' 
TZ_OFFSET = "-06:00"

def get_service():
    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    return build('calendar', 'v3', credentials=creds)

def format_google_date(date_str, time_str):
    """Convierte fecha y hora al formato compacto YYYYMMDDTHHMMSS"""
    dt = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")
    return dt.strftime("%Y%m%dT%H%M%S")

def main():
    parser = argparse.ArgumentParser(description='Gestión total y Generador de Enlaces de Google Calendar')
    subparsers = parser.add_subparsers(dest='action', help='Acción a realizar')

    # --- Subcomando: GENERATE-LINK (Nuevo) ---
    parser_gen = subparsers.add_parser('generate-link', help='Generar enlace para crear evento manualmente')
    parser_gen.add_argument('--titulo', required=True)
    parser_gen.add_argument('--fecha', required=True, help='YYYY-MM-DD')
    parser_gen.add_argument('--hora', required=True, help='HH:MM')
    parser_gen.add_argument('--duracion', default=60, type=int)
    parser_gen.add_argument('--descripcion', default='')

    # Subcomando: LISTAR
    parser_list = subparsers.add_parser('list', help='Listar citas')
    parser_list.add_argument('--inicio', help='Fecha inicio (YYYY-MM-DD)')
    parser_list.add_argument('--fin', help='Fecha fin (YYYY-MM-DD)')
    parser_list.add_argument('--limit', default=20, type=int)

    # Subcomando: AGREGAR (Vía API)
    parser_add = subparsers.add_parser('add', help='Agendar nueva cita vía API')
    parser_add.add_argument('--titulo', required=True)
    parser_add.add_argument('--fecha', required=True) 
    parser_add.add_argument('--hora', required=True)  
    parser_add.add_argument('--duracion', default=60, type=int)
    parser_add.add_argument('--descripcion', default='')

    # Subcomando: EDITAR y BORRAR
    parser_edit = subparsers.add_parser('edit', help='Editar cita')
    parser_edit.add_argument('--id', required=True)
    parser_edit.add_argument('--titulo')
    parser_edit.add_argument('--descripcion')

    parser_del = subparsers.add_parser('delete', help='Borrar cita')
    parser_del.add_argument('--id', required=True)

    args = parser.parse_args()
    if not args.action:
        parser.print_help()
        return

    try:
        # Lógica para generar el enlace de plantilla (No requiere API)
        if args.action == 'generate-link':
            start_fmt = format_google_date(args.fecha, args.hora)
            
            # Calcular fin
            start_dt = datetime.strptime(f"{args.fecha} {args.hora}", "%Y-%m-%d %H:%M")
            end_dt = start_dt + timedelta(minutes=args.duracion)
            end_fmt = end_dt.strftime("%Y%m%dT%H%M%S")

            # Codificar textos
            titulo_enc = urllib.parse.quote(args.titulo)
            desc_enc = urllib.parse.quote(args.descripcion)
            
            # Construir URL
            base_url = "https://www.google.com/calendar/render?action=TEMPLATE"
            link = f"{base_url}&text={titulo_enc}&dates={start_fmt}/{end_fmt}&details={desc_enc}"

            print(f"\n--- ENLACE PARA PRE-CARGAR EVENTO ---")
            print(f"Copia y pega este enlace en tu navegador:\n")
            print(link)
            print(f"\n--------------------------------------\n")

        # Lógica que sí requiere la API de Google
        else:
            service = get_service()

            if args.action == 'list':
                if args.inicio and args.fin:
                    time_min = f"{args.inicio}T00:00:00{TZ_OFFSET}"
                    time_max = f"{args.fin}T23:59:59{TZ_OFFSET}"
                elif args.inicio:
                    time_min = f"{args.inicio}T00:00:00{TZ_OFFSET}"
                    time_max = f"{args.inicio}T23:59:59{TZ_OFFSET}"
                else:
                    time_min = datetime.utcnow().isoformat() + 'Z'
                    time_max = None

                events_result = service.events().list(
                    calendarId=CALENDAR_ID, timeMin=time_min, timeMax=time_max,
                    maxResults=args.limit, singleEvents=True, orderBy='startTime').execute()
                
                events = events_result.get('items', [])
                for event in events:
                    start = event['start'].get('dateTime', event['start'].get('date'))
                    print(f"ID: {event['id']} | {event.get('summary')} | {start}")

            elif args.action == 'add':
                start_time = datetime.strptime(f"{args.fecha} {args.hora}", "%Y-%m-%d %H:%M")
                end_time = start_time + timedelta(minutes=args.duracion)
                event = {
                    'summary': args.titulo,
                    'description': args.descripcion,
                    'start': {'dateTime': start_time.isoformat(), 'timeZone': 'America/Mexico_City'},
                    'end': {'dateTime': end_time.isoformat(), 'timeZone': 'America/Mexico_City'},
                }
                created = service.events().insert(calendarId=CALENDAR_ID, body=event).execute()
                print(f"Éxito: Cita creada vía API. ID: {created['id']}")

            elif args.action == 'edit':
                event = service.events().get(calendarId=CALENDAR_ID, eventId=args.id).execute()
                if args.titulo: event['summary'] = args.titulo
                if args.descripcion: event['description'] = args.descripcion
                service.events().update(calendarId=CALENDAR_ID, eventId=args.id, body=event).execute()
                print(f"Éxito: Cita {args.id} actualizada.")

            elif args.action == 'delete':
                service.events().delete(calendarId=CALENDAR_ID, eventId=args.id).execute()
                print(f"Éxito: Cita {args.id} eliminada.")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    main()