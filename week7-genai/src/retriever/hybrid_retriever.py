class hybridRetriever:

    def __init__(self, vector_db):
            self.vector_db = vector_db


    def retrieve(self, query: str, top_k: int = 5):
        vector_results = self.vector_db.similarity_search(
            query=query,
            k=top_k
        )

        keyword_res = self.Keyword_matching(query, vector_results)
        combined_res = vector_results+keyword_res

        seen = set()
        final_res = []

        for doc in combined_res:
            if doc.page_content not in seen:
                seen.add(doc.page_content)
                final_res.append(doc)

        return final_res[:top_k]
    

    def Keyword_matching(self, query, docs):
        query_words = query.lower().split()
        scored_docs = []

        for doc in docs:
            text = doc.page_content.lower()
            score = 0

            for word in query_words:
                if word in text:
                    score += 1

            if score > 0:
                scored_docs.append((score,doc))

        scored_docs.sort(reverse=True, key=lambda x: x[0])

        return [doc for score, doc in scored_docs]
