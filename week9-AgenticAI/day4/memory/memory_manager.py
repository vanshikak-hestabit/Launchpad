from .session_mem import SessionMemory
from .vector_store import VectorStore
from .long_term_mem import LongTermMemory

class MemoryManager:
    def __init__(self, llm=None):
        self.session = SessionMemory()
        self.vector = VectorStore()
        self.long_term = LongTermMemory()
        self.llm = llm 

    def store(self, text: str, memory_type: str):
        if not text or len(text.strip()) < 8:
            return

        memory_type = memory_type.lower()

        self.session.add("user", text)

        refined_text = self.refine_text_with_llm(text, memory_type)
        if not refined_text:
            return 
        
        self.long_term.add(memory_type, refined_text)

        if memory_type in {"episodic", "semantic"}:
            self.vector.add(refined_text)
            self.vector.save()

    def refine_text_with_llm(self, text: str, memory_type: str) -> str | None:
        if not self.llm:
            # fallback: store as-is
            return text

        prompt = f"""
You are a memory refining assistant.
Decide if the following user input contains meaningful information
that should be stored in {memory_type} memory.
If yes, rewrite it as a concise, clear statement suitable for storage.
If not, return nothing.
User input: "{text}"
"""

        refined = self.llm(prompt)
        if refined:
            refined = refined.strip()
        return refined if refined else None

    def recall(self, query: str) -> str:
        factual = self.long_term.fetch_by_type("factual")
        episodic = self.long_term.fetch_by_type("episodic")
        semantic_hits = self.vector.search(query)

        return "\n".join(
            filter(None, [
                "\n".join(factual),
                "\n".join(episodic),
                "\n".join(semantic_hits)
            ])
        )