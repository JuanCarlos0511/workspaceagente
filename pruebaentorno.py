import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Forzar salida UTF-8 para evitar errores de consola en Windows
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

def inspeccionar_entorno():
    print("="*50)
    print("SISTEMA DE AUDITORÍA DE VARIABLES DE ENTORNO")
    print("="*50)

    # 1. Información del Sistema de Archivos
    cwd = os.getcwd()
    print(f"\n[Ruta Actual]: {cwd}")
    
    # 2. Localización del archivo .env
    # Intentamos cargar desde la ruta actual y desde la ruta absoluta del workspace
    ruta_especifica = Path.home() / ".openclaw" / "workspace" / ".env"
    
    print(f"[Buscando .env en]: {ruta_especifica}")
    if ruta_especifica.exists():
        print(" > RESULTADO: Archivo .env ENCONTRADO en ruta absoluta.")
        load_dotenv(dotenv_path=ruta_especifica)
    else:
        print(" > RESULTADO: Archivo .env NO ENCONTRADO en ruta absoluta. Intentando carga local...")
        load_dotenv()

    # 3. Impresión de Variables Críticas
    # Extraemos las variables que has estado usando en tus scripts
    variables = [
        "PERM_TOKEN",
        "IG_ID",
        "IMGBB_API_KEY",
        "APP_ID",
        "APP_SECRET"
    ]

    print("\n[Valores Cargados]:")
    for var in variables:
        valor = os.getenv(var)
        if valor:
            # Mostramos los primeros 10 caracteres por seguridad pero confirmamos que existe
            print(f" ✅ {var:<15}: {valor[:10]}... (Longitud: {len(valor)})")
        else:
            print(f" ❌ {var:<15}: VACÍO / NO ENCONTRADO")

    print("\n" + "="*50)

if __name__ == "__main__":
    inspeccionar_entorno()