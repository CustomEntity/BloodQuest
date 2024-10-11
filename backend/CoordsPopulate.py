import json
import requests

# Fonction pour charger le fichier JSON
def load_data(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)

def main():
    # URL de votre instance Directus
    directus_url = 'https://bloodquest.fr'
    email = 'admin@example.com'
    password = 'd1r3ctu5'
    
    # Se connecter à Directus pour obtenir un token
    auth_response = requests.post(f'{directus_url}/auth/login', json={'email': email, 'password': password}, verify=False)
    print('Auth response:', auth_response.json())  # Vérifiez la réponse d'authentification
    
    token = auth_response.json().get('data', {}).get('access_token')

    if not token:
        print("Échec de l'authentification")
        return

    # Charger les données depuis le fichier JSON
    data = load_data('points_de_collecte.json')
    print('Loaded data:', data)  # Vérifiez le contenu des données
    
    headers = {'Authorization': f'Bearer {token}'}

    for item in data:
        # Vérification des types
        try:
            latitude = float(item["Latitude"])
            longitude = float(item["Longitude"])
        except (ValueError, TypeError):
            print(f"Invalid coordinates for item: {item}")
            continue  # Passer à l'élément suivant si la conversion échoue

        # Mapper les données de votre JSON aux champs de la collection Directus
        directus_data = {
            "CodePostal": item["CodePostal"],
            "FullAddress": item["FullAddress"],
            "coords": {                    # Créer la structure Coords
                "type": "Point",          # Type de la géométrie
                "coordinates": [          # Liste des coordonnées
                    float(longitude),     # Longitude, convertie en float
                    float(latitude)       # Latitude, convertie en float
                ]
            },
            "Name": item["Name"],
            "City": item["City"],
            "Address1": item["Address1"],
            "Address2": item["Address2"],
        }

        # Envoyer les données à la collection `points_de_collecte`
        response = requests.post(f'{directus_url}/items/points_de_collecte', headers=headers, json=directus_data, verify=False)
        
        # Imprimer la réponse pour le débogage
        print(f'Inserted: {directus_data["Name"]}, Response: {response.json()}')

    print('All data inserted successfully.')

# Exécuter la fonction principale
if __name__ == '__main__':
    main()
