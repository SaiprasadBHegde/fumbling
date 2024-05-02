from flask import Flask, render_template, request, jsonify
import os
import librosa
import numpy as np
from keras.models import load_model

app = Flask(__name__)

# Specify the path to the pre-trained model (.h5 file)
MODEL_PATH = './Backend/cnn_model.h5'

# Load the pre-trained model
model = load_model(MODEL_PATH)

# Function to extract MFCC features from audio file
def extract_features(file_path, mfcc_dim=13):
    audio, sr = librosa.load(file_path, sr=None)  # Load audio file
    mfccs = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=mfcc_dim)  # Extract MFCC features
    # Pad or truncate the features to match the expected shape
    mfccs = librosa.util.fix_length(mfccs,2584)
    return mfccs

@app.route('/')
def index():
    return render_template('check.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'})

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'})

        if file:
            # Save the uploaded file
            file_path = os.path.join('uploads', file.filename)
            file.save(file_path)

            # Extract features
            features = extract_features(file_path)
            # Reshape features to match model input shape
            features = np.expand_dims(features, axis=0)
            features = np.expand_dims(features, axis=-1)  # Add channel dimension

            # Make prediction
            prediction = model.predict(features)
            result = "Fumbling detected" if prediction[0][0] > 0.5 else "No fumbling detected"

            return jsonify({'result': result})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
