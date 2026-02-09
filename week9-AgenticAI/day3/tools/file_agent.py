import os
import json
import re
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.messages import TextMessage
from utils.day3_client import create_model_client

class FileAgent:
    def __init__(self, base_dir: str = "created_files"):
        self.base_dir = os.path.abspath(base_dir)
        os.makedirs(self.base_dir, exist_ok=True)
        self.agent = AssistantAgent(
            name="FileAgent",
            model_client=create_model_client(),
            system_message="""
You are a file system agent.
Return STRICT VALID JSON ONLY.
No explanations. No markdown. No backticks.

CRITICAL JSON RULES:
- Every action object MUST contain: action, path, filename, content
- Use null for unused fields
- Escape all newlines in content using \\n
- Do NOT output partial JSON
- Do NOT truncate output

Valid actions: create_dir, write_text, read_text, list_files

Each action MUST be a SINGLE atomic operation.
NEVER combine actions.
"""
        )

    def _safe_join(self, filename: str):
        # Always write inside created_files, ignore any path
        full_path = os.path.abspath(os.path.join(self.base_dir, filename))
        if not full_path.startswith(self.base_dir):
            raise PermissionError(f"Blocked unsafe path: {full_path}")
        return full_path

    def _write_text(self, filename: str, content: str):
        full_path = self._safe_join(filename)

        # Decode escaped sequences like \n to real newlines
        if content:
            content = content.encode("utf-8").decode("unicode_escape")

        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content or "")

        return f"Wrote file: {filename}"

    def _read_text(self, filename: str):
        full_path = self._safe_join(filename)
        if not os.path.exists(full_path):
            return f"File not found: {filename}"
        with open(full_path, "r", encoding="utf-8") as f:
            return f.read()

    def _list_files(self):
        files = []
        for root, _, filenames in os.walk(self.base_dir):
            for name in filenames:
                files.append(os.path.relpath(os.path.join(root, name), self.base_dir))
        return "\n".join(files) or "No files found."

    async def process_request(self, request: str):
        response = await self.agent.on_messages(
            [TextMessage(content=request, source="user")],
            cancellation_token=None
        )

        raw = response.chat_message.content.strip()
        raw = re.sub(r"```json", "", raw, flags=re.IGNORECASE).strip()
        raw = re.sub(r"```", "", raw).strip()

        # Match ALL JSON objects in the raw response
        json_objects = re.findall(r"\{.*?\}", raw, flags=re.DOTALL)
        if not json_objects:
            return f"File agent error: No valid JSON found\nRaw:\n{raw}"

        results = []

        for obj in json_objects:
            try:
                cleaned = obj.replace('"create_file"', '"write_text"')  # fix misnamed actions
                step = json.loads(cleaned)

                action = step.get("action")
                filename = (step.get("filename") or "").strip()
                content = step.get("content") or ""

                # Only write files, ignore everything else
                if action == "write_text" and filename:
                    results.append(self._write_text(filename, content))

            except Exception as e:
                results.append(f"Error processing JSON: {e}\nRaw:\n{obj}")

        return "\n".join(results)
