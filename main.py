from fastapi import FastAPI
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
import json
import os

# استيراد الوكلاء من مجلد backend/agents
from agents.ticket_agent import create_ticket

app = FastAPI()

# إعدادات قاعدة البيانات
DB_PATH = "./database/vector_db"
embedding_function = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")

def get_answer(query, collection_name):
    # البحث عن إجابة مع درجة تشابه
    db = Chroma(persist_directory=DB_PATH, embedding_function=embedding_function, collection_name=collection_name)
    results = db.similarity_search_with_score(query, k=1)
    
    # عتبة (Threshold) 1.2 تعني إذا كان البحث بعيداً جداً نعتبره غير موجود
    if not results or results[0][1] > 1.2:
        return "NOT_FOUND", None
    
    return "FOUND", results[0][0].page_content

@app.get("/chat")
async def chat(message: str, department: str):
    collection = "technical_docs" if department == "technical" else "hr_docs"
    status, answer = get_answer(message, collection)
    
    if status == "NOT_FOUND":
        # إنشاء تذكرة تلقائياً عند عدم العثور على معلومة
        ticket = create_ticket(message, sentiment_score=-0.8)
        return {
            "user_input": message,
            "answer": "عذراً، لم أجد إجابة في قاعدة المعرفة. تم رفع تذكرة للدعم الفني.",
            "ticket_info": ticket
        }
        
    return {"user_input": message, "answer": answer}

@app.get("/dashboard")
async def get_dashboard():
    # قراءة التذاكر من الملف لعرضها في الـ Dashboard
    if os.path.exists("tickets.json"):
        with open("tickets.json", "r", encoding="utf-8") as f:
            return json.load(f)
    return {"message": "لا توجد تذاكر حالياً"}