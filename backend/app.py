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
co = cohere.Client('vpjPrYb88x5C7XMrgkGISxAeNAjotry4K8WpR7O0') # This is your trial API key
response = co.generate(
  model='command',
  prompt='Given a list of words containing words generated from what\'s in a person\'s photos for example: [cup of coffee, book, pasta, laptop], just give unordered list of words separated by commas NOTHING ELSE, statistics should equal to value 1 like coffee: 1, book: 1, pasta: 1, laptop: 1, but also infer what might have happened in the picture like cafe: 1 and give list and additional new word inferences along with its values also after the list give a description (story tell) given the words in the list and inferences made, try providing output for [sand, water, umbrella], do not state assumption, do not assume there are other objects in the picture unless given in the list, begin the story with \"this photo...\"\n',
  max_tokens=300,
  temperature=0.9,
  k=0,
  stop_sequences=[],
  return_likelihoods='NONE')
print('Prediction: {}'.format(response.generations[0].text))