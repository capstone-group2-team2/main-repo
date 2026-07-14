from fastapi import FastAPI
from pydantic import BaseModel, Field
from datetime import datetime
import weaviate
from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

app = FastAPI(title="Support Agent API")

# تحميل كل شي مرة وحدة عند تشغيل السيرفر
client = weaviate.Client("http://localhost:8080")
embedder = SentenceTransformer("all-MiniLM-L6-v2")

tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-base")
model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-base")


class SupportRequest(BaseModel):
    customer_id: str = Field(..., min_length=1)
    message: str = Field(..., min_length=1, max_length=2000)


class SupportResponse(BaseModel):
    customer_id: str
    message: str
    reply: str
    timestamp: str


@app.get("/healthz")
def healthz():
    return {"status": "ok"}


def find_answer(message: str, k: int = 5):

    vector = embedder.encode(message).tolist()
    result = (
        client.query
        .get("SupportFAQ", ["question", "answer"])
        .with_hybrid(query=message, vector=vector, alpha=0.5)
        .with_limit(k)
        .do()
    )
    docs = result.get("data", {}).get("Get", {}).get("SupportFAQ", [])

    if not docs:
        return None

    context = "\n\n".join(f"Q: {d['question']}\nA: {d['answer']}" for d in docs)
    prompt = f"""Answer the question using ONLY the context below.
If the answer is not in the context, reply ONLY with: I don't know.

Context:
{context}

Question:
{message}

Answer:"""

    inputs = tokenizer(prompt, return_tensors="pt", truncation=True, max_length=512)
    outputs = model.generate(**inputs, max_new_tokens=128)
    answer = tokenizer.decode(outputs[0], skip_special_tokens=True)

    if "don't know" in answer.strip().lower():
        return None

    return answer


@app.post("/support", response_model=SupportResponse)
def support_agent(data: SupportRequest):
    answer = find_answer(data.message)

    if answer is None:
        answer = "Sorry, I could not find an answer to your question. Please contact our support team directly."

    return SupportResponse(
        customer_id=data.customer_id,
        message=data.message,
        reply=answer,
        timestamp=datetime.now().isoformat()
    )