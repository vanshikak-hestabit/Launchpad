from sentence_transformers import SentenceTransformer
import numpy as np

class VectorStore:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name)
        self.vectors = []  # list of numpy arrays
        self.texts = []    # list of dicts {"text": ..., "metadata": ...}

    def _embed_text(self, text: str):
        return self.model.encode(text, convert_to_numpy=True)

    def add(self, text: str, metadata: dict = None):
        vec = self._embed_text(text)
        self.vectors.append(vec)
        self.texts.append({"text": text, "metadata": metadata})

    def query(self, text: str, top_k: int = 3):
        if not self.vectors:
            return []

        query_vec = self._embed_text(text)
        sims = [
            np.dot(query_vec, v) / (np.linalg.norm(query_vec) * np.linalg.norm(v))
            for v in self.vectors
        ]

        top_indices = np.argsort(sims)[-top_k:][::-1]

        return [
            {"content": self.texts[i]["text"], "metadata": self.texts[i]["metadata"]}
            for i in top_indices
        ]
