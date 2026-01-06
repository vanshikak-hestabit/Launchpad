import json
import os
from datetime import datetime
MEMORY_FILE = "src/logs/CHAT-LOGS.json"
MAX_MESSAGES = 5


def load_memory():
    """Load chat memory from file"""
    if not os.path.exists(MEMORY_FILE):
        return []

    with open(MEMORY_FILE, "r") as f:
        return json.load(f)


def save_memory(memory):
    """Save chat memory to file"""
    with open(MEMORY_FILE, "w") as f:
        json.dump(memory, f, indent=2)


def add_message(role, content):
    """
    role: 'user' or 'assistant'
    content: text message
    """
    memory = load_memory()

    memory.append({
        "role": role,
        "content": content
    })

    # keep only last 5 messages
    memory = memory[-MAX_MESSAGES:]

    save_memory(memory)

    return memory

def log_interaction(data: dict):
    """
    Log full interaction for debugging & evaluation
    """
    memory = load_memory()

    data["timestamp"] = datetime.utcnow().isoformat()
    memory.append(data)

    save_memory(memory)
