from .rag_pipeline import rag_pipeline
from .llm_manager import LLMManager


class TechnicalAgent:

    def __init__(self):

        self.llm = LLMManager()

    def handle_request(self, question: str):

        # Run RAG Pipeline
        rag_result = rag_pipeline(question)

        # Generate Answer
        llm_response = self.llm.generate(
            rag_result["prompt"]
        )

        return {

            "question": question,

            "language": rag_result["language"],

            "provider": llm_response["provider"],

            "answer": llm_response["answer"],

            "documents": rag_result["documents"].to_dict(orient="records")

        }