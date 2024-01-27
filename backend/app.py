from flask import Flask
from flask import request
import cohere


# app = Flask(__name__)

# @app.route('/', methods=['GET'])
# def test():
#     return("helloworld")

# if __name__ == '__main__':
#     app.run(debug=True)

co = cohere.Client('YgLklAre1AZKzH8KUoFxPdi5JWohR2mkI6cN0a9Q')

response = co.generate(
  prompt='Please explain to me how LLMs work',
)
print(response)


response1 = co.chat(
  chat_history=[
    {"role": "USER", "message": "Who discovered gravity?"},
    {"role": "CHATBOT", "message": "The man who is widely credited with discovering gravity is Sir Isaac Newton"}
  ],
  message="What year was he born?",
  # perform web search before answering the question. You can also use your own custom connector.
  connectors=[{"id": "web-search"}]
)
print(response1)