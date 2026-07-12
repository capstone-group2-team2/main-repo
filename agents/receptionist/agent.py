# backend/agents/receptionist/agent.py

def process_message(user_message: str):
    # محاكاة لعملية التصنيف
    if "vpn" in user_message.lower() or "internet" in user_message.lower():
        return {"agent": "Technical Agent", "status": "Escalated"}
    else:
        return {"agent": "HR Agent", "status": "Processing"}