from pathlib import Path
from datetime import datetime

import firebase_admin
from firebase_admin import credentials, firestore


class FirestoreService:

    def __init__(self):

        if not firebase_admin._apps:

            base_dir = Path(__file__).resolve().parents[2]

            cred = credentials.Certificate(
                base_dir / "firebase" / "serviceAccountKey.json"
            )

            firebase_admin.initialize_app(cred)

        self.db = firestore.client()

    def save_ticket(self, ticket):

        self.db.collection("tickets").document(
            ticket.ticket_id
        ).set(ticket.__dict__)

        print("\n✅ Ticket saved to Firestore successfully!")
    
    def update_ticket_status(self, ticket_id: str, status: str):

        self.db.collection("tickets").document(ticket_id).update({

            "status": status,

            "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),

        })

        print(f"✅ Ticket {ticket_id} updated to {status}")
    
    