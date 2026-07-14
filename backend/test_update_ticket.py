from services.storage.firestore_service import FirestoreService

firestore = FirestoreService()

ticket_id = input("Ticket ID: ")

firestore.update_ticket_status(
    ticket_id,
    "IN_PROGRESS",
)

firestore.update_ticket_status(
    ticket_id,
    "CLOSED",
)