from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

# Import new APIs here!
from app.api.yolo_api import yolo_api, echo_api
from app.api.cohere_api import cohere_api

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Register the YOLO API Blueprint
app.register_blueprint(yolo_api, url_prefix='/api')
app.register_blueprint(echo_api, url_prefix='/api')
app.register_blueprint(cohere_api, url_prefix='/api')

# Simple GET API endpoint
@app.route('/api/greet', methods=['GET'])
def greet():
    return jsonify({'message': 'Hello from the POST API!'})

@app.route('/api/sendToken', methods=['POST'])
def receive_token():
    data = request.get_json()
    token = data.get('token')
    print('Received token:', token)

    return jsonify({'message': 'Token received successfully!'})

@app.route('/api/getAlbumID', methods=['POST'])
def accessImages():
    data = request.get_json()
    token = data.get('token')

    if not token:
        return jsonify({'error': 'No token.'}), 400
    
    google_photos_albums_endpoint = 'https://photoslibrary.googleapis.com/v1/albums'
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-type': 'application/json'
    }

    try:
        response = requests.get(google_photos_albums_endpoint, headers=headers)
        response.raise_for_status()

        albums = response.json().get('albums', [])
        
        return jsonify({'album_id': albums[0]['id']})
    
    except requests.RequestException as e:
        return jsonify({'error': str(e)}), e.response.status_code

    except Exception as e:
        return jsonify({'error': 'An error occurred'}), 500

@app.route('/api/getAlbumItems', methods=['POST'])
def getAlbumItems():
    data = request.get_json()
    token = data.get('token')
    album_id = data.get('album_id')

    if not token or not album_id:
        return jsonify({'error': 'Token or album ID missing.'}), 400

    # Endpoint to search for media items in an album
    search_endpoint = 'https://photoslibrary.googleapis.com/v1/mediaItems:search'

    headers = {
        'Authorization': f'Bearer {token}',
        'Content-type': 'application/json'
    }

    # The body of the POST request should contain the album ID
    payload = {
        'albumId': album_id,
        'pageSize': 50
    }

    try:
        # Make a POST request to search media items in the album
        response = requests.post(search_endpoint, headers=headers, json=payload)
        response.raise_for_status()  # Raises an HTTPError if the HTTP request returned an unsuccessful status code

        # Extract URLs of the photos from the response
        items = response.json().get('mediaItems', [])
        photo_uris = [item['baseUrl'] for item in items]

        return jsonify({'photo_uris': photo_uris}), 200

    except requests.RequestException as e:
        # Handle request exceptions (like network errors)
        return jsonify({'error': str(e)}), e.response.status_code

    except Exception as e:
        # Handle other exceptions
        return jsonify({'error': 'An error occurred'}), 500

if __name__ == '__main__':
    app.run(debug=True)