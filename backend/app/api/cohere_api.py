from flask import Blueprint, request, jsonify
import os
import cohere
from ..modules.recognizer import YOLORecognizer

yolor = YOLORecognizer()

cohere_api = Blueprint('cohere_api', __name__)

os.environ['COHERE_API_KEY'] = 'vpjPrYb88x5C7XMrgkGISxAeNAjotry4K8WpR7O0'
cohere_api_key = os.getenv('COHERE_API_KEY')

co = cohere.Client(cohere_api_key)

@cohere_api.route('/cohere', methods=['POST'])
def cohere_route():

    try:
        image_data = request.files['image'].read()
        objects = yolor.recognize(image_data)

        response = co.generate(
            model='command', 
            prompt='Given a dictionary of everyday objects and their quantity for example {1: bus, 4: people} extracted from a photo, give a story-like description, do not use key words that aren\'t in the dictionary or do not assume anything that isn\'t already given in the dictionary. Do not give expression of people if they are in image. Don\'t start with \"this is a picture\" rather begin story telling right away, do not use first or second person, give short summary . Example output would have keywords: city, busy, etc. Now try for ' + str(objects),
            max_tokens=300,
            temperature=0.9,
            k=0,
            stop_sequences=[],
            return_likelihoods='NONE')

        return jsonify({'prediction': response.generations[0].text})

    except Exception as e:
        return jsonify(error=str(e))

