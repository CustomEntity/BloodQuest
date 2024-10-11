import pandas as pd
import requests
import time
import json
from concurrent.futures import ThreadPoolExecutor, as_completed

# Configuration de Directus
DIRECTUS_URL = "https://bloodquest.fr"
DIRECTUS_EMAIL = "admin@example.com"
DIRECTUS_PASSWORD = "d1r3ctu5"

# Fonction pour obtenir un token d'accès
def get_access_token():
    auth_url = f"{DIRECTUS_URL}/auth/login"
    auth_data = {
        "email": DIRECTUS_EMAIL,
        "password": DIRECTUS_PASSWORD
    }
    response = requests.post(auth_url, json=auth_data, verify=False)
    if response.status_code == 200:
        return response.json()['data']['access_token']
    else:
        raise Exception("Échec de l'authentification à Directus")

# Fonction pour traiter un code postal
def process_postal_code(code_postal, headers, user_latitude, user_longitude):
    print(f"Traitement du code postal: {code_postal}")

    if not isinstance(code_postal, str) or not code_postal.isdigit():
        print(f"Code postal invalide: {code_postal}. Ignoré.")
        return

    url = f"https://oudonner.api.efs.sante.fr/carto-api/v3/samplingcollection/searchbypostcode?PostCode={code_postal}&UserLatitude={user_latitude}&UserLongitude={user_longitude}"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        if not data.get('samplingLocationCollections'):
            print(f"Aucun point de collecte trouvé pour le code postal {code_postal}.")
            return

        for location in data.get('samplingLocationCollections', []):
            # Créer le point de collecte
            collection_point_data = {
                "address": location.get('address2'),
                "city": location.get('city'),
                "postal_code": code_postal,
                "coordinates": {
                    "type": "Point",
                    "coordinates": [float(location.get('longitude')), float(location.get('latitude'))]
                },
                "full_address": location.get('fullAddress'),
                "name": location.get('name')
            }
            response = requests.post(f"{DIRECTUS_URL}/items/collections_points", headers=headers,
                                     json=collection_point_data, verify=False)
            if response.status_code == 200:
                collection_point = response.json()['data']

                # Créer les rendez-vous pour ce point de collecte
                for collection in location.get('collections', []):
                    appointment_data = {
                        "collection_point": collection_point['id'],
                        "date": collection.get('date'),
                        "start_time": collection.get('morningStartTime') or collection.get('afternoonStartTime'),
                        "end_time": collection.get('morningEndTime') or collection.get('afternoonEndTime'),
                        "nature": collection.get('nature')
                    }
                    requests.post(f"{DIRECTUS_URL}/items/collection_point_appointments", headers=headers,
                                  json=appointment_data, verify=False)
            else:
                print(f"Erreur lors de la création du point de collecte: {response.status_code}")

        print(f"Données ajoutées pour le code postal {code_postal}: {len(data['samplingLocationCollections'])} points de collecte.")
    else:
        print(f"Erreur lors de la récupération des données pour le code postal {code_postal}: {response.status_code}")

# Obtenir le token d'accès
access_token = get_access_token()

# Headers pour les requêtes à Directus
headers = {
    "Authorization": f"Bearer {access_token}",
    "Content-Type": "application/json"
}

# Lire le fichier CSV pour extraire les codes postaux
df = pd.read_csv('insee.csv', sep=';', encoding='latin1')
codes_postaux = df['Codepos'].dropna().unique()

# Coordonnées utilisateur
user_latitude = 20
user_longitude = 20

# Créer un pool de threads
with ThreadPoolExecutor(max_workers=10) as executor:  # Limite à 10 threads pour éviter la surcharge
    futures = [executor.submit(process_postal_code, code_postal, headers, user_latitude, user_longitude) for code_postal in codes_postaux]

    for future in as_completed(futures):
        try:
            future.result()  # Récupérer les résultats pour capturer les erreurs éventuelles
        except Exception as e:
            print(f"Erreur lors du traitement: {e}")

print("Traitement terminé. Données ajoutées à Directus.")
