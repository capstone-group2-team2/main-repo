from pathlib import Path

import joblib
import torch
import torch.nn.functional as F

from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
)


class SentimentService:

    def __init__(self):

        # ==================================================
        # Paths
        # ==================================================

        self.BASE_DIR = Path(__file__).resolve().parents[3]
        self.MODEL_PATH = self.BASE_DIR / "models" / "SentimentModel"

        # ==================================================
        # Device
        # ==================================================

        self.device = torch.device(
            "cuda" if torch.cuda.is_available() else "cpu"
        )

        print(f"Using device: {self.device}")

        # ==================================================
        # Load Components
        # ==================================================

        print("Loading tokenizer...")
        self.tokenizer = AutoTokenizer.from_pretrained(
            str(self.MODEL_PATH)
        )

        print("Loading model...")
        self.model = AutoModelForSequenceClassification.from_pretrained(
            str(self.MODEL_PATH)
        )

        self.model.to(self.device)
        self.model.eval()

        print("Loading label encoder...")
        self.label_encoder = joblib.load(
            self.MODEL_PATH / "label_encoder.pkl"
        )

        print("Sentiment Model Loaded Successfully!\n")

    def predict(self, text: str):

        inputs = self.tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            max_length=128,
        )

        inputs = {
            k: v.to(self.device)
            for k, v in inputs.items()
        }

        with torch.no_grad():
            outputs = self.model(**inputs)

        probabilities = F.softmax(
            outputs.logits,
            dim=-1
        )[0]

        predicted_index = torch.argmax(
            probabilities
        ).item()

        predicted_label = str(
            self.label_encoder.inverse_transform(
                [predicted_index]
            )[0]
        )

        confidence = float(
            probabilities[predicted_index]
        )

        scores = {
            str(label): round(float(prob), 4)
            for label, prob in zip(
                self.label_encoder.classes_,
                probabilities.cpu().numpy(),
            )
        }

        return {
            "text": text,
            "prediction": predicted_label,
            "confidence": round(confidence, 4),
            "scores": scores,
        }