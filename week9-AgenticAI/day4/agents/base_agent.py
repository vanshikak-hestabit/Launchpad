import asyncio
from autogen_core import CancellationToken
from autogen_core.models import (
    SystemMessage,
    UserMessage,
    AssistantMessage,
)

class BaseAgent:
    def __init__(self, name: str, system_prompt: str, llm):
        self.name = name
        self.system_prompt = system_prompt.strip()
        self.llm = llm
        self.history = []

    def _build_messages(self, user_input: str):
        messages = [SystemMessage(content=self.system_prompt,source="system")]
        
        for m in self.history:
            if m["role"] == "user":
                messages.append(UserMessage(content=m["content"],source="user"))
            elif m["role"] == "assistant":
                messages.append(AssistantMessage(content=m["content"],source="assistant"))

        messages.append(UserMessage(content=user_input,source="user"))

        return messages

    async def _generate(self, messages):
        result = await self.llm.create(messages=messages,cancellation_token=CancellationToken())

        if isinstance(result.content, str):
            return result.content

        if isinstance(result.content, list) and result.content:
            item = result.content[0]
            if isinstance(item, dict):
                return item.get("text", "")
            return str(item)

        return str(result)

    def run(self, user_input: str) -> str:
        messages = self._build_messages(user_input)
        try:
            response = asyncio.run(self._generate(messages))
        except RuntimeError:
            loop = asyncio.get_event_loop()
            response = loop.run_until_complete(self._generate(messages))

        self.history.append({"role": "user", "content": user_input})
        self.history.append({"role": "assistant", "content": response})
        return response