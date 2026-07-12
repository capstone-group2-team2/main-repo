from fastapi import FastAPI
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings

app = FastAPI()

# إعداد قاعدة البيانات للاسترجاع
DB_PATH = "./database/vector_db"
embedding_function = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")

def get_answer(query, collection_name):
    # فتح قاعدة البيانات والبحث عن أقرب إجابة للسؤال
    db = Chroma(persist_directory=DB_PATH, embedding_function=embedding_function, collection_name=collection_name)
    results = db.similarity_search(query, k=1)
    if results:
        return results[0].page_content
    return "عذراً، لم أجد إجابة في الوثائق."

@app.get("/chat")
async def chat(message: str, department: str):
    # department يجب أن يكون إما 'technical' أو 'hr'
    collection = "technical_docs" if department == "technical" else "hr_docs"
    answer = get_answer(message, collection)
    return {"user_input": message, "answer": answer}