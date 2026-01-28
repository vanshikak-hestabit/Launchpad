from collections import deque
from datetime import datetime


class SessionMemory:
    def __init__(self, max_messages: int = 10):
        self.max_messages = max_messages
        self.memory = deque(maxlen=max_messages)

    def add(self, role: str, content: str):
        item = {
            "role": role,
            "content": content,
            "timestamp": datetime.utcnow().isoformat()
        }
        self.memory.append(item)

    def get_recent(self):
        return list(self.memory)

    def clear(self):
        self.memory.clear()
