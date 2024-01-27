from ultralytics import YOLO

# Load a pretrained YOLOv8n model
model = YOLO('yolov8n.pt')

# Run inference on an image
results = model("bus_1.jpg")
# print(results)
# print(results)
for result in results:
    for c in result.boxes.cls:
        print(result.names[int(c)])