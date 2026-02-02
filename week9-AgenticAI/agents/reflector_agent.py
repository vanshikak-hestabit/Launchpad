from autogen_agentchat.agents import AssistantAgent
from utils.agent_runner import run_agent

def create_reflection_agent(model_client):
    return AssistantAgent(
        name="Reflection",
        system_message="""
You are a reflection and improvement agent.
Critically review outputs and suggest improvements.
If needed, provide a refined version.
""",
        model_client=model_client
    )

async def reflect_answer(reflection_agent, merged_output):
    prompt = f"""
Review and improve this answer.

OUTPUT:
{merged_output}
"""
    reply = await run_agent(reflection_agent, prompt)
    return reply