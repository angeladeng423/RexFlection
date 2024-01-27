from flask import Flask, jsonify
from flask_cors import CORS

# Import new APIs here!
from app.api.yolo_api import yolo_api, echo_api

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Register the YOLO API Blueprint
app.register_blueprint(yolo_api, url_prefix='/api')
app.register_blueprint(echo_api, url_prefix='/api')

# Simple GET API endpoint
@app.route('/api/greet', methods=['POST'])
def greet():
    return jsonify({'message': 'Hello from the POST API!'})

if __name__ == '__main__':
    app.run(debug=True)
