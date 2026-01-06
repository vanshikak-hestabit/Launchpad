from sentence_transformers import CrossEncoder

class reRanker:
    def __init__(self):
       
        self.model = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")

    def rerank(self, query, docs):
        pairs = [(query, doc.page_content) for doc in docs]

        scores = self.model.predict(pairs)

        scored_docs = list(zip(scores, docs))

        scored_docs.sort(reverse=True, key=lambda x: x[0])

        return [doc for _, doc in scored_docs]
