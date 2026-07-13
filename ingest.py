import os
from langchain_community.document_loaders.csv_loader import CSVLoader

def prepare_knowledge_base():
    csv_file_path = "cleaned_customer_support_faqs.csv"
    context_file_path = "groq_context.txt"
    
    if os.path.exists(context_file_path):
        print(f"🗑️ Found old context file. Deleting '{context_file_path}'...")
        os.remove(context_file_path)
        print("✅ Old file removed successfully.")
    
    print(f"🔄 Loading updated document from: {csv_file_path} ...")
    if not os.path.exists(csv_file_path):
        print(f"❌ Error: '{csv_file_path}' not found! Please make sure the file exists.")
        return
        
    loader = CSVLoader(file_path=csv_file_path, encoding='utf-8')
    documents = loader.load()
    print(f"✅ Loaded {len(documents)} updated Q&A pairs from CSV.")

    print("📝 Packaging new FAQs for Groq Cloud...")
    full_context = ""
    for i, doc in enumerate(documents, 1):
        full_context += f"FAQ #{i}:\n{doc.page_content}\n"
        full_context += "-" * 30 + "\n"
        
    with open(context_file_path, "w", encoding="utf-8") as f:
        f.write(full_context)
        
    print(f"🎉 Success! New knowledge base saved into '{context_file_path}'.")

if __name__ == "__main__":
    prepare_knowledge_base()