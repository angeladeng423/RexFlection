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
        images_data = request.files.getlist('image')
        results = []
        global_dict = {}

        for i, image_data in enumerate(images_data):
            objects = yolor.recognize(image_data.read())
            output_descr = co.generate(
                model='command',
                prompt='Given a dictionary of everyday objects and their quantity for example {1: bus, 4: people} extracted from a photo, give a story-like description, do not use key words that aren\'t in the dictionary or do not assume anything that isn\'t already given in the dictionary. Do not give expression of people if they are in image. Don\'t start with \"this is a picture\" rather begin story telling right away, do not use first or second person, give short summary . Example output would have keywords: city, busy, etc. Now try for ' + str(objects),
                max_tokens=300,
                temperature=0.9,
                k=0,
                stop_sequences=[],
                return_likelihoods='NONE'
            )
            for j in objects:
              if j in global_dict:
                  global_dict[j] += 1
              else:
                  global_dict[j] = 1

            generations_dict = {'text': output_descr.generations[0].text}
            result = {'image_index': i, 'prediction': generations_dict}
            results.append(result)
        output_wrapped = co.generate(
                model='command',
                prompt='Given a dictionary of everyday objects and their quantity for example {1: bus, 5: people, 1 bowl, 1 sandwich, 1 dining table, 3 plates} extracted from multiple photos, generate something similar to spotify wrapped like statistics except usingthe statistics given in the list of dictionaries. now try giving the spotify wrapped like statistics for the list ' + str(global_dict) + ' exclude the last part asking for feedback',
                max_tokens=300,
                temperature=0.9,
                k=0,
                stop_sequences=[],
                return_likelihoods='NONE'
            )
        generations_dict = {'text': output_wrapped.generations[0].text}
        result = {'image_index': i+1, 'wrapped': generations_dict}
        results.append(result)

        return jsonify({'results': results})

    except Exception as e:
        return jsonify({'error': str(e)})
