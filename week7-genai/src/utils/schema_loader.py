import sqlite3

def load_schema(db_path: str) -> str:
    """
    Reads database schema and returns it as plain text.
    """
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT name FROM sqlite_master
        WHERE type='table';
    """)

    tables = cursor.fetchall()
    schema = ""

    for table in tables:
        table_name = table[0]
        schema += f"\nTable: {table_name}\n"

        cursor.execute(f"PRAGMA table_info({table_name});")
        columns = cursor.fetchall()

        for col in columns:
            schema += f"- {col[1]} ({col[2]})\n"

    conn.close()
    return schema
