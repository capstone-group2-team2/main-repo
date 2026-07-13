import os
from groq import Groq


groq_api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=groq_api_key)

def load_context():
    if os.path.exists("groq_context.txt"):
        with open("groq_context.txt", "r", encoding="utf-8") as f:
            return f.read()
    else:
        print("❌ Error: 'groq_context.txt' not found. Please run 'ingest.py' first.")
        return ""

def query_support_agent(user_question, context):
    print("🔍 Groq is processing and searching context cloud...")
    

    system_prompt = (
        "You are an expert customer support assistant. Below is our official English FAQ knowledge base. "
        "Your task is to search through this reference context and answer the user's question accurately. "
        "CRITICAL RULE: Respond in the SAME LANGUAGE as the user's question. If they ask in Arabic, reply in clear, friendly Arabic. If they ask in English, reply in clear, professional English. "
        "Base your answer ONLY on the provided context. If the answer cannot be found, politely state that you don't have this information.\n\n"
        f"Official Reference Context:\n{context}"
    )
    
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_question}
            ],
            temperature=0.2
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"❌ Failed to connect to Groq API: {e}"

if __name__ == "__main__":
    print("🤖 Groq Cloud Support Agent (Bilingual: Arabic/English) is ready! يمكنك السؤال باللغة العربية /الانجليزية  ")
    print("Type 'exit' or 'quit' to stop.\n ")
    
    knowledge_context = load_context()
    
    if knowledge_context:
        while True:
            query = input("👤 You (Ask in Arabic or English): ")
            if query.lower() in ['exit', 'quit']:
                print("👋 Goodbye!")
                break
            if not query.strip():
                continue
                
            response = query_support_agent(query, knowledge_context)
            print(f"\n🤖 Agent:\n{response}\n")
            print("-" * 50)
            