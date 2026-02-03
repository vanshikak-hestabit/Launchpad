import json
from datetime import datetime
from groq_client import create_model_client
from autogen_core.models import SystemMessage, UserMessage

class ResearchAgent:
    def __init__(self):
        self.system_prompt = """
You are a Research Agent.

Your task is to collect vast detailed and long, factual information about the user's topic.
Do NOT summarize, conclude, or answer the user's question directly.

IMPORTANT:
- You are NOT browsing the web.
- Use your general knowledge to infer information.
- Be accurate, neutral, and detailed.

Return the output STRICTLY in the following format:

1. Findings
- Present well-structured, detailed research information.
- Use clear paragraphs or bullet points.
- Cover definitions, background, key concepts, mechanisms, examples, and implications where relevant.

2. Indicative Sources
- List platforms, organizations, official documentation, books, or publications
- These should represent where such information is commonly published
- Do NOT invent URLs or claim real-time access
- Do NOT add explanations or extra text
- Keep the list concise and credible

Do NOT include anything outside the two sections above.
"""
        self.memory_path = "memory/research.json"
        self.memory_window = 10
        self.model_client = create_model_client()

    def _read_memory(self):
        try:
            with open(self.memory_path, "r") as f:
                data = f.read().strip()
                return json.loads(data) if data else []
        except json.JSONDecodeError:
            return []

    def _write_memory(self, memory):
        with open(self.memory_path, "w") as f:
            json.dump(memory, f, indent=2)

    def _add_to_memory(self, query, research_text):
        memory = self._read_memory()[-self.memory_window*2:]
        memory.append({"role": "user", "content": query, "timestamp": str(datetime.now())})
        memory.append({"role": "research-agent", "content": research_text, "timestamp": str(datetime.now())})
        memory = memory[-2*self.memory_window:]
        self._write_memory(memory)

    async def run(self, query: str) -> str:
        if "last question" in query.lower():
            memory = self._read_memory()
            user_queries = [m["content"] for m in memory if m["role"] == "user"]
            if len(user_queries) >= 2:
                result = f"Your last question was: {user_queries[-2]}"
            else:
                result = "No previous question found."
            self._add_to_memory(query, result)
            return result

        memory = self._read_memory()[-self.memory_window*2:]
        memory_context = "\n".join(
            [f"{m['role']}: {m['content'][:300]}" for m in memory]
        )

        prompt = f"""
<System>
{self.system_prompt}
</System>

<Memory>
{memory_context}
</Memory>

<User>
{query}
</User>

<Assistant>
"""

        response = await self.model_client.create(
            messages=[
                SystemMessage(content=self.system_prompt),
                UserMessage(content=prompt, source="user")
            ]
        )


        research_text = response.content.strip()
        self._add_to_memory(query, research_text)
        return research_text
