"""Employee RAG over the existing datapipeline FAISS knowledge base."""

from __future__ import annotations

import ast
import pickle
import re
import sys
from dataclasses import dataclass
from pathlib import Path

import faiss
import numpy as np
import pandas as pd
import torch
import torch.nn.functional as F
from transformers import AutoModel, AutoTokenizer

# datapipeline/RAG (contains package `src` for language + optional LLM)
_RAG_ROOT = Path(__file__).resolve().parents[3] / "datapipeline" / "RAG"
_VECTOR_DB = _RAG_ROOT / "vector_db"
if str(_RAG_ROOT) not in sys.path:
    sys.path.insert(0, str(_RAG_ROOT))

MODEL_NAME = "BAAI/bge-m3"

_index = None
_metadata = None
_encoder = None


class _SafeBGEEncoder:
    """
    Encode queries like SentenceTransformer(BAAI/bge-m3) with CLS + L2 norm,
    but load weights via safetensors so torch < 2.6 does not hit torch.load.
    """

    def __init__(self, model_name: str = MODEL_NAME):
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModel.from_pretrained(
            model_name,
            use_safetensors=True,
        )
        self.model.eval()
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)

    def encode(self, texts, normalize_embeddings: bool = True):
        if isinstance(texts, str):
            texts = [texts]

        encoded = self.tokenizer(
            list(texts),
            padding=True,
            truncation=True,
            return_tensors="pt",
            max_length=8192,
        )
        encoded = {k: v.to(self.device) for k, v in encoded.items()}

        with torch.no_grad():
            outputs = self.model(**encoded)
            # Matches BGE-M3 SentenceTransformer pooling (CLS token).
            embeddings = outputs.last_hidden_state[:, 0]
            if normalize_embeddings:
                embeddings = F.normalize(embeddings, p=2, dim=1)

        return embeddings.detach().cpu().numpy().astype(np.float32)


def _load_vector_stack():
    """Lazy-load FAISS index + metadata + safetensors BGE encoder."""
    global _index, _metadata, _encoder
    if _encoder is not None:
        return _index, _metadata, _encoder

    _index = faiss.read_index(str(_VECTOR_DB / "synova.index"))
    with open(_VECTOR_DB / "metadata.pkl", "rb") as handle:
        _metadata = pickle.load(handle)

    # Do NOT import datapipeline.RAG.src.retriever — it loads via torch.load/.bin
    _encoder = _SafeBGEEncoder(MODEL_NAME)
    return _index, _metadata, _encoder


# Cosine similarity via IndexFlatIP + normalized embeddings.
MIN_SCORE = 0.50

_NO_ANSWER_MARKERS = (
    "could not find",
    "couldn't find",
    "couldnt find",
    "i don't know",
    "i do not know",
    "no information",
    "not in the context",
    "unable to find",
    "لا أجد",
    "لم أجد",
    "لا توجد معلومات",
    "غير متوفر",
)


@dataclass
class RAGResult:
    found: bool
    answer: str | None
    language: str
    score: float | None
    documents: list[dict]


@dataclass
class AgentOutcome:
    reply: str
    escalated: bool
    rag: RAGResult | None = None


