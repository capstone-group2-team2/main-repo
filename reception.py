from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from datetime import datetime
import httpx
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Reception Agent API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
INTENT_CLASSIFIER_URL = "http://127.0.0.1:8001/classify"


class CustomerMessage(BaseModel):
    customer_id: str = Field(..., min_length=1)
    message: str = Field(..., min_length=1, max_length=2000)


class ReceptionResponse(BaseModel):
    customer_id: str
    message: str
    timestamp: str
    status: str
    intent: str
    confidence: float


@app.get("/healthz")
def healthz():
    return {"status": "ok"}


@app.get("/readyz")
async def readyz():
    try:
        async with httpx.AsyncClient() as client:
            r = await client.get("http://127.0.0.1:8001/healthz", timeout=3)
        if r.status_code != 200:
            raise HTTPException(
                status_code=503,
                detail={"dependency": "intent_classifier", "status": "unreachable"}
            )
    except httpx.RequestError:
        raise HTTPException(
            status_code=503,
            detail={"dependency": "intent_classifier", "status": "unreachable"}
        )
    return {"status": "ready"}


@app.post("/reception", response_model=ReceptionResponse)
async def reception_agent(data: CustomerMessage) -> ReceptionResponse:
    cleaned_message = data.message.strip()

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                INTENT_CLASSIFIER_URL,
                json={"customer_id": data.customer_id, "message": cleaned_message},
                timeout=10
            )
            response.raise_for_status()
            classifier_result = response.json()
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"Intent Classifier unreachable: {str(e)}")
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=502, detail=f"Intent Classifier error: {str(e)}")

    return ReceptionResponse(
        customer_id=data.customer_id,
        message=cleaned_message,
        timestamp=datetime.now().isoformat(),
        status="processed",
        intent=classifier_result["intent"],
        confidence=classifier_result["confidence"]
    )