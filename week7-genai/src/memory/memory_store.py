import json
import os
from datetime import datetime
MEMORY_FILE = "src/logs/CHAT-LOGS.json"
MAX_MESSAGES = 5


def load_memory():
    if not os.path.exists(MEMORY_FILE):
        return []

    with open(MEMORY_FILE, "r") as f:
        return json.load(f)


def save_memory(memory):
    with open(MEMORY_FILE, "w") as f:
        json.dump(memory, f, indent=2)


def add_message(role, content):
    memory = load_memory()

    memory.append({
        "role": role,
        "content": content
    })

    memory = memory[-MAX_MESSAGES:]

    save_memory(memory)

    return memory

def log_interaction(data: dict):
    memory = load_memory()

    data["timestamp"] = datetime.utcnow().isoformat()
    memory.append(data)

    save_memory(memory)
