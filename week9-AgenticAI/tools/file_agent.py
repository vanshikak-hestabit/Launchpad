import os
import csv
from model_client import create_model_client
from autogen_core.models import UserMessage

class FileAgent:
    def __init__(self):
        self.model = create_model_client()
        self.files_dir = "created_files"

        if not os.path.exists(self.files_dir):
            os.makedirs(self.files_dir)
            print(f"Created files directory: {self.files_dir}")

    async def understand_request(self, user_request):
        prompt = f"""You are a file operation expert. Analyze the user's request and determine what file operation to perform.

User Request: {user_request}

Respond with ONLY a JSON object:
{{
    "operation": "read|write|create",
    "file_type": "txt|csv",
    "filename": "name of file",
    "content": "content to write (if creating/writing)",
    "filter": ""
}}
JSON:"""

        response = await self.model.create([UserMessage(content=prompt, source="user")])
        text = response.content.strip()

        # Extract JSON from any extra text
        start = text.find("{")
        end = text.rfind("}") + 1
        if start != -1 and end != -1:
            text = text[start:end]

        import json
        try:
            data = json.loads(text)
        except:
            data = {"operation": None, "file_type": None, "filename": None, "content": ""}
        return data

    def create_txt_file(self, filename, content):
        path = os.path.join(self.files_dir, filename)
        try:
            with open(path, 'w') as f:
                f.write(content)
            print(f"Created text file: {filename} at {path}")
            return True
        except Exception as e:
            print(f"Error creating file: {e}")
            return False

    def create_csv_file(self, filename, content):
        path = os.path.join(self.files_dir, filename)
        try:
            rows = [row.strip().split(',') for row in content.strip().split('\n')]
            with open(path, 'w', newline='') as f:
                writer = csv.writer(f)
                writer.writerows(rows)
            print(f"Created CSV file: {filename} at {path}")
            return True
        except Exception as e:
            print(f"Error creating CSV: {e}")
            return False

    def read_txt_file(self, filename):
        path = os.path.join(self.files_dir, filename)
        try:
            with open(path, 'r') as f:
                content = f.read()
            print(content)
            return content
        except FileNotFoundError:
            print(f"File not found: {filename}")
            return None

    def read_csv_file(self, filename):
        path = os.path.join(self.files_dir, filename)
        try:
            with open(path, 'r') as f:
                rows = list(csv.reader(f))
            for r in rows:
                print(" | ".join(r))
            return rows
        except FileNotFoundError:
            print(f"File not found: {filename}")
            return None

    async def run_json(self, filename, content):
        if filename.endswith(".csv"):
            self.create_csv_file(filename, content)
        else:
            self.create_txt_file(filename, content)

    async def run(self, user_request=None):
        print("FileAgent Ready!")
        if user_request:
            requests = [user_request]
        else:
            requests = []
            while True:
                req = input("\nEnter request: ")
                if req.lower() == "exit":
                    return
                requests.append(req)

        for req in requests:
            print(f"\n{'='*60}\nUSER REQUEST: {req}\n{'='*60}")
            details = await self.understand_request(req)
            op = details.get("operation")
            ftype = details.get("file_type")
            fname = details.get("filename")
            content = details.get("content") or ""

            if op and ("create" in op or "write" in op):
                if ftype == "txt":
                    self.create_txt_file(fname, content)
                elif ftype == "csv":
                    self.create_csv_file(fname, content)
            elif op == "read":
                if ftype == "txt":
                    self.read_txt_file(fname)
                elif ftype == "csv":
                    self.read_csv_file(fname)
        return
