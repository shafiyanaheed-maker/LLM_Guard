import os

import joblib


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "vectorizer.pkl")


# Load the trained model and TF-IDF vectorizer
model = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)


def detect_ml_threat(prompt: str):
    """
    Classify a prompt as safe or malicious using the trained ML model.

    Returns:
        is_malicious: bool
        confidence: float
        label: str
    """

    features = vectorizer.transform([prompt])

    prediction = model.predict(features)[0]
    probabilities = model.predict_proba(features)[0]

    confidence = float(max(probabilities))

    is_malicious = bool(prediction == 1)

    label = "Malicious" if is_malicious else "Safe"

    return is_malicious, confidence, label