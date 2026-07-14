from dataclasses import dataclass


@dataclass
class RoutingDecision:

    destination: str

    reason: str

    priority: str

    assigned_team: str

    status: str