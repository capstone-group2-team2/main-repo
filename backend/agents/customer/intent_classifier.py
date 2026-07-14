from fastapi import FastAPI
from pydantic import BaseModel, Field
from datetime import datetime
from transformers import pipeline
import nest_asyncio
import uvicorn
import threading
import os
nest_asyncio.apply()

app = FastAPI(
    title="Intent Classifier API",
    description="يصنف رسالة العميل إلى support أو sales باستخدام نموذج DistilBERT مدرّب"
)


BASE_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "..")
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "IntentClassifierModel"
)

print("MODEL_PATH =", MODEL_PATH)
print("EXISTS =", os.path.exists(MODEL_PATH))

classifier = pipeline(
    "text-classification",
    model=MODEL_PATH
)
class IntentRequest(BaseModel):
    customer_id: str = Field(..., min_length=1)
    message: str = Field(..., min_length=1, max_length=2000)


class IntentResponse(BaseModel):
    customer_id: str
    message: str
    intent: str
    confidence: float
    timestamp: str


@app.get("/")
def home():
    return {"message": "Intent Classifier is running"}


@app.get("/healthz")
def healthz():
    return {"status": "ok"}


@app.post("/classify", response_model=IntentResponse)
def classify(data: IntentRequest) -> IntentResponse:
    result = classifier(data.message)[0]

    return IntentResponse(
        customer_id=data.customer_id,
        message=data.message,
        intent=result["label"],
        confidence=round(result["score"], 3),
        timestamp=datetime.now().isoformat()
    )


if __name__ == "__main__":
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8001,
        reload=False
    )