from agents.employee.reception_agent import ReceptionAgent

agent = ReceptionAgent()

ticket = agent.receive(
    employee_id="EMP001",
    message="بدي اجازه بشكل مستعجل"
)
