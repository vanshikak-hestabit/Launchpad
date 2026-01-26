import asyncio
import json
from tools.code_executor import SimpleCodeExecutor
from tools.db_agent import SimpleDBAgent
from tools.file_agent import FileAgent
from model_client import create_model_client
from autogen_core.models import UserMessage


class ToolOrchestrator:
    def __init__(self):
        self.file_agent = FileAgent()
        self.db_agent = SimpleDBAgent()
        self.code_executor = SimpleCodeExecutor()
        self.model = create_model_client()

    # decide tool

    async def decide_tools(self, user_request):
        prompt = f"""
You are an AI Tool Orchestrator.

User request:
"{user_request}"

Available tools:
- code_executor : generates Python code
- file_agent    : creates / writes files
- db_agent      : database queries

Rules:
- If user asks about database, sql, table, price, quantity → use db_agent ONLY.
- If user asks for code → use code_executor.
- If user asks to save/create/write file → use file_agent.
- If code + file → run code_executor first, then file_agent.
- NEVER generate python code for database questions.
- Return ONLY JSON.

Schema:
{{
  "tools": [],
  "instructions": {{
    "code_executor": {{"user_request": ""}},
    "file_agent": {{"filename": "", "content": ""}},
    "db_agent": {{"user_query": ""}}
  }}
}}
"""

        response = await self.model.create([UserMessage(content=prompt, source="user")])
        raw = response.content

        if isinstance(raw, list):
            raw = raw[0].text

        start = raw.find("{")
        end = raw.rfind("}") + 1
        raw = raw[start:end]

        try:
            return json.loads(raw)
        except Exception as e:
            print("LLM JSON error:", e)
            print("RAW LLM OUTPUT:\n", raw)
            return {"tools": [], "instructions": {}}

    async def handle_request(self, user_request):
        decision = await self.decide_tools(user_request)
        tools = decision.get("tools", [])
        instructions = decision.get("instructions", {})

        for tool in tools:

            if tool == "db_agent":
                q = instructions.get("db_agent", {}).get("user_query", user_request)
                await self.db_agent.ask(q)

            elif tool == "code_executor":
                code_req = instructions.get("code_executor", {}).get("user_request", user_request)
                await self.code_executor.run(code_req)

            elif tool == "file_agent":
                fname = instructions.get("file_agent", {}).get("filename", "output.txt")
                content = instructions.get("file_agent", {}).get("content", "")

                if content == "USE_OUTPUT_FROM_CODE_EXECUTOR":
                    content = self.code_executor.last_output

                await self.file_agent.run_json(fname, content)

async def main():
    orchestrator = ToolOrchestrator()
    print("Welcome to AI Tool Orchestrator!")
    print("Type your request or 'exit' to quit.")

    while True:
        user_request = input("\nEnter request: ")
        if user_request.lower() == "exit":
            break

        await orchestrator.handle_request(user_request)


if __name__ == "__main__":
    asyncio.run(main())
