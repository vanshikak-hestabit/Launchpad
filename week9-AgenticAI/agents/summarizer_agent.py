# summarizer_agent.py
import json
from datetime import datetime
from .base_model import call_llm

class SummarizerAgent:
    def __init__(self):
        self.system_prompt = """
You are the Summarizer Agent.
Strictly follow the instructions below.
- You will be provided with researched information.
- Summarize the provided information into a concise and coherent summary.
- Ensure that the summary captures all key points and relevant details.
- Do NOT omit any critical information.
- Do NOT add any information that is not present in the provided content.
- Keep the summary clear and to the point.
- Strictly follow what is mentioned in the provided content.
- Only summarize the given research content.
- Do NOT answer the user directly.
"""
        self.memory_path = "memory/summarizer.json"
        self.memory_window = 10

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

    def _add_to_memory(self, research_text, summary_text):
        memory = self._read_memory()[-self.memory_window*2:]

        memory.append({"role": "user", "content": research_text, "timestamp": str(datetime.now())})
        memory.append({"role": "summarizer", "content": summary_text, "timestamp": str(datetime.now())})
        memory = memory[-2*self.memory_window:]
        self._write_memory(memory)

    def run(self, research_text: str) -> str:
        prompt = self.system_prompt + "\n\nResearch:\n" + research_text + "\n\nSummary:"
        summary = call_llm(prompt, max_tokens=350)
        self._add_to_memory(research_text, summary)
        return summary
