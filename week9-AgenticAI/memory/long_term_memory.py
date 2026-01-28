import sqlite3
from pathlib import Path
from datetime import datetime
from sentence_transformers import SentenceTransformer
from groq_client import create_model_client
import asyncio
import numpy as np
from autogen_core.models import UserMessage


class LongTermMemory:
    """
    Stores important memories: factual, episodic, semantic
    """
    def __init__(self, db_path: str = "memory/long_term.db"):
        Path(db_path).parent.mkdir(parents=True, exist_ok=True)
        self.db_path = db_path
        self.embed_model = SentenceTransformer("all-MiniLM-L6-v2")
        self.client = create_model_client()
        self._init_db()

    def _init_db(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS memories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                memory_type TEXT,       -- factual, episodic, semantic
                category TEXT,          -- e.g., name, favorite_food, location
                content TEXT,
                embedding BLOB,
                created_at TEXT
            )
        """)
        conn.commit()
        conn.close()

    async def _categorize(self, text: str):
        prompt = f"""
You are an intelligent memory classifier. 
Given the user input, decide if it is important to remember for the long term.
Then classify it as one of the memory types: factual, episodic, semantic.
Also give a category like name, favorite_food, favorite_place, education, life_event, hobby, occupation, current_activity, other.
Return in this format:
<memory_type>|<category>

Examples:
"I love pizza." -> factual|favorite_food
"My name is Vanshika." -> factual|name
"Last summer I went to Paris." -> episodic|life_event
"I study at Delhi University." -> factual|education
"The capital of India is Delhi." -> semantic|general_knowledge
"My favorite singer is Taylor Swift." -> factual|favorite_artist
"I enjoy painting." -> factual|hobby
"I got my first job last week." -> episodic|life_event
"Currently I am attending college classes." -> factual|current_activity
"My cat is adorable." -> other|other

Now classify this input:
"{text}"
"""
        response = await self.client.create(
            messages=[UserMessage(role="user", content=prompt, source="user_input")]
        )
        try:
            memory_type, category = response.content.strip().split("|")
        except Exception:
            memory_type, category = "other", "other"
        return memory_type.strip(), category.strip()

    def _vectorize(self, text: str):
        vec = self.embed_model.encode(text, convert_to_numpy=True)
        return vec / np.linalg.norm(vec)

    async def add(self, content: str):
        memory_type, category = await self._categorize(content)

        if memory_type == "other":
            return

        if len(content.strip()) < 4:
            return

        embedding = self._vectorize(content)

        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO memories (memory_type, category, content, embedding, created_at) VALUES (?, ?, ?, ?, ?)",
            (memory_type, category, content, embedding.tobytes(), datetime.utcnow().isoformat())
        )
        conn.commit()
        conn.close()




    def fetch_recent(self, limit: int = 5):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute(
            "SELECT memory_type, category, content, created_at FROM memories ORDER BY id DESC LIMIT ?",
            (limit,)
        )
        rows = cursor.fetchall()
        conn.close()
        return [{"memory_type": r[0], "category": r[1], "content": r[2], "created_at": r[3]} for r in rows]

    def fetch_by_category(self, category: str, limit: int = 5):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute(
            "SELECT memory_type, content, created_at FROM memories WHERE category=? ORDER BY id DESC LIMIT ?",
            (category, limit)
        )
        rows = cursor.fetchall()
        conn.close()
        return [{"memory_type": r[0], "content": r[1], "created_at": r[2]} for r in rows]

    def search(self, query: str, top_k: int = 5):
        q_vec = self._vectorize(query)

        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT memory_type, category, content, embedding FROM memories")
        rows = cursor.fetchall()
        conn.close()

        if not rows:
            return []

        scored = []

        for mtype, cat, content, emb in rows:
            vec = np.frombuffer(emb, dtype=np.float32)
            denom = np.linalg.norm(q_vec) * np.linalg.norm(vec)
            if denom == 0:
                continue
            sim = np.dot(q_vec, vec) / denom
            scored.append((sim, mtype, cat, content))

        scored.sort(reverse=True, key=lambda x: x[0])

        return [
            {"memory_type": m[1], "category": m[2], "content": m[3]}
            for m in scored[:top_k]
        ]
