import requests
import os
import time
import sys
import json
from dotenv import load_dotenv

# Asegurar compatibilidad de caracteres en Windows
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

load_dotenv()

def publicar_con_trazabilidad(nombre_archivo, mensaje):
    # --- CONFIGURACIÓN DE CREDENCIALES ---
    IMGBB_KEY = os.getenv('IMGBB_API_KEY')
    TOKEN = os.getenv('PERM_TOKEN')
    IG_ID = os.getenv('IG_ID')
    VERSION = "v24.0"
    
    home_dir = os.path.expanduser("~")
    ruta_imagen = os.path.join(home_dir, ".openclaw", "workspace", "images", nombre_archivo)

    print("\n" + "="*60)
    print("SISTEMA DE MONITOREO DE PETICIONES")
    print("="*60)

    # --- PASO 1: SUBIDA A IMGBB ---
    print(f"\n[PASO 1] Solicitando subida a imgBB")
    url_imgbb = "https://api.imgbb.com/1/upload"
    payload_imgbb = {"key": IMGBB_KEY}
    
    print(f" > RUTA: {url_imgbb}")
    print(f" > PARÁMETROS: {{'key': '{IMGBB_KEY[:5]}...', 'image': '{nombre_archivo}'}}")
    
    try:
        with open(ruta_imagen, "rb") as file:
            response = requests.post(url_imgbb, data=payload_imgbb, files={"image": file})
            res_json = response.json()
            
        url_publica = res_json.get("data", {}).get("url")
        if not url_publica:
            return f"Error en imgBB: {res_json}"
        print(f" > ÉXITO: URL pública generada -> {url_publica}")

    except Exception as e:
        return f"Excepción en Paso 1: {str(e)}"

    # --- PASO 2: CREAR CONTENEDOR EN INSTAGRAM ---
    print(f"\n[PASO 2] Creando Media Container en Instagram")
    url_container = f"https://graph.facebook.com/{VERSION}/{IG_ID}/media"
    params_cont = {
        'image_url': url_publica,
        'caption': mensaje,
        'access_token': TOKEN
    }
    
    print(f" > RUTA: {url_container}")
    print(f" > PARÁMETROS ENVIADOS (Query String):")
    print(json.dumps(params_cont, indent=4))
    
    res_ig_cont = requests.post(url_container, params=params_cont).json()
    creation_id = res_ig_cont.get('id')
    
    if not creation_id:
        return f"Error en Paso 2: {res_ig_cont}"
    print(f" > ÉXITO: Container ID obtenido -> {creation_id}")

    # --- PASO 3: POLLING DE ESTADO ---
    print(f"\n[PASO 3] Consultando estado del procesamiento")
    url_status = f"https://graph.facebook.com/{VERSION}/{creation_id}"
    params_status = {'fields': 'status_code', 'access_token': TOKEN}
    
    print(f" > RUTA: {url_status}")
    print(f" > PARÁMETROS: {{'fields': 'status_code'}}")
    
    intentos = 0
    while intentos < 6:
        status_res = requests.get(url_status, params=params_status).json()
        estado = status_res.get('status_code')
        print(f"    [T+{intentos*10}s] Estado actual: {estado}")
        
        if estado == 'FINISHED':
            break
        elif estado == 'ERROR':
            return f"Error de procesamiento: {status_res}"
        
        time.sleep(10)
        intentos += 1

    # --- PASO 4: PUBLICACIÓN FINAL ---
    print(f"\n[PASO 4] Ejecutando comando de publicación final")
    url_publish = f"https://graph.facebook.com/{VERSION}/{IG_ID}/media_publish"
    params_publish = {
        'creation_id': creation_id,
        'access_token': TOKEN
    }
    
    print(f" > RUTA: {url_publish}")
    print(f" > PARÁMETROS ENVIADOS:")
    print(json.dumps(params_publish, indent=4))
    
    res_final = requests.post(url_publish, params=params_publish).json()

    print("\n" + "="*60)
    if "id" in res_final:
        return f"RESULTADO FINAL: Éxito. Post ID: {res_final['id']}"
    return f"RESULTADO FINAL: Fallo. Respuesta: {res_final}"

if __name__ == "__main__":
    # Prueba con tu archivo local
    resultado = publicar_con_trazabilidad("messi.jpg", "Publicación con logs detallados 🤖")
    print(resultado)
