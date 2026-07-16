from agents.employee.employee_rag import AgentOutcome, EmployeeRAGService


class TechnicalAgent:
    """Handles technical employee requests via Employee Technical KB."""

    def __init__(self, rag_service: EmployeeRAGService | None = None):
        self.rag = rag_service or EmployeeRAGService()

    def handle(self, message: str) -> AgentOutcome:
        print("\n" + "=" * 70)
        print("🛠️  Technical Agent")
        print("=" * 70)

        result = self.rag.answer(
            query=message,
            category="technical",
            agent_label="Technical Support",
        )

        if result.found and result.answer:
            print(
                f"Answer found (score={result.score:.3f})"
                if result.score is not None
                else "Answer found"
            )
            return AgentOutcome(
                reply=result.answer,
                escalated=False,
                rag=result,
            )

        print("No suitable technical answer — escalating")
        return AgentOutcome(
            reply=(
                "I could not find a suitable answer in the technical knowledge base. "
                "Your request has been escalated to the Technical Team for human review."
            ),
            escalated=True,
            rag=result,
        )
