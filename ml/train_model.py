import os

import joblib
import pandas as pd

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
)


# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "training_data.csv")
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "vectorizer.pkl")


# Load dataset
df = pd.read_csv(DATASET_PATH)

X = df["text"]
y = df["label"]


# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.30,
    random_state=42,
    stratify=y,
)


# TF-IDF feature extraction
vectorizer = TfidfVectorizer(
    lowercase=True,
    ngram_range=(1, 2),
    max_features=5000,
)

X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)


# Train classifier
classifier = LogisticRegression(
    max_iter=1000,
    random_state=42,
)

classifier.fit(X_train_tfidf, y_train)


# Predictions
predictions = classifier.predict(X_test_tfidf)


# Evaluation
accuracy = accuracy_score(y_test, predictions)

print("\n=== ML Classifier Results ===")
print(f"Accuracy: {accuracy:.2%}")

print("\nClassification Report:")
print(
    classification_report(
        y_test,
        predictions,
        target_names=["Safe", "Malicious"],
        zero_division=0,
    )
)

print("Confusion Matrix:")
print(confusion_matrix(y_test, predictions))


# Save trained model and vectorizer
joblib.dump(classifier, MODEL_PATH)
joblib.dump(vectorizer, VECTORIZER_PATH)

print("\n=== Model Saved ===")
print(f"Model: {MODEL_PATH}")
print(f"Vectorizer: {VECTORIZER_PATH}")