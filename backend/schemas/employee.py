from typing import Literal

from pydantic import BaseModel, Field


# ==========================================================
# Request from Frontend
# ==========================================================

class EmployeeRequest(BaseModel):
    employee_id: str = Field(..., description="Employee unique ID")
    message: str = Field(..., min_length=1, description="Employee message")


# ==========================================================
# Output of Intent + Sentiment Analysis
# ==========================================================

class AnalysisResult(BaseModel):
    employee_id: str
    message: str

    intent: str
    intent_confidence: float

    sentiment: Literal["positive", "neutral", "negative"]
    sentiment_confidence: float


# ==========================================================
# Decision Engine Output
# ==========================================================

class RoutingDecision(BaseModel):

    next_step: Literal[
        "technical_agent",
        "hr_agent",
        "human_support"
    ]

    priority: Literal[
        "normal",
        "urgent"
    ]

    escalation_reason: str | None = None