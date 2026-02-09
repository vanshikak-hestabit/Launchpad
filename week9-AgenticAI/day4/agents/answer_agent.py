from .base_agent import BaseAgent

class AnswerAgent(BaseAgent):
    def run_with_context(self, context: str, user_query: str) -> str:
        if context:
            user_input = f"Memory Context:\n{context}\n\nUser Query:\n{user_query}"
            print("Context related user input : ", user_input)
        else:
            user_input = user_query

        system_prompt = f"""
SYSTEM:
You are an assistant that can USE user memory silently.

RULES:
- Use memory ONLY if it is relevant to the user query.
- NEVER list, summarize, or explain memory.
- NEVER assume or invent missing details.
- Answer the user query directly.
- If memory is irrelevant, ignore it completely.
"""
        self.system_prompt = system_prompt.strip()
        return super().run(user_input)