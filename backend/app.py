from flask import Flask
from flask import request
import cohere


# app = Flask(__name__)

# @app.route('/', methods=['GET'])
# def test():
#     return("helloworld")

# if __name__ == '__main__':
#     app.run(debug=True)

import cohere
co = cohere.Client('YgLklAre1AZKzH8KUoFxPdi5JWohR2mkI6cN0a9Q') # This is your trial API key
response = co.generate(
  model='e6bce515-b238-4601-af86-a3d61091288e-ft',
  prompt='bubble tea, phone, laptop, keyboard')
print('Prediction: {}'.format(response.generations[0].text))