from fastapi import FastAPI
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from google import genai
import os

# استخدام الـ Client المحدث للمكتبة الجديدة
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

DB_PATH = "./database/vector_db"
embedding_function = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

def get_answer(query, collection_name):
    db = Chroma(persist_directory=DB_PATH, embedding_function=embedding_function, collection_name=collection_name)
    results = db.similarity_search(query, k=1)
    
    if not results:
        return "عذراً، لم أجد إجابة في الوثائق."

    context = results[0].page_content
    prompt = f"أجب بناءً على المعلومات التالية: {context}. السؤال: {query}"
    
    try:
        # الطريقة الصحيحة للمكتبة الجديدة
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt,
        )
        return response.text
    except Exception as e:
        return f"خطأ في الاتصال: {str(e)}"

@app.get("/chat")
async def chat(message: str, department: str):
    collection = "technical_docs" if department == "technical" else "hr_docs"
    answer = get_answer(message, collection)
    return {"user_input": message, "answer": answer}
#main.py
# لسا في مشكله في ملف ال main.py