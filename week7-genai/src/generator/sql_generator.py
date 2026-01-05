import os
from dotenv import load_dotenv
from openai import OpenAI


load_dotenv()

client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=os.environ.get("OPEN_API_KEY")
)


def generate_sql(question: str, schema: str) -> str:
    SYSTEM_PROMPT = f"""
- If using CTEs, ALWAYS start with WITH
- Every CTE must have a name
- Ensure parentheses are balanced
- Output ONLY valid SQLite SQL

Database schema:
{schema}

Rules:
- Generate ONLY a SQL SELECT query
- Do NOT use DELETE, UPDATE, INSERT, DROP
- Use only tables and columns from the schema
- NEVER aggregate after joining two fact tables
- First aggregate each table separately
- Use CTEs when needed

"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": question},
        ],
        temperature=0
    )

    sql = response.choices[0].message.content.strip()

    return sql
