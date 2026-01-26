import sqlite3
import sys
import os
import asyncio
import re
from model_client import create_model_client
from autogen_core.models import UserMessage


class SimpleDBAgent:
    def __init__(self, db_path="sample.db"):
        self.db_path = db_path
        self.model = create_model_client()
        self.setup_db()

    def setup_db(self):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()

        cur.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER,
            name TEXT,
            price REAL,
            quantity INTEGER
        )
        """)

        cur.execute("SELECT COUNT(*) FROM products")
        if cur.fetchone()[0] == 0:
            data = [
                (1, "Laptop", 900, 15),
                (2, "Mouse", 25, 50),
                (3, "Keyboard", 75, 30),
                (4, "Monitor", 300, 20),
                (5, "Headphones", 150, 25),
            ]
            cur.executemany("INSERT INTO products VALUES (?, ?, ?, ?)", data)
            conn.commit()

        conn.close()

    def fetch_schema(self):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute("PRAGMA table_info(products)")
        rows = cur.fetchall()
        conn.close()
        return [r[1] for r in rows]

    async def text_to_sql(self, question):
        columns = self.fetch_schema()

        prompt = f"""
You are a SQLite SQL generator.

Table: products
Columns: {columns}

Rules:
- Only SELECT
- Only use listed columns
- Use LOWER(name) in WHERE
- Do NOT use COUNT unless user asks count
- Do NOT use SUM unless user asks total
- No explanation, only SQL

Question: {question}
SQL:
"""

        response = await self.model.create(
            [UserMessage(content=prompt, source="user")]
        )

        sql = response.content.strip()
        sql = sql.replace("```sql", "").replace("```", "").strip()

        return self.validate_sql(sql, columns)

    def validate_sql(self, sql, columns):
        if not sql.lower().startswith("select"):
            raise ValueError("Only SELECT allowed")

        match = re.search(r"select\s+(.*?)\s+from", sql, re.I)
        if not match:
            raise ValueError("Invalid SQL")

        used_cols = match.group(1)

        for col in used_cols.split(","):
            c = col.strip().lower()
            if "(" in c:   # aggregate
                continue
            if c not in columns and c != "*":
                raise ValueError(f"Invalid column generated: {c}")

        sql = re.sub(r"name\s*=\s*'([^']+)'", r"LOWER(name) = '\1'", sql, flags=re.I)
        return sql

    def run_sql(self, sql):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()

        cur.execute(sql)
        rows = cur.fetchall()
        cols = [d[0] for d in cur.description]

        conn.close()
        return cols, rows

    async def ask(self, question):
        print("\nUser:", question)

        try:
            sql = await self.text_to_sql(question)
        except Exception as e:
            print("SQL Error:", e)
            return

        print("\nSQL:", sql)

        cols, rows = self.run_sql(sql)

        print("\nResult:")
        print(" | ".join(cols))
        print("-" * 40)

        if not rows:
            print("No results found.")
            return

        for r in rows:
            print(" | ".join(str(x) for x in r))

async def main():
    agent = SimpleDBAgent()

    while True:
        q = input("\nAsk DB (or 'exit'): ")
        if q.lower() == "exit":
            break

        await agent.ask(q)


if __name__ == "__main__":
    asyncio.run(main())
