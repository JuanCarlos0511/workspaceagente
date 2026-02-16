import requests
import os
from dotenv import load_dotenv

load_dotenv()

APP_ID = os.getenv('APP_ID')
APP_SECRET = os.getenv('APP_SECRET')
SHORT_TOKEN = os.getenv('SHORT_TOKEN')
PAGE_ID = os.getenv('PAGE_ID')

# 1. Intercambio por Token de larga duración
url_long = f"https://graph.facebook.com/v24.0/oauth/access_token?grant_type=fb_exchange_token&client_id={APP_ID}&client_secret={APP_SECRET}&fb_exchange_token={SHORT_TOKEN}"
response = requests.get(url_long).json()

token_final = response.get('access_token')

if token_final:
    print("-" * 30)
    print("¡TOKEN OBTENIDO CON ÉXITO!")
    print(token_final)
    print("-" * 30)
    
    # 2. VALIDACIÓN MULTIPLATAFORMA (FB + IG)
    # Pedimos el nombre de la página Y la cuenta de Instagram vinculada
    test_url = f"https://graph.facebook.com/v24.0/me?fields=name,instagram_business_account&access_token={token_final}"
    data = requests.get(test_url).json()
    
    print(f"Validado para la página: {data.get('name')}")
    
    ig_account = data.get('instagram_business_account')
    if ig_account:
        print(f"✅ INSTAGRAM DETECTADO. ID: {ig_account.get('id')}")
        print("\nCopia este ID en tu .env como: IG_ID=" + ig_account.get('id'))
    else:
        print("❌ INSTAGRAM NO DETECTADO. Verifica que esté vinculado a la página y que el token tenga permisos 'instagram_basic'.")
else:
    print(f"Error en el intercambio: {response}")