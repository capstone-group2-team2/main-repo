from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agents.employee.reception_agent import ReceptionAgent

app = FastAPI(title="Employee Reception API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

agent = ReceptionAgent()


class EmployeeRequest(BaseModel):
    employee_id: str
    message: str


@app.get("/healthz")
def healthz():
    return {"status": "ok"}


@app.post("/reception")
def reception(request: EmployeeRequest):

    result = agent.receive(
        employee_id=request.employee_id,
        message=request.message,
    )

    ticket = result["ticket"]

    reply = result.get("reply")
    if not reply:
        # Fallback only if Reception omitted a reply
        reply = (
            f"A ticket ({ticket.ticket_id}) has been created and assigned to "
            f"{result['assigned_team']}."
        )

    return {
        "ticket_id": ticket.ticket_id,

        "intent": result["intent"],
        "intent_confidence": result["intent_confidence"],

        "sentiment": result["sentiment"],
        "sentiment_confidence": result["sentiment_confidence"],

        "priority": result["priority"],
        "assigned_team": result["assigned_team"],
        "status": result["status"],

        "decision": result["decision"],

        "reply": reply,
    }
