# import faiss
# import numpy as np
# import os
# import google.generativeai as genai


# class VectorStore:
#     """FAISS vector store using Gemini embeddings"""

#     def __init__(self, dim=768, index_path="memory/faiss.index"):
#         self.dim = dim
#         self.index_path = index_path

#         genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

#         if os.path.exists(index_path):
#             self.index = faiss.read_index(index_path)
#         else:
#             base_index = faiss.IndexFlatIP(dim)
#             self.index = faiss.IndexIDMap(base_index)

#     def _embed(self, text: str) -> np.ndarray:
#         """
#         Generate embedding using Gemini
#         """
#         response = genai.embed_content(
#             model="models/embedding-001",
#             content=text,
#             task_type="retrieval_document"
#         )

#         vector = np.array(response["embedding"], dtype="float32")

#         # Normalize for cosine similarity
#         faiss.normalize_L2(vector.reshape(1, -1))

#         return vector.reshape(1, -1)

#     def add_text(self, memory_id: int, text: str):
#         emb = self._embed(text)
#         self.index.add_with_ids(emb, np.array([memory_id], dtype="int64"))
#         faiss.write_index(self.index, self.index_path)

#     def search(self, query: str, k=5):
#         if self.index.ntotal == 0:
#             return []

#         q_emb = self._embed(query)
#         scores, ids = self.index.search(q_emb, k)

#         results = []
#         for score, idx in zip(scores[0], ids[0]):
#             if idx != -1:
#                 results.append((int(idx), float(score)))
#         return results

#     def delete(self, memory_id: int):
#         self.index.remove_ids(np.array([memory_id], dtype="int64"))
#         faiss.write_index(self.index, self.index_path)


import faiss
import numpy as np
from pathlib import Path
from sentence_transformers import SentenceTransformer


class VectorStore:
    """FAISS vector store using free local MiniLM embeddings"""

    def __init__(self, dim=384):
        base_dir = Path(__file__).resolve().parent
        self.index_path = base_dir / "faiss.index"

        self.model = SentenceTransformer("all-MiniLM-L6-v2")

        if self.index_path.exists():
            self.index = faiss.read_index(str(self.index_path))
        else:
            base_index = faiss.IndexFlatIP(dim)
            self.index = faiss.IndexIDMap(base_index)

    def _embed(self, text: str):
        vec = self.model.encode(text, normalize_embeddings=True)
        return np.array([vec], dtype="float32")

    def add_text(self, memory_id: int, text: str):
        emb = self._embed(text)
        self.index.add_with_ids(emb, np.array([memory_id], dtype="int64"))
        faiss.write_index(self.index, str(self.index_path))

    def search(self, query: str, k=5):
        if self.index.ntotal == 0:
            return []

        q_emb = self._embed(query)
        scores, ids = self.index.search(q_emb, k)

        return [
            (int(idx), float(score))
            for score, idx in zip(scores[0], ids[0])
            if idx != -1
        ]

    def delete(self, memory_id):
        self.index.remove_ids(np.array([memory_id], dtype="int64"))
        faiss.write_index(self.index, str(self.index_path))