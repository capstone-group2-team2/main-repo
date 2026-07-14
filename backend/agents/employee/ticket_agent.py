from agents.employee.ticket import Ticket
from services.storage.firestore_service import FirestoreService

from datetime import datetime
import uuid

class TicketAgent:

    def __init__(self):
        self.firestore = FirestoreService()

    def create_ticket(
        self,
        employee_id: str,
        message: str,
        intent: str,
        sentiment: str,
        decision: str,
    ) -> Ticket:

        ticket = Ticket(

            ticket_id=f"TK-{uuid.uuid4().hex[:8].upper()}",

            employee_id=employee_id,

            message=message,

            intent=intent,

            sentiment=sentiment,

            priority=decision.priority,

            assigned_team=decision.assigned_team,

            status=decision.status,

            created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),

            updated_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),

            resolved=False
        )

        print("\n" + "=" * 70)
        print("🎫 Ticket Agent")
        print("=" * 70)

        print(f"Ticket ID      : {ticket.ticket_id}")
        print(f"Employee ID    : {ticket.employee_id}")
        print(f"Assigned Team  : {ticket.assigned_team}")
        print(f"Priority       : {ticket.priority}")
        print(f"Status         : {ticket.status}")
        print(f"Intent         : {ticket.intent.upper()}")
        print(f"Sentiment      : {ticket.sentiment.upper()}")
        print(f"Created At     : {ticket.created_at}")
        print(f"Updated At     : {ticket.updated_at}")
        print(f"Resolved       : {ticket.resolved}")

        print("\n" + "-" * 70)
        print("Message")
        print("-" * 70)

        print(ticket.message)

        self.firestore.save_ticket(ticket)

        return ticket