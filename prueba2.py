import os
from dotenv import load_dotenv

# Intentamos cargar el archivo
load_dotenv()

print("--- DIAGNÓSTICO DE VARIABLES ---")
token = os.getenv('LONG_TOKEN')
ig_id = os.getenv('IG_ID')

if token is None:
    print("ERROR: 'LONG_TOKEN' no encontrado. Revisa el nombre en el archivo .env")
else:
    print(f"LONG_TOKEN encontrado: {token[:10]}... (longitud: {len(token)})")

if ig_id is None:
    print("ERROR: 'IG_ID' no encontrado.")
else:
    print(f"IG_ID encontrado: {ig_id}")

# Verificamos dónde está buscando el archivo
print(f"\nBuscando archivo .env en: {os.getcwd()}")
if os.path.exists(".env"):
    print("El archivo .env SI existe en esta carpeta.")
else:
    print("ALERTA: No se encuentra el archivo .env en esta carpeta.")