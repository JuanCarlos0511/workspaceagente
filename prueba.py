import requests
import os
from dotenv import load_dotenv

load_dotenv()

def auditar_token_profesional():
    # Necesitamos las credenciales de la App para auditar el token
    app_id = os.getenv('APP_ID')
    app_secret = os.getenv('APP_SECRET')
    token_a_verificar = os.getenv('PERM_TOKEN')
    
    # Creamos un Access Token de la App (App Access Token)
    app_token = f"{app_id}|{app_secret}"
    
    # Endpoint oficial de depuracion
    url = "https://graph.facebook.com/debug_token"
    params = {
        "input_token": token_a_verificar,
        "access_token": app_token
    }
    
    try:
        res = requests.get(url, params=params).json()
        data = res.get("data", {})
        
        print("--- AUDITORIA DE SEGURIDAD DEL TOKEN ---")
        print(f"Tipo de Token: {data.get('type')}")
        print(f"Aplicacion: {data.get('application')}")
        print(f"Valido: {data.get('is_valid')}")
        
        scopes = data.get("scopes", [])
        print("\nPermisos Activos (Scopes):")
        for s in scopes:
            check = "✅" if "instagram" in s or "pages" in s else "🔹"
            print(f"{check} {s}")
            
        print("-" * 40)
        if "instagram_content_publish" in scopes:
            print("RESULTADO: El token TIENE permiso para publicar en Instagram.")
        else:
            print("RESULTADO: ALERTA - Falta 'instagram_content_publish'.")
            
    except Exception as e:
        print(f"Error tecnico: {e}")

if __name__ == "__main__":
    auditar_token_profesional()