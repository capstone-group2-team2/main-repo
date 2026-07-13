import json
import os

TICKETS_FILE = "tickets.json"

def save_ticket(ticket):
    # تحميل التذاكر القديمة إذا وجدت
    if os.path.exists(TICKETS_FILE):
        with open(TICKETS_FILE, "r", encoding="utf-8") as f:
            try:
                tickets = json.load(f)
            except:
                tickets = []
    else:
        tickets = []

    # إضافة التذكرة الجديدة
    tickets.append(ticket)

    # حفظ الملف
    with open(TICKETS_FILE, "w", encoding="utf-8") as f:
        json.dump(tickets, f, ensure_ascii=False, indent=4)

def create_ticket(user_query, sentiment_score):
    # (نفس منطق الأولوية الذي اتفقنا عليه)
    priority = "High" if sentiment_score <= -0.5 else "Normal"
    
    ticket = {
        "description": user_query,
        "sentiment_score": sentiment_score,
        "priority": priority,
        "status": "Open"
    }
    
    save_ticket(ticket) # حفظ التذكرة في الملف
    return ticket