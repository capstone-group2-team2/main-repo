from .retriever import retrieve
from .prompt import build_prompt
from .language import detect_language


def build_context(results):

    if results.empty:
        return ""

    context = ""

    for _, row in results.iterrows():

        context += f"# {row['title']}\n\n"

        context += row["text"]

        context += "\n\n"

    return context.strip()


def rag_pipeline(question):

    docs = retrieve(question)

    context = build_context(docs)

    prompt = build_prompt(question, context)

    return {

        "question": question,

        "language": detect_language(question),

        "documents": docs,

        "context": context,

        "prompt": prompt

    }