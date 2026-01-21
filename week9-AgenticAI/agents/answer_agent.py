# answer_agent.py
import json
from datetime import datetime
from .base_model import call_llm

class AnswerAgent:
    def __init__(self):
        self.system_prompt = """
You are the Answer Agent.
Strictly follow the instructions below.
- You will be provided with a summary of information.
- Based on this summary, generate a concise and accurate answer to the user's original query in bullets.
- Do NOT add any information that is not present in the summary.
- Keep your answer clear and to the point.
- Only answer using the given summary. 
"""
        self.memory_path = "memory/answer.json"
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

    def _add_to_memory(self, summary_text, answer_text):
        memory = self._read_memory()[-self.memory_window*2:]
        memory.append({"role": "user", "content": summary_text, "timestamp": str(datetime.now())})
        memory.append({"role": "answer-agent", "content": answer_text, "timestamp": str(datetime.now())})
        memory = memory[-2*self.memory_window:]
        self._write_memory(memory)

    def run(self, summary_text: str) -> str:
        prompt = self.system_prompt + "\n\nSummary:\n" + summary_text + "\n\nAnswer:"
        answer = call_llm(prompt, max_tokens=200)
        answer = answer.strip()
        if not answer.endswith("."):
            answer += "."
        self._add_to_memory(summary_text, answer)
        return answer
