from pathlib import Path
import joblib
import torch
import torch.nn.functional as F

from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
)

# ==================================================
# Paths
# ==================================================

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "SentimentModel"

# ==================================================
# Device
# ==================================================

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print(f"Using device: {device}")

# ==================================================
# Load Components
# ==================================================

print("Loading tokenizer...")
tokenizer = AutoTokenizer.from_pretrained(str(MODEL_PATH))

print("Loading model...")
model = AutoModelForSequenceClassification.from_pretrained(str(MODEL_PATH))
model.to(device)
model.eval()

print("Loading label encoder...")
label_encoder = joblib.load(MODEL_PATH / "label_encoder.pkl")

print("Everything loaded successfully!\n")

def predict_sentiment(text: str):

    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        max_length=128
    )

    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        outputs = model(**inputs)

    probabilities = F.softmax(outputs.logits, dim=-1)[0]

    predicted_index = torch.argmax(probabilities).item()

    predicted_label = str(
        label_encoder.inverse_transform([predicted_index])[0]
    )

    confidence = float(probabilities[predicted_index])

    scores = {
        str(label): round(float(prob), 4)
        for label, prob in zip(
            label_encoder.classes_,
            probabilities.cpu().numpy()
        )
    }

    return {
        "text": text,
        "prediction": predicted_label,
        "confidence": round(confidence, 4),
        "scores": scores
    }

if __name__ == "__main__":

    result = predict_sentiment(
        "المكان حلو ومرتب بس المعاملة سيئة"
    )

    print(result)