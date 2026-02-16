import requests
import os
from dotenv import load_dotenv

load_dotenv()

def publicar_imagen_local(nombre_archivo, mensaje):
    """
    Sube una imagen almacenada en el workspace local a Facebook.
    """
    token = os.getenv('PERM_TOKEN')
    page_id = os.getenv('PAGE_ID') # ID: 61587526305874
    home_dir = os.path.expanduser("~") 
    
    # Construimos la ruta absoluta hacia la carpeta de imágenes
    ruta_base = os.path.join(home_dir, ".openclaw", "workspace", "images")
    ruta_completa = os.path.join(ruta_base, nombre_archivo)

    # Depuración: Para que veas en consola dónde busca realmente
    print(f"Buscando archivo en: {ruta_completa}")

    if not os.path.exists(ruta_completa):
        return {"error": f"El archivo no existe en la ruta: {ruta_completa}"}

    url_endpoint = f"https://graph.facebook.com/v24.0/{page_id}/photos"

    try:
        # Abrimos el archivo en modo binario ('rb')
        with open(ruta_completa, 'rb') as img_file:
            payload = {
                'caption': mensaje,
                'access_token': token
            }
            files = {
                'source': img_file  # Aquí enviamos el archivo real
            }
            
            response = requests.post(url_endpoint, data=payload, files=files)
            return response.json()
            
    except Exception as e:
        return {"error": str(e)}
