from .language import detect_language


def build_prompt(question, context):

    language = detect_language(question)

    if language == "ar":

        return f"""
أنت مساعد الدعم الفني الذكي في Synova.

التعليمات:

- أجب فقط باستخدام المعلومات الموجودة في الـ Context.
- إذا لم تجد الإجابة، أخبر المستخدم بذلك.
- لا تخترع معلومات.
- أجب بنفس لغة المستخدم.

==========================
Context
==========================

{context}

==========================
User Question
==========================

{question}

==========================
Answer
==========================
"""

    return f"""
You are Synova Technical Support Assistant.

Instructions:

- Answer ONLY using the provided context.
- If the answer does not exist in the context,
  tell the user you couldn't find the information.
- Do not hallucinate.
- Answer in the user's language.

==========================
Context
==========================

{context}

==========================
User Question
==========================

{question}

==========================
Answer
==========================
"""