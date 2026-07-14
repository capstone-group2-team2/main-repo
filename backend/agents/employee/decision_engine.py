from agents.employee.routing import RoutingDecision


class DecisionEngine:

    def decide(self, intent_result, sentiment_result):

        print("=" * 70)
        print("🟨 Decision Engine")
        print("=" * 70)

        print(f"Intent      : {intent_result.intent.upper()}")
        print(f"Sentiment   : {sentiment_result['prediction'].upper()}")

        print()

        # ==========================================
        # Business Rules
        # ==========================================

        if (
            sentiment_result["prediction"] == "negative"
            and sentiment_result["confidence"] >= 0.85
        ):

            decision = RoutingDecision(

                destination="human_ticket",

                reason="negative_sentiment",

                priority="URGENT",

                assigned_team="Technical Team",

                status="OPEN",
            )

        elif intent_result.intent == "technical":

            decision = RoutingDecision(

                destination="technical_agent",

                reason="technical_intent",

                priority="NORMAL",

                assigned_team="Technical Team",

                status="IN_PROGRESS",
            )

        elif intent_result.intent == "hr":

            decision = RoutingDecision(

                destination="hr_agent",

                reason="hr_intent",

                priority="NORMAL",

                assigned_team="HR Team",

                status="IN_PROGRESS",
            )

        else:

            decision = RoutingDecision(

                destination="human_ticket",

                reason="unknown_intent",

                priority="URGENT",

                assigned_team="Support Team",

                status="OPEN",
            )

        # ==========================================

        print("Decision")
        print("-" * 70)

        print(f"Destination : {decision.destination}")
        print(f"Priority    : {decision.priority}")
        print(f"Team        : {decision.assigned_team}")
        print(f"Status      : {decision.status}")
        print(f"Reason      : {decision.reason}")

        return decision