import faiss
import pickle
import os
import numpy as np
from sentence_transformers import SentenceTransformer

class VectorStore:
    def __init__(self, dim=384, path="memory/faiss"):
        self.model = SentenceTransformer("all-MiniLM-L6-v2")
        self.dim = dim
        self.path = path
        self.index_file = os.path.join(path, "index.faiss")
        self.text_file = os.path.join(path, "texts.pkl")
        self.texts = []
        self._init()

    def _init(self):
        os.makedirs(self.path, exist_ok=True)
        if os.path.exists(self.index_file):
            self.index = faiss.read_index(self.index_file)
            if os.path.exists(self.text_file):
                with open(self.text_file, "rb") as f:
                    self.texts = pickle.load(f)
            else:
                self.texts = []
        else:
            self.index = faiss.IndexFlatIP(self.dim)
            self.texts = []

    def add(self, text: str):
        embedding = self.model.encode(text, normalize_embeddings=True).astype("float32")
        self.index.add(np.array([embedding]))
        self.texts.append(text)

    def search(self, query: str, k=5) -> list:
        if self.index.ntotal == 0:
            return []
        embedding = self.model.encode(query,normalize_embeddings=True).astype("float32")
        _, idxs = self.index.search(np.array([embedding]), k)
        return [
            self.texts[i]
            for i in idxs[0]
            if 0 <= i < len(self.texts)
        ]

    def save(self):
        faiss.write_index(self.index, self.index_file)
        with open(self.text_file, "wb") as f:
            pickle.dump(self.texts, f)