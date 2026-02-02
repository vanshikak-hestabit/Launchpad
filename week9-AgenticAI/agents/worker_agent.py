import asyncio
from autogen_agentchat.agents import AssistantAgent
from utils.agent_runner import run_agent

def create_worker_agent(name, model_client):
    return AssistantAgent(
        name=name,
        system_message="You execute assigned tasks accurately.",
        model_client=model_client,
    )

async def _run_single_worker(task, model_client):
    agent = create_worker_agent(task.id, model_client)
    reply = await run_agent(agent, task.description)
    return task.id, reply

async def run_workers_parallel(tasks, model_client):
    coros = [_run_single_worker(t, model_client) for t in tasks]
    results = await asyncio.gather(*coros)
    return {task_id: output for task_id, output in results}