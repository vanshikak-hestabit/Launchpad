import sqlite3
from datetime import datetime
from pathlib import Path

class LongTermMemory:
    """Persistent fact storage"""

    def __init__(self, db_path:str | None =None):
        base_dir = Path(__file__).resolve().parent 

        if db_path is None:
            db_path = base_dir / "long_term.db"
        else:
            db_path = Path(db_path)

        db_path.parent.mkdir(parents=True, exist_ok=True)  
        self.conn = sqlite3.connect(db_path, check_same_thread=False)
        self.conn.execute("""
        CREATE TABLE IF NOT EXISTS memories(
            id INTEGER PRIMARY KEY,
            fact TEXT,
            category TEXT,
            importance REAL,
            timestamp TEXT
        )
        """)

    def store(self, memory_id, fact, category, importance):
        self.conn.execute(
            "INSERT OR REPLACE INTO memories VALUES (?, ?, ?, ?, ?)",
            (memory_id, fact, category, importance, datetime.now().isoformat())
        )
        self.conn.commit()

    def get_by_ids(self, ids):
        if not ids:
            return []
        placeholders = ",".join("?" * len(ids))
        query = f"SELECT fact FROM memories WHERE id IN ({placeholders})"
        cur = self.conn.execute(query, ids)
        return [r[0] for r in cur.fetchall()]
    
    def delete(self, memory_id):
        self.conn.execute("DELETE FROM memories WHERE id=?", (memory_id,))
        self.conn.commit()