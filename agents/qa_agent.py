# backend/agents/qa_agent.py

def validate_response(response_text):
    # هنا يمكنك إضافة منطق الـ LLM الخاص بك للتحقق من الجودة
    # مثال بسيط: التأكد من أن الإجابة ليست قصيرة جداً أو تحتوي على كلمات غير لائقة
    if len(response_text) < 10:
        return False, "Response too short"
    
    print("[QA Agent] Response validated successfully.")
    return True, "Valid"