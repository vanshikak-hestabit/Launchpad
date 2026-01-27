from typing import List, Dict, Any, Callable, Optional
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.messages import TextMessage
from groq_client import create_model_client
from tools.code_executor import CodeExecutor
from tools.db_agent import DatabaseAgent
from tools.file_agent import FileAgent

class Orchestrator:
    def __init__(self, database_path: str = "user_data.db"):
        self.agents = {
            "code": CodeExecutor(),
            "database": DatabaseAgent(database_path),
            "file": FileAgent(),
        }

        self.coordinator = AssistantAgent(
            name="Coordinator",
            model_client=create_model_client(),
            system_message=(
"""
You are a task router.

Your job is to decide which tools are needed.

Available tools:
- code
- file
- database

Rules:
- Return ONLY tool names
- Separate multiple tools with commas
- No explanations
- No extra text
- Order matters

Routing logic:
- If user asks about SQL, tables, rows, CSV, database, queries, data → database
- If user asks to create or modify files/folders → file
- If user asks to write or run code → code
- If task involves both → combine tools

Examples:
- "Write a Python function" → code
- "Create folders and files" → file
- "Import this CSV and query it" → database
- "Show all users from uploaded CSV" → database
- "Build script and save results to DB" → code,database
- "Scaffold backend project" → file,code
"""

            ),
        )

    async def analyze_request(self, user_request: str):
        prompt = (
            f"Request: {user_request}\n\n"
            "Available tools: code, database, file\n"
            "Return tool names separated by commas."
        )

        response = await self.coordinator.on_messages(
            [TextMessage(content=prompt, source="user")],
            cancellation_token=None,
        )

        text = response.chat_message.content.lower().strip()
        tools = [t.strip() for t in text.split(",") if t.strip() in self.agents]
        return tools or ["code"]

    async def execute_with_agents(
        self,
        user_request: str,
        agent_names: List[str],
        status_callback: Optional[Callable[[str], None]] = None,
    ):
        results = {}

        for name in agent_names:
            if status_callback:
                status_callback(f"Running {name} agent...")

            agent = self.agents[name]
            results[name] = await agent.process_request(user_request)

        return results

    async def synthesize_results(
        self,
        user_request: str,
        results: Dict[str, Any],
    ):
        if not results:
            return "No results."

        parts = [f"User request: {user_request}\n"]
        for name, value in results.items():
            parts.append(f"{name.upper()} RESULT:\n{value}\n")

        parts.append("Give final answer.")
        prompt = "\n".join(parts)

        response = await self.coordinator.on_messages(
            [TextMessage(content=prompt, source="user")],
            cancellation_token=None,
        )

        return response.chat_message.content

    async def process_request(
        self,
        user_request: str,
        status_callback: Optional[Callable[[str], None]] = None,
    ):
        if status_callback:
            status_callback("Analyzing request...")

        agent_names = await self.analyze_request(user_request)

        if status_callback:
            status_callback(f"Using agents: {', '.join(agent_names)}")

        results = await self.execute_with_agents(
            user_request, agent_names, status_callback
        )

        if status_callback:
            status_callback("Synthesizing results...")

        final_answer = await self.synthesize_results(user_request, results)

        return {
            "final_answer": final_answer,
            "agents_used": agent_names,
            "agent_results": results,
        }