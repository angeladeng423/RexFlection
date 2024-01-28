from flask import Blueprint, request, jsonify
import requests
from ..modules.recognizer import YOLORecognizer
from ultralytics import YOLO
import cv2
import numpy as np

yolo_api = Blueprint('yolo_api', __name__)
echo_api = Blueprint('echo_api', __name__)

yolor = YOLORecognizer()

@yolo_api.route('/recognize_objects', methods=['POST'])
def recognize_objects():
    try:
        # Get the image URL from the request data
        image_url = request.json.get('image_url')
        
        # Fetch the image from the URL
        response = requests.get(image_url)
        
        # Check if the request was successful
        if response.status_code != 200:
            return jsonify(error="Failed to fetch image from URL"), 400
        
        # Read the image data
        image_data = response.content
        
        # Process the image data with your recognizer
        objects = yolor.recognize(image_data)
        return jsonify(objects)

    except Exception as e:
        return jsonify(error=str(e)), 500
    

# Testing Purposes
@echo_api.route('/echo', methods=['POST'])
def echo():
    try:
        data = request.get_json()
        message = data.get('message', 'No message provided')
        return jsonify({'echoed_message': message})
    except Exception as e:
        return jsonify(error=str(e))

