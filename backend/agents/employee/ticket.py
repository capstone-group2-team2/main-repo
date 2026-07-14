from dataclasses import dataclass


@dataclass
class Ticket:

    ticket_id: str

    employee_id: str

    message: str

    intent: str

    sentiment: str

    assigned_team: str

    priority: str

    status: str

    created_at: str

    updated_at: str

    resolved: bool