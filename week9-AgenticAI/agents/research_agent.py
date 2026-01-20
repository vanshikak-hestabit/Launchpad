from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
import json
from datetime import datetime



class ResearchAgent:
    def __init__(self):
        self.system_prompt = """
You are a Research Agent.
Your job is to gather detailed information about the user's topic.
Do NOT summarize.
Do NOT answer directly.
Return raw, informative research text.
"""

        model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"

        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForCausalLM.from_pretrained(
            model_name,
            dtype=torch.float16,
            device_map="auto"
        )

        self.memory_path = "memory/research.json"
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
        memory.append({"role": "researcher", "content": agent_text, "timestamp": str(datetime.now())})

        memory = memory[-2*self.memory_window:]

        self._write_memory(memory)

    def run(self, query: str):
        memory = self._read_memory()
        memory_context = "\n".join([f"{m['role']}: {m['content']}" for m in memory])
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

        inputs = self.tokenizer(prompt, return_tensors="pt").to(self.model.device)

        with torch.no_grad():
            output = self.model.generate(
                **inputs,
                max_new_tokens=400,
                temperature=0.3,
                do_sample=True,
            )

        text = self.tokenizer.decode(output[0], skip_special_tokens=True)
        result = text.split("<Assistant>")[-1].strip()

        self._add_to_memory(query, result)

        return result
