from flask import Blueprint, request, jsonify
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
        image_data = request.files['image'].read()
        objects = yolor.recognize(image_data)
        return jsonify(objects)

    except Exception as e:
        return jsonify(error=str(e))
    
# Testing Purposes
@echo_api.route('/echo', methods=['POST'])
def echo():
    try:
        data = request.get_json()
        message = data.get('message', 'No message provided')
        return jsonify({'echoed_message': message})
    except Exception as e:
        return jsonify(error=str(e))

