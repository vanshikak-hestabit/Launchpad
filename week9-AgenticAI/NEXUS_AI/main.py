import asyncio
import json
import os
import shutil
from autogen_agentchat.messages import TextMessage
from agents.planner import planner, ExecutionPlan
from agents.orchestrator import run_autonomous_loop
from memory.memory_manager import MemoryManager
from config import OUTPUT_DIR, LOG_DIR, LOG_FILE_PATH
from tools import create_log_entry



def initialize_workspace():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    os.makedirs(LOG_DIR, exist_ok=True)


async def generate_execution_plan(query) -> ExecutionPlan:
    memory_context = memory_manager.retrieve_context(query)
    enhanced_query = f"{query}\n\nMEMORY CONTEXT:\n{memory_context}"

    result = await planner.run(task=TextMessage(content=enhanced_query, source="user"))
    plan_data = json.loads(result.messages[-1].content)

    execution_plan = ExecutionPlan(**plan_data)

    create_log_entry(LOG_FILE_PATH, "planner", "plan_generated", {"steps": plan_data})

    return execution_plan


async def run_nexus(query):
    print(f"\nUSER QUERY: {query}\n")

    initialize_workspace()

    execution_plan = await generate_execution_plan(query)

    results = await run_autonomous_loop(execution_plan, query)

    return {"success": True, "results": results}

def clear_output_dir():
    if not os.path.exists(OUTPUT_DIR):
        return
    for f in os.listdir(OUTPUT_DIR):
        p = os.path.join(OUTPUT_DIR, f)
        try:
            if os.path.isfile(p):
                os.unlink(p)
            else:
                shutil.rmtree(p)
        except Exception as e:
            print(f"Warning: Could not delete {p}: {e}")


async def main():
    query = input("Enter your task: ")

    try:
        result = await run_nexus(query)
        print("\nEXECUTION COMPLETE\n")

    except Exception as e:
        print(f"\nSYSTEM ERROR: {e}")
        create_log_entry(LOG_FILE_PATH, "system", "fatal_error", {"error": str(e)})


if __name__ == "__main__":
    memory_manager = MemoryManager()
    asyncio.run(main())