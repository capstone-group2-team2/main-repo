from pathlib import Path
import joblib

from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
)

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "SentimentModel"

print("=" * 50)
print("Model Path:")
print(MODEL_PATH)

print("=" * 50)
print("Loading tokenizer...")
tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)

print("✅ Tokenizer loaded")

print("=" * 50)
print("Loading model...")
model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)

print("✅ Model loaded")

print("=" * 50)
print("Loading Label Encoder...")
label_encoder = joblib.load(MODEL_PATH / "label_encoder.pkl")

print("✅ Label Encoder loaded")

print("=" * 50)
print(label_encoder.classes_)