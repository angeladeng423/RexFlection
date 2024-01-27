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
        # Make a request to the Google Photos API to list the albums
        response = requests.get(google_photos_albums_endpoint, headers=headers)
        response.raise_for_status()  # Raise an error for bad status codes

        # The list of albums is in the 'albums' field of the response
        albums = response.json().get('albums', [])
        
        # If you need to access a specific album, you'll need the album ID.
        # Here we just return the list of albums.
        return jsonify({'album_id': albums[0]['id']})
    
    except requests.RequestException as e:
        # Handle request exceptions (like network errors)
        return jsonify({'error': str(e)}), e.response.status_code

    except Exception as e:
        # Handle other exceptions
        return jsonify({'error': 'An error occurred'}), 500

@app.route('/api/getAlbumItems', methods=['POST'])
def albumItems():
    data = request.get_json()
    token = data.get('token')
    album_id = data.get('album_id')

    if not token or not album_id:
        return jsonify({'error': 'Token or album ID missing.'}), 400

    google_photos_items_endpoint = f'https://photoslibrary.googleapis.com/v1/albums/{album_id}/mediaItems'

    headers = {
        'Authorization': f'Bearer {token}',
        'Content-type': 'application/json'
    }

    try:
        # Make a request to the Google Photos API to list the media items in the specified album
        response = requests.get(google_photos_items_endpoint, headers=headers)
        response.raise_for_status()

        # Extract URLs of the photos from the response
        items = response.json().get('mediaItems', [])
        photo_urls = [item['baseUrl'] for item in items]

        return jsonify({'photo_urls': photo_urls}), 200

    except requests.RequestException as e:
        # Handle request exceptions (like network errors)
        return jsonify({'error': str(e)}), e.response.status_code

    except Exception as e:
        # Handle other exceptions
        return jsonify({'error': 'An error occurred'}), 500


if __name__ == '__main__':
    app.run(debug=True)
