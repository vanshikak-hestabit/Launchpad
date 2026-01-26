import os
import subprocess
import tempfile
import asyncio
from model_client import create_model_client
from autogen_core.models import UserMessage

class SimpleCodeExecutor:
    def __init__(self):
        self.model = create_model_client()
        self.last_output = ""

    async def generate_code(self, user_request):
        prompt = f"""
You are a Python coding expert. Write complete Python code for this request:

User Request: {user_request}

Rules:
- Only Python code, no explanations
- Make the code executable without requiring user input
- Assign example values directly in the code if input is required
- Make sure the code prints the result
- Add comments to explain the code
"""
        response = await self.model.create([UserMessage(content=prompt, source="user")])

        code = response.content.strip()

        # remove markdown
        if "```" in code:
            code = code.replace("```python", "").replace("```", "").strip()

        # remove leading non-code lines
        lines = code.splitlines()
        while lines and not lines[0].startswith(("import", "from", "class", "def", "#")):
            lines.pop(0)

        code = "\n".join(lines)
        return code

    def execute_code(self, code):
        try:
            with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
                f.write(code)
                temp_file = f.name

            # Run the code
            result = subprocess.run(
                ["python3", temp_file],
                capture_output=True,
                text=True,
                timeout=10
            )

            # Delete temp file
            os.unlink(temp_file)

            return result.stdout, result.stderr

        except Exception as e:
            return "", f"Execution error: {str(e)}"

    async def run(self, user_request=None):
        if user_request is None:
            print("Welcome! Type your Python request or 'exit' to quit.")
            while True:
                user_request = input("\nEnter request: ")
                if user_request.lower() == "exit":
                    break
                await self._generate_and_execute(user_request)
        else:
            await self._generate_and_execute(user_request)

    async def _generate_and_execute(self, user_request):
        code = await self.generate_code(user_request)
        self.last_output = code
        print("\nGenerated Code:")
        print("-" * 60)
        print(code)
        print("-" * 60)

        stdout, stderr = self.execute_code(code)
        print("\nOUTPUT:")
        print("-" * 60)
        if stdout:
            print(stdout)
        if stderr:
            print(f"Errors:\n{stderr}")
        print("-" * 60)


if __name__ == "__main__":
    asyncio.run(SimpleCodeExecutor().run())
