from pathlib import Path
import pickle
import faiss
import pandas as pd

from sentence_transformers import SentenceTransformer

from .language import detect_language

MODEL_NAME = "BAAI/bge-m3"

BASE_DIR = Path(__file__).resolve().parent.parent
VECTOR_DB = BASE_DIR / "vector_db"

model = SentenceTransformer(MODEL_NAME)

index = faiss.read_index(str(VECTOR_DB / "synova.index"))

with open(VECTOR_DB / "metadata.pkl", "rb") as f:
    metadata = pickle.load(f)

def retrieve(query, top_k=3):

    language = detect_language(query)

    query_embedding = model.encode(
        [query],
        normalize_embeddings=True
    )

    scores, indices = index.search(query_embedding, top_k * 4)

    results = []

    results = []

    for score, idx in zip(scores[0], indices[0]):

        doc = metadata[int(idx)]

        if doc["language"] == language:

            doc["score"] = float(score)

            results.append(doc)

        if len(results) == top_k:
            break

    return pd.DataFrame(results)