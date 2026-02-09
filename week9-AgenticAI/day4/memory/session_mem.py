import json
import os

class SessionMemory:
    def __init__(self, limit=10, path="memory/session.json"):
        self.limit = limit
        self.path = path
        self.messages = []
        self._load()

    def _load(self): 
        if os.path.exists(self.path):
            try:
                with open(self.path, "r") as f:
                    self.messages = json.load(f)
            except Exception:
                self.messages = []
        else:
            self.messages = []

    def _save(self): 
        os.makedirs(os.path.dirname(self.path), exist_ok=True)
        with open(self.path, "w") as f:
            json.dump(self.messages, f, indent=2)

    def add(self, role, content):
        self.messages.append({
            "role": role,
            "content": content
        }) 
        self.messages = self.messages[-self.limit:]
        self._save()

    def clear(self):
        self.messages = []
        self._save()