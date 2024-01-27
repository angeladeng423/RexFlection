from ultralytics import YOLO
import cv2
import numpy as np

class YOLORecognizer:
    def __init__(self, model_path='yolov8n.pt'):
        self.model = YOLO(model_path)

    def recognize(self, image_data):
        nparr = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        results = self.model.predict(img, show=False)
        
        objects = {}
        for r in results:
            for c in r.boxes.cls:
                object_name = r.names[int(c)]
                if object_name not in objects:
                    objects[object_name] = 1
                else:
                    objects[object_name] += 1

        return objects
