import sqlite3
import csv
import os
from unittest import result
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.messages import TextMessage
from groq_client import create_model_client

class DatabaseAgent:
    def __init__(self, db_path: str = ""):
        self.db_path = db_path
        self.agent = AssistantAgent(
    name="DatabaseAgent",
    model_client=create_model_client(),
    system_message=(
        "You are a SQLite query generator.\n"
        "\n"
        "STRICT RULES:\n"
        "1. NEVER generate CREATE TABLE.\n"
        "2. NEVER generate DROP TABLE.\n"
        "3. NEVER generate ALTER TABLE.\n"
        "4. Assume all required tables ALREADY EXIST.\n"
        "5. Only generate ONE valid SQLite statement.\n"
        "6. Use SELECT for data retrieval.\n"
        "7. Use INSERT/UPDATE only if user explicitly asks to modify data.\n"
        "8. Do NOT include explanations.\n"
        "9. Do NOT use markdown.\n"
        "10. Do NOT wrap output in backticks.\n"
        "11. Use ONLY columns that exist in the SQLite database.\n"
        "12. NEVER invent column names.\n"
        "13. Infer the correct table name from the user's question.\n"
        "14. If multiple tables exist, choose the most relevant one.\n"
        "15. In the products table, the product name column is called 'name', NOT 'product_name' or 'type'."

    )
)


    def _table_exists(self, table_name: str):
        conn = sqlite3.connect(self.db_path, check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
            (table_name,)
        )
        exists = cursor.fetchone() is not None
        conn.close()
        return exists

    def import_csv(self, csv_path: str, table_name: str):
        if not os.path.exists(csv_path):
            return f"File not found: {csv_path}"
        if self._table_exists(table_name):
            return f"Table '{table_name}' already exists. Skipping CSV import."
        conn = sqlite3.connect(self.db_path, check_same_thread=False)

        cursor = conn.cursor()

        with open(csv_path, "r", encoding="utf-8") as f:
            reader = csv.reader(f)
            headers = next(reader)
            columns_def = ", ".join([f'"{h}" TEXT' for h in headers])
            cursor.execute(f'CREATE TABLE "{table_name}" ({columns_def})')
            placeholders = ", ".join(["?"] * len(headers))
            insert_query = f'INSERT INTO "{table_name}" VALUES ({placeholders})'
            for row in reader:
                cursor.execute(insert_query, row)
        conn.commit()
        conn.close()
        return f"Imported CSV into table '{table_name}' successfully."

    def _execute_sql(self, query: str):
        lowered = query.strip().lower()

        if any(kw in lowered for kw in ["create table", "drop table", "alter table"]):
            return "Blocked unsafe SQL operation (DDL is not allowed)."

        conn = sqlite3.connect(self.db_path, check_same_thread=False)

        cursor = conn.cursor()
        try:
            cursor.execute(query)

            if lowered.startswith("select"):
                rows = cursor.fetchall()
                columns = [desc[0] for desc in cursor.description]
                if not rows:
                    result = "Query executed successfully but returned no rows."
                else:
                    result = " | ".join(columns) + "\n"
                    result += "-" * 50 + "\n"
                    for row in rows[:100]:
                        result += " | ".join(str(v) for v in row) + "\n"
            else:
                conn.commit()
                result = f"Query executed successfully. Rows affected: {cursor.rowcount}"

        except sqlite3.Error as e:
            result = f"SQL Error: {e}"
        conn.close()
        return result

    async def process_request(self, task: str):
        response = await self.agent.on_messages(
            [TextMessage(content=task, source="user")],
            cancellation_token=None
        )
        sql_query = response.chat_message.content.strip()
        print("\n--- GENERATED SQL ---\n", sql_query)
        return self._execute_sql(sql_query)