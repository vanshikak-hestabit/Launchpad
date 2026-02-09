import json
from autogen_agentchat.agents import AssistantAgent
from utils.models import PlanModel, TaskModel
from utils.agent_runner import run_agent

def create_planner_agent(model_client):
    return AssistantAgent(
        name="Planner",
        system_message="""
You are an expert task orchestrator and planner.
Break user queries into atomic tasks with dependencies.

Return JSON:
{
  "tasks": [
    {"id": "task_1", "description": "...", "deps": []},
    {"id": "task_2", "description": "...", "deps": ["task_1"]}
  ]
}

Rules:
- task ids must be sequential
- create parallel tasks where possible
- always include a final synthesis task
""",
        model_client=model_client
    )


async def plan_tasks(planner_agent, query) -> PlanModel:
    reply = await run_agent(planner_agent, query)

    if "```" in reply:
        reply = reply.split("```")[1].strip()
    start = reply.find("{")
    end = reply.rfind("}")
    if start == -1 or end == -1:
        raise ValueError(f"Planner did not return JSON:\n{reply}")

    json_str = reply[start:end + 1]
    data = json.loads(json_str)
    tasks = [TaskModel(**t) for t in data["tasks"]]
    return PlanModel(tasks=tasks)