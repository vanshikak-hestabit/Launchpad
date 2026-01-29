import sqlite3
import time
import os
 
class LongTermMemory:
    def __init__(self, path="memory/long_term.db"):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        self.conn = sqlite3.connect(path, check_same_thread=False)
        self._init()
 
    def _init(self):
        cur = self.conn.cursor()
        cur.execute("""
        CREATE TABLE IF NOT EXISTS memory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            text TEXT NOT NULL,
            created_at REAL NOT NULL
        )
        """)
        self.conn.commit()
 
    def add(self, memory_type: str, text: str):
        self.conn.execute(
            "INSERT INTO memory (type, text, created_at) VALUES (?, ?, ?)",
            (memory_type, text, time.time())
        )
        self.conn.commit()
 
    def fetch_by_type(self, memory_type: str, k=10) -> list:
        cur = self.conn.cursor()
        cur.execute(
            "SELECT text FROM memory WHERE type = ? ORDER BY created_at DESC LIMIT ?",
            (memory_type, k)
        )
        return [r[0] for r in cur.fetchall()]
 
    def fetch_recent(self, k=5) -> list:
        cur = self.conn.cursor()
        cur.execute(
            "SELECT text FROM memory ORDER BY created_at DESC LIMIT ?",
            (k,)
        )
        return [r[0] for r in cur.fetchall()]
 
    def fetch_first(self) -> str:
        cur = self.conn.cursor()
        cur.execute(
            "SELECT text FROM memory ORDER BY created_at ASC LIMIT 1"
        )
        row = cur.fetchone()
        return row[0] if row else ""
 
 