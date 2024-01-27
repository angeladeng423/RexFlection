from ultralytics import YOLO
import cv2

model = YOLO('yolov8n.pt')

results = model.predict('test_images/bus.jpg', show=True)

objects = {}

for r in results:
    for c in r.boxes.cls:
        object = r.names[int(c)]
        if object not in objects:
            objects[object] = 1
        else:
            objects[object] += 1

    print(r.boxes.conf)
    print(r.boxes.cls)
    print(objects)
