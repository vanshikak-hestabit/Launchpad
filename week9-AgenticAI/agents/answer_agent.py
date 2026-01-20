from datetime import datetime
import json

class AnswerAgent:
    def __init__(self):
        self.system_prompt = """
You are an Answer Agent.
Your job is to provide a short, beginner-friendly answer using only the summary.
Return 1-2 sentences max.
Do NOT add new information.
"""
        self.memory_path = "memory/answer.json"
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
        memory.append({"role": "answer-agent", "content": agent_text, "timestamp": str(datetime.now())})

        memory = memory[-2*self.memory_window:]  # keep last N messages
        self._write_memory(memory)

    def run(self, summary_text: str):
    
        sentences = summary_text.split(". ")
        answer = ". ".join(sentences[:2]).strip()
        if not answer.endswith("."):
            answer += "."

        self._add_to_memory(summary_text, answer)

        return answer
