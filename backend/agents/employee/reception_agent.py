from agents.employee.decision_engine import DecisionEngine

from services.intent.service import IntentService
from services.sentiment.service import SentimentService

from agents.employee.ticket_agent import TicketAgent

class ReceptionAgent:

    def __init__(self):

        self.intent_service = IntentService()

        self.sentiment_service = SentimentService()

        self.decision_engine = DecisionEngine()

        self.ticket_agent = TicketAgent()

    def receive(self, employee_id: str, message: str):

        print("\n" + "=" * 70)
        print("🟦 Reception Agent")
        print("=" * 70)

        print(f"Employee ID : {employee_id}")
        print(f"Message     : {message}")

        print("\nRunning services...")

        # -----------------------------
        # Intent
        # -----------------------------

        intent_result = self.intent_service.classify(message)

        # -----------------------------
        # Sentiment
        # -----------------------------

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

        # -----------------------------
        # Decision Engine
        # -----------------------------

        decision = self.decision_engine.decide(
            intent_result,
            sentiment_result,
        )
        rag_response = None

        ticket = self.ticket_agent.create_ticket(
            employee_id=employee_id,
            message=message,
            intent=intent_result.intent,
            sentiment=sentiment_result["prediction"],
            decision=decision,
        )

        return ticket