class EmployeeRAGService:
    """Category-filtered retrieval against the Employee vector DB."""

    def __init__(self):
        self._llm = None
        self._llm_checked = False

    def retrieve(
        self,
        query: str,
        category: str,
        top_k: int = 3,
    ) -> pd.DataFrame:
        from src.language import detect_language

        index, metadata, encoder = _load_vector_stack()
        language = detect_language(query)

        query_embedding = encoder.encode(
            [query],
            normalize_embeddings=True,
        )

        # Over-fetch, then filter by language + category.
        scores, indices = index.search(query_embedding, max(top_k * 8, 24))

        results: list[dict] = []
        for score, idx in zip(scores[0], indices[0]):
            if idx < 0:
                continue

            doc = dict(metadata[int(idx)])
            if doc.get("language") != language:
                continue
            if doc.get("category") != category:
                continue

            doc["score"] = float(score)
            results.append(doc)

            if len(results) == top_k:
                break

        return pd.DataFrame(results)

    def answer(
        self,
        query: str,
        category: str,
        agent_label: str,
    ) -> RAGResult:
        from src.language import detect_language

        language = detect_language(query)
        docs = self.retrieve(query, category=category)

        if docs.empty:
            return RAGResult(
                found=False,
                answer=None,
                language=language,
                score=None,
                documents=[],
            )

        best_score = float(docs.iloc[0]["score"])
        records = docs.to_dict(orient="records")

        if best_score < MIN_SCORE:
            return RAGResult(
                found=False,
                answer=None,
                language=language,
                score=best_score,
                documents=records,
            )

        context = self._build_context(docs)
        llm_answer = self._try_llm_answer(
            query=query,
            context=context,
            language=language,
            agent_label=agent_label,
        )

        if llm_answer and not self._looks_like_no_answer(llm_answer):
            return RAGResult(
                found=True,
                answer=llm_answer.strip(),
                language=language,
                score=best_score,
                documents=records,
            )

        extractive = self._extractive_answer(docs, query)
        if extractive:
            return RAGResult(
                found=True,
                answer=extractive,
                language=language,
                score=best_score,
                documents=records,
            )

        return RAGResult(
            found=False,
            answer=None,
            language=language,
            score=best_score,
            documents=records,
        )

    @staticmethod
    def _build_context(docs: pd.DataFrame) -> str:
        parts: list[str] = []
        for _, row in docs.iterrows():
            parts.append(f"# {row['title']} ({row['section']})\n\n{row['text']}")
        return "\n\n".join(parts).strip()

    def _get_llm(self):
        if self._llm_checked:
            return self._llm

        self._llm_checked = True
        try:
            from src.llm_manager import LLMManager

            llm = LLMManager()
            self._llm = llm if llm.providers else None
        except Exception as exc:
            print(f"Employee RAG LLM init skipped: {exc}")
            self._llm = None

        return self._llm

    def _try_llm_answer(
        self,
        query: str,
        context: str,
        language: str,
        agent_label: str,
    ) -> str | None:
        llm = self._get_llm()
        if llm is None:
            return None

        try:
            prompt = self._build_prompt(query, context, language, agent_label)
            result = llm.generate(prompt)
            return result.get("answer")
        except Exception as exc:
            print(f"Employee RAG LLM unavailable, using extractive answer: {exc}")
            return None

    @staticmethod
    def _build_prompt(
        question: str,
        context: str,
        language: str,
        agent_label: str,
    ) -> str:
        if language == "ar":
            return f"""
أنت مساعد {agent_label} في Synova.

التعليمات:
- أجب فقط باستخدام المعلومات الموجودة في الـ Context.
- إذا لم تجد الإجابة، اكتب فقط: لم أجد معلومات كافية.
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
You are the Synova {agent_label} assistant.

Instructions:
- Answer ONLY using the provided context.
- If the answer is not in the context, reply ONLY with: I could not find enough information.
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

    def _extractive_answer(self, docs: pd.DataFrame, query: str) -> str | None:
        # Prefer FAQ chunks when present.
        faq_rows = docs[
            docs["section"].astype(str).str.contains("FAQ|الأسئلة", case=False, na=False)
        ]
        pool = faq_rows if not faq_rows.empty else docs

        best_row = pool.iloc[0]
        faq_answer = self._best_faq_answer(str(best_row["text"]), query)
        if faq_answer:
            return faq_answer

        title = str(best_row.get("title", "")).strip()
        section = str(best_row.get("section", "")).strip()
        text = str(best_row.get("text", "")).strip()
        if not text:
            return None

        header = f"{title} — {section}" if section else title
        return f"{header}\n\n{text}"

    @staticmethod
    def _best_faq_answer(text: str, query: str) -> str | None:
        pairs: list[tuple[str, str]] = []
        for line in text.splitlines():
            line = line.strip()
            if not line:
                continue
            try:
                item = ast.literal_eval(line)
            except (ValueError, SyntaxError):
                continue
            if isinstance(item, dict) and "question" in item and "answer" in item:
                pairs.append((str(item["question"]), str(item["answer"])))

        if not pairs:
            return None

        query_tokens = set(re.findall(r"\w+", query.lower()))
        best_q, best_a, best_overlap = pairs[0][0], pairs[0][1], -1

        for question, answer in pairs:
            tokens = set(re.findall(r"\w+", question.lower()))
            overlap = len(query_tokens & tokens)
            if overlap > best_overlap:
                best_q, best_a, best_overlap = question, answer, overlap

        return f"{best_a}"

    @staticmethod
    def _looks_like_no_answer(answer: str) -> bool:
        lowered = answer.strip().lower()
        return any(marker in lowered for marker in _NO_ANSWER_MARKERS)
