import io
from contextlib import redirect_stdout
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.messages import TextMessage
from groq_client import create_model_client

class CodeExecutor:
    def __init__(self):
        self.agent = AssistantAgent(
            name="CodeExecutor",
            model_client=create_model_client(),
            system_message=(
                "You are a Python coding agent.\n"
                "Write valid Python code only.\n"
                "No explanations. No markdown. No backticks.\n"
                "Use print() to show results.\n"
            ),
        )

    def execute_python(self, code: str):
        out = io.StringIO()
        try:
            with redirect_stdout(out):
                exec(code, {"__builtins__": __builtins__}, {})
            return out.getvalue().strip() or "Code executed successfully."
        except Exception as e:
            return f"Execution failed: {e}"

    async def process_request(self, task: str):
        response = await self.agent.on_messages(
            [TextMessage(content=task, source="user")],
            cancellation_token=None,
        )
        code = response.chat_message.content.strip()
        result = self.execute_python(code)
        return {
            "generated_code": code,
            "execution_result": result,
        }