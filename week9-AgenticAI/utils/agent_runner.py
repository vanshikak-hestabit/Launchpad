from autogen_agentchat.messages import TextMessage
from autogen_core import CancellationToken

async def run_agent(agent, prompt):
    cancellation_token = CancellationToken()
    response = await agent.on_messages(
        [TextMessage(content=prompt, source="user")],
        cancellation_token,
    )
    return response.chat_message.content