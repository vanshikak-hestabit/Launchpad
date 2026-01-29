from curses import raw
import os
import json
import re
from tracemalloc import start
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.messages import TextMessage
from groq_client import create_model_client

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

JSON format:
{
  "actions": [
    {
      "action": "create_dir" | "write_text" | "read_text" | "list_files",
      "path": "relative/path",
      "filename": "file.txt" | null,
      "content": "text" | null
    }
  ]
}
"""
)


    def _safe_join(self, *paths):
        final_path = os.path.abspath(os.path.join(self.base_dir, *paths))
        if not final_path.startswith(self.base_dir):
            raise PermissionError(f"Blocked unsafe path: {final_path}")
        return final_path

    def _create_dir(self, rel_path: str):
        full_path = self._safe_join(rel_path)
        os.makedirs(full_path, exist_ok=True)
        return f"Created directory: {rel_path}"

    def _write_text(self, rel_path: str, content: str):
        full_path = self._safe_join(rel_path)

        dir_path = os.path.dirname(full_path)
        if dir_path and dir_path != self.base_dir:
            os.makedirs(dir_path, exist_ok=True)

        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content or "")

        return f"Wrote file: {rel_path}"


    def _read_text(self, rel_path: str):
        full_path = self._safe_join(rel_path)
        if not os.path.exists(full_path):
            return f"File not found: {rel_path}"

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

        start = raw.find("{")
        end = raw.rfind("}")

        if start == -1 or end == -1 or end <= start:
            return f"File agent error: Invalid JSON\nRaw:\n{raw}"

        cleaned = raw[start:end + 1]

        cleaned = cleaned.replace('"create_file"', '"write_text"')

        print("\n--- CLEANED FILE AGENT JSON ---\n", cleaned)

        try:
            data = json.loads(cleaned)
            actions = data.get("actions", [])
            results = []

            for step in actions:
                action = step.get("action")
                path = (step.get("path") or "").lstrip("/\\")
                filename = (step.get("filename") or "").lstrip("/\\")
                content = step.get("content")
                if path and filename and path == filename:
                    path = ""
                rel_path = os.path.join(path, filename).lstrip("/\\") if filename else path

                if action == "create_dir":
                    results.append(self._create_dir(path))


                elif action == "write_text":
                    results.append(self._write_text(rel_path, content))
                elif action == "read_text":
                    results.append(self._read_text(rel_path))

                elif action == "list_files":
                    results.append(self._list_files())

                else:
                    results.append(f"Unknown action: {action}")

            return "\n".join(results)

        except Exception as e:
            return f"File agent error: {e}\nRaw:\n{raw}"