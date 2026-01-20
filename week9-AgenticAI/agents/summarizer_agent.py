import json
from datetime import datetime


class SummarizerAgent:
    def __init__(self):
        self.system_prompt = """
You are a Summarizer Agent.
Your job is to read the research text and return only the key points in 2-3 concise sentences.
Do NOT include examples, article mentions, or extra explanations.
Keep it beginner-friendly.
"""
        self.memory_path = "memory/summarizer.json"
        self.memory_window = 10

    def _read_memory(self):
        try:
            with open(self.memory_path, "r") as f:
                data = f.read().strip()
                if not data:
                    return []
                return json.loads(data)
        except json.JSONDecodeError:
            return []
        
    def _write_memory(self, memory):
        with open(self.memory_path, "w") as f:
            json.dump(memory, f, indent=2)

    def _add_to_memory(self, user_text, agent_text):
        memory = self._read_memory()

        memory.append({"role": "user", "content": user_text, "timestamp": str(datetime.now())})
        memory.append({"role": "summarizer", "content": agent_text, "timestamp": str(datetime.now())})

        memory = memory[-2*self.memory_window:]  # keep last N messages

        self._write_memory(memory)
        
    def run(self, research_text: str):

        sentences = research_text.replace("\n", " ").split(". ")
        summary = ". ".join(sentences[:3]).strip()
        if not summary.endswith("."):
            summary += "."
        self._add_to_memory(research_text, summary)
        return summary
