import sqlite3
from src.utils.schema_loader import load_schema
from src.generator.sql_generator import generate_sql


def clean_sql(sql: str) -> str:
    sql = sql.strip()

    if sql.startswith("```"):
        sql = sql.replace("```sql", "").replace("```", "").strip()

    return sql


def guard_cte_syntax(sql: str):
    sql_lower = sql.lower().strip()

    if " as (" in sql_lower and "with" not in sql_lower.split():
        raise ValueError("Invalid SQL: CTE detected but missing WITH")


def validate_sql(sql: str) -> None:
    forbidden = ["insert", "update", "delete", "drop", "alter"]

    sql_lower = sql.lower().strip()

    for word in forbidden:
        if word in sql_lower:
            raise ValueError(
                "FORBIDDEN_INTENT: Only READ-ONLY SELECT queries are allowed."
            )
    if not (sql_lower.startswith("select") or sql_lower.startswith("with")):
        raise ValueError("SYNTAX_ERROR: Only SELECT queries are allowed")


def execute_sql(db_path: str, sql: str):

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute(sql)
    rows = cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]

    conn.close()
    return columns, rows


def summarize_result(columns, rows) -> str:
   
    if not rows:
        return "No data found."

    summary = "Results:\n"
    for row in rows:
        row_text = ", ".join(
            f"{col}: {value}" for col, value in zip(columns, row)
        )
        summary += row_text + "\n"

    return summary



def run_pipeline(question: str):

    forbidden_intents = ["delete", "update", "insert", "drop", "alter"]
    if any(word in question.lower() for word in forbidden_intents):
        return "FORBIDDEN_INTENT: Only READ-ONLY queries are allowed.", None

    schema = load_schema("sales.db")
    sql = generate_sql(question, schema)
    sql = clean_sql(sql)

    print("\n--- GENERATED SQL by LLM ---")
    print(sql)

    try:
        guard_cte_syntax(sql)
        validate_sql(sql)
        columns, rows = execute_sql("sales.db", sql)

    except ValueError as e:        
        print("\n SQL invalid. Asking LLM to fix it...")
        print("Reason:", e)

        sql = generate_sql(
        f"""
        The following SQL is INVALID.

        Errors:
        - It uses CTE-style syntax (AS (...))
        - It does NOT start with WITH
        - The first CTE is missing a name

        TASK:
        - Rewrite the SQL to VALID SQLite syntax
        - MUST start with WITH
        - MUST name every CTE
        - Do NOT change the query logic
        - Output ONLY SQL

        INVALID SQL:
        {sql}
        """,
        schema
    )

        sql = clean_sql(sql)

        print("\n--- REPAIRED SQL ---")
        print(sql)

        guard_cte_syntax(sql)
        validate_sql(sql)
        columns, rows = execute_sql("sales.db", sql)


    answer = summarize_result(columns, rows)

    return answer, sql

if __name__ == "__main__":
    user_question = input("Enter your question: ")
    result, sql = run_pipeline(user_question)
    print("The SQL query used for this question: ", sql)
    print(result)

