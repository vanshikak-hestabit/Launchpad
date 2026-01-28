class MemoryRetriever:
    def __init__(self, session_memory, vector_store, long_term_memory):
        self.session_memory = session_memory
        self.vector_store = vector_store
        self.long_term_memory = long_term_memory

    def retrieve(self, query: str):
        recent = self.session_memory.get_recent()
        recent_context = [f"{item['role']}: {item['content']}" for item in recent]

        semantic_hits = self.long_term_memory.search(query, top_k=5)
        semantic_context = [m["content"] for m in semantic_hits]

        vector_hits = self.vector_store.query(query, top_k=3)
        vector_context = [m["content"] for m in vector_hits]

        full_context = "\n".join(recent_context + semantic_context + vector_context)
        return full_context
