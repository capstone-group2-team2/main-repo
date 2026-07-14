from enum import Enum


# ==========================================================
# Sentiment
# ==========================================================

class Sentiment(str, Enum):
    POSITIVE = "positive"
    NEUTRAL = "neutral"
    NEGATIVE = "negative"


# ==========================================================
# Intent
# ==========================================================

class Intent(str, Enum):
    TECHNICAL = "technical"
    HR = "hr"


# ==========================================================
# Routing
# ==========================================================

class NextStep(str, Enum):
    TECHNICAL_AGENT = "technical_agent"
    HR_AGENT = "hr_agent"
    HUMAN_SUPPORT = "human_support"


# ==========================================================
# Priority
# ==========================================================

class Priority(str, Enum):
    NORMAL = "normal"
    URGENT = "urgent"


# ==========================================================
# Escalation Reason
# ==========================================================

class EscalationReason(str, Enum):
    NEGATIVE_SENTIMENT = "negative_sentiment"
    AGENT_FAILED = "agent_failed"