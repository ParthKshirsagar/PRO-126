from flask import Flask, jsonify, request
from classifier import get_prediction

app = Flask(__name__)

@app.route('/')
def hello():
    return "HELLO WORLD!"

@app.route('/predict-alphabets', methods=["POST"])
def predict_data():
    image = request.files.get("digit")
    prediction = get_prediction(image)
    return jsonify({ "Prediction": prediction }), 200

if(__name__ == "__main__"):
    app.run(debug=True)