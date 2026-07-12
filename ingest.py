import os
from langchain_core.documents import Document
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings

# مسار قاعدة البيانات
DB_PATH = "./database/vector_db"
embedding_function = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")

def ingest_data(source_dir, collection_name):
    print(f"Processing documents from: {source_dir}...")
    # إنشاء أو فتح مجموعة (Collection)
    collection = Chroma(
        persist_directory=DB_PATH,
        embedding_function=embedding_function,
        collection_name=collection_name
    )
    
    # قراءة الملفات من المجلد
    for filename in os.listdir(source_dir):
        if filename.endswith(".txt"):
            file_path = os.path.join(source_dir, filename)
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            
            # إنشاء وثيقة وإضافتها للمجموعة
            doc = Document(page_content=content, metadata={"source": filename})
            collection.add_documents([doc])
            print(f"Added {filename} to {collection_name} collection.")

if __name__ == "__main__":
    # تأكد من أن المجلدات موجودة داخل backend
    ingest_data("./data/technical", "technical_docs")
    ingest_data("./data/hr", "hr_docs")
    print("Ingestion complete! Data is now in the database.")