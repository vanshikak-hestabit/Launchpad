from groq_client import create_model_client
from memory.session_memory import SessionMemory
from memory.long_term_memory import LongTermMemory
from memory.vector_store import VectorStore
from memory.retriever import MemoryRetriever
from autogen_core.models import UserMessage


class MemoryAgent:
    def __init__(self):
        self.client = create_model_client()

        self.session_memory = SessionMemory()
        self.long_term_memory = LongTermMemory()
        self.vector_store = VectorStore()

        self.retriever = MemoryRetriever(
            self.session_memory,
            self.vector_store,
            self.long_term_memory
        )

    def build_prompt(self, memory_context: str, user_input: str):
        prompt = f"""
You are a memory-enabled agent.

Use memory ONLY if it helps answer the question.
NEVER talk about memory, remembering, past chats, or what the user asked before.
NEVER explain your internal process.
If the answer is factual, just answer it directly.

{memory_context}

User Query:
{user_input}

Answer clearly and directly:
"""
        return prompt.strip()

    async def chat(self, user_input: str):
        # ---- store session ----
        self.session_memory.add("user", user_input)

        # ---- store long-term only if useful ----
        if len(user_input.strip()) > 6:
            await self.long_term_memory.add(user_input)
            self.vector_store.add(user_input, {"role": "user", "content": user_input})

        # ---- retrieve from long-term DB ----
        recent_memories = self.long_term_memory.fetch_recent(5)
        semantic_memories = self.long_term_memory.search(user_input, top_k=5)

        recent_text = "\n".join([m["content"] for m in recent_memories])
        semantic_text = "\n".join([m["content"] for m in semantic_memories])

        # ---- retrieve session + vector ----
        session_vector_context = self.retriever.retrieve(user_input)

        # ---- build memory context ----
        memory_context = "\n".join([
            recent_text,
            semantic_text,
            session_vector_context
        ]).strip()

        # ---- build prompt ----
        prompt = self.build_prompt(memory_context, user_input)

        response = await self.client.create(
            messages=[UserMessage(content=prompt, source="user")]
        )

        reply = response.content

        # ---- store assistant ----
        self.session_memory.add("assistant", reply)
        self.vector_store.add(reply, {"role": "assistant", "content": reply})

        return reply
