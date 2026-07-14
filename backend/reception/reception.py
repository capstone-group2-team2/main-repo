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
SALES_AGENT_URL       = "http://127.0.0.1:8002/sales"
SUPPORT_AGENT_URL     = "http://127.0.0.1:8003/support"


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
    reply: str


@app.get("/healthz")
def healthz():
    return {"status": "ok"}
@app.get("/readyz")
def readyz():
    return {"status": "ready"}

@app.post("/reception", response_model=ReceptionResponse)
async def reception_agent(data: CustomerMessage) -> ReceptionResponse:
    cleaned_message = data.message.strip()

    async with httpx.AsyncClient() as client:
       
        try:
            classify_response = await client.post(
                INTENT_CLASSIFIER_URL,
                json={"customer_id": data.customer_id, "message": cleaned_message},
                timeout=10
            )
            classify_response.raise_for_status()
            classifier_result = classify_response.json()
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"Intent Classifier unreachable: {str(e)}")

        intent = classifier_result["intent"]
        confidence = classifier_result["confidence"]

       
        if intent == "sales":
            try:
                sales_response = await client.post(
                    SALES_AGENT_URL,
                    json={"customer_id": data.customer_id, "message": cleaned_message},
                    timeout=10
                )
                sales_response.raise_for_status()
                sales_result = sales_response.json()
                reply = sales_result["reply"]
            except httpx.RequestError as e:
                raise HTTPException(status_code=503, detail=f"Sales Agent unreachable: {str(e)}")
        else:
            try:
                support_response = await client.post(
                    SUPPORT_AGENT_URL,
                    json={"customer_id": data.customer_id, "message": cleaned_message},
                    timeout=10
                )
                support_response.raise_for_status()
                support_result = support_response.json()
                reply = support_result["reply"]
            except httpx.RequestError as e:
                raise HTTPException(status_code=503, detail=f"Support Agent unreachable: {str(e)}")

    return ReceptionResponse(
        customer_id=data.customer_id,
        message=cleaned_message,
        timestamp=datetime.now().isoformat(),
        status="processed",
        intent=intent,
        confidence=confidence,
        reply=reply
    )