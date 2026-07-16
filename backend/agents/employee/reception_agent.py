from agents.employee.decision_engine import DecisionEngine
from agents.employee.hr_agent import HRAgent
from agents.employee.routing import RoutingDecision
from agents.employee.technical_agent import TechnicalAgent
from agents.employee.ticket_agent import TicketAgent
from agents.employee.employee_rag import EmployeeRAGService

from services.intent.service import IntentService
from services.sentiment.service import SentimentService


class ReceptionAgent:

    def __init__(self):
        self.intent_service = IntentService()
        self.sentiment_service = SentimentService()
        self.decision_engine = DecisionEngine()
        self.ticket_agent = TicketAgent()

        # Shared Employee FAISS / embedding stack
        self.rag_service = EmployeeRAGService()
        self.technical_agent = TechnicalAgent(self.rag_service)
        self.hr_agent = HRAgent(self.rag_service)

    def receive(self, employee_id: str, message: str):

        print("\n" + "=" * 70)
        print("🟦 Reception Agent")
        print("=" * 70)

        print(f"Employee ID : {employee_id}")
        print(f"Message     : {message}")

        print("\nRunning services...")

        intent_result = self.intent_service.classify(message)
        sentiment_result = self.sentiment_service.predict(message)

        print("\n" + "-" * 70)
        print("Intent Classification")
        print("-" * 70)

        print(f"Intent      : {intent_result.intent.upper()}")
        print(f"Confidence  : {intent_result.confidence:.2%}")

        print("\n" + "-" * 70)
        print("Sentiment Analysis")
        print("-" * 70)

        print(f"Sentiment   : {sentiment_result['prediction'].upper()}")
        print(f"Confidence  : {sentiment_result['confidence']:.2%}")

        print("\nScores:")

        for label, score in sentiment_result["scores"].items():
            print(f"  {label.capitalize():10} : {score:.2%}")

        print("\nForwarding results to Decision Engine...\n")

        decision = self.decision_engine.decide(
            intent_result,
            sentiment_result,
        )

        reply, decision = self._route(message, decision)

        ticket = self.ticket_agent.create_ticket(
            employee_id=employee_id,
            message=message,
            intent=intent_result.intent,
            sentiment=sentiment_result["prediction"],
            decision=decision,
        )

        return {
            "ticket": ticket,
            "intent": intent_result.intent,
            "intent_confidence": intent_result.confidence,
            "sentiment": sentiment_result["prediction"],
            "sentiment_confidence": sentiment_result["confidence"],
            "decision": decision.destination,
            "assigned_team": decision.assigned_team,
            "priority": decision.priority,
            "status": decision.status,
            "reply": reply,
        }

    def _route(self, message: str, decision: RoutingDecision):
        """Dispatch to domain agents or escalate immediately."""

        if decision.destination == "technical_agent":
            outcome = self.technical_agent.handle(message)
            if outcome.escalated:
                decision = RoutingDecision(
                    destination="human_ticket",
                    reason="technical_rag_no_answer",
                    priority="URGENT",
                    assigned_team=decision.assigned_team,
                    status="OPEN",
                )
            return outcome.reply, decision

        if decision.destination == "hr_agent":
            outcome = self.hr_agent.handle(message)
            if outcome.escalated:
                decision = RoutingDecision(
                    destination="human_ticket",
                    reason="hr_rag_no_answer",
                    priority="URGENT",
                    assigned_team=decision.assigned_team,
                    status="OPEN",
                )
            return outcome.reply, decision

        # human_ticket — skip RAG
        reply = (
            "Your request requires manual review and has been escalated to a human agent. "
            f"It has been assigned to the {decision.assigned_team}."
        )
        return reply, decision
