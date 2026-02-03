import asyncio
from groq_client import create_model_client
from utils.dag import init_task_status, get_ready_tasks
from utils.models import TaskStatus
from orchestrator.planner import create_planner_agent, plan_tasks
from agents.worker_agent import run_workers_parallel
from agents.reflector_agent import create_reflection_agent, reflect_answer
from agents.validator_agent import create_validator_agent, validate_answer


def print_dag(plan):
    """
    Pretty print a DAG with clear sections for level, tasks, and dependencies.
    """
    printed_tasks = set()
    level = 0
    print("\n" + "="*60)
    print("=== DAG TASK PLAN (PRETTY) ===")
    
    while len(printed_tasks) < len(plan.tasks):
        # Current level: tasks whose deps are all printed
        current_level = [
            t for t in plan.tasks
            if t.id not in printed_tasks and all(dep in printed_tasks for dep in t.deps)
        ]
        if not current_level:
            break
        
        level += 1
        print(f"\nLevel {level}")
        print("-"*60)
        
        # Tasks in this level
        print("Tasks:")
        for t in current_level:
            print(f"  {t.id}: {t.description}")
        print("\nDependencies:")
        for t in current_level:
            if t.deps:
                for dep in t.deps:
                    print(f"  {dep} --> {t.id}")
            else:
                print(f"  None --> {t.id}")
        
        printed_tasks.update(t.id for t in current_level)
    
    print("\n" + "="*60 + "\n")

   
    printed_tasks = set()
    level = 1

    print("\n=== DAG TASK PLAN (PRETTY) ===")
    print(f"{'Level':<6} | {'Task':<40} | {'Depends On'}")
    print("-" * 80)

    while len(printed_tasks) < len(plan.tasks):
        # Tasks whose dependencies are all printed
        current_level = [
            t for t in plan.tasks
            if t.id not in printed_tasks and all(dep in printed_tasks for dep in t.deps)
        ]

        for t in current_level:
            deps = ", ".join(t.deps) if t.deps else "None"
            task_desc = f"{t.id}: {t.description}"
            print(f"{level:<6} | {task_desc:<40} | {deps}")
            printed_tasks.add(t.id)

        level += 1

    print("=" * 80)

    """
    Prints DAG in levels, grouping parallel tasks together and showing dependencies.
    """
    printed_tasks = set()
    level = 1

    print("\n=== DAG TASK PLAN (LEVELS) ===")
    while len(printed_tasks) < len(plan.tasks):
        # Tasks whose dependencies are all printed
        current_level = [
            t for t in plan.tasks
            if t.id not in printed_tasks and all(dep in printed_tasks for dep in t.deps)
        ]

        if current_level:
            # Print tasks in the same line for parallelism
            line = " | ".join(f"{t.id} ({t.description})" for t in current_level)
            print(f"Level {level}: {line}")

            # Optionally, show arrows to next level
            for t in current_level:
                next_tasks = [n.id for n in plan.tasks if t.id in n.deps]
                if next_tasks:
                    print(f"  {t.id} --> {', '.join(next_tasks)}")

            for t in current_level:
                printed_tasks.add(t.id)
            level += 1
        else:
            break
    print("=============================\n")


async def main():
    user_query = input("Enter your query: ").strip()
    model_client = create_model_client()

    # 1. Planner
    planner_agent = create_planner_agent(model_client)
    plan = await plan_tasks(planner_agent, user_query)

    # Show DAG visually
    print_dag(plan)

    # 2. Workers (parallel execution with DAG)
    task_status = init_task_status(plan)
    task_results = {}

    while len(task_results) < len(plan.tasks):
        ready_tasks = get_ready_tasks(plan, task_status)

        if not ready_tasks:
            break

        print("\n--- Running Level ---")
        for t in ready_tasks:
            task_status[t.id] = TaskStatus.RUNNING
            print(f"Running task: {t.id} - {t.description}")

        results = await run_workers_parallel(ready_tasks, model_client)

        for task_id, output in results.items():
            task_status[task_id] = TaskStatus.DONE
            task_results[task_id] = output
            print(f"Task: {task_id} completed")

    # Merge worker outputs
    merged_output = "\n".join(
        f"{task_id}: {output}"
        for task_id, output in task_results.items()
    )

    # 3. Reflection
    reflection_agent = create_reflection_agent(model_client)
    refined_output = await reflect_answer(reflection_agent, merged_output)

    # 4. Validation
    validator_agent = create_validator_agent(model_client)
    validation = await validate_answer(validator_agent, refined_output)

    # Final result
    print("\n=== FINAL ANSWER ===\n")
    print(refined_output)

    print("\n=== VALIDATION ===")
    print(f"Verdict: {validation.verdict}")
    print(f"Reason: {validation.reason}")


if __name__ == "__main__":
    asyncio.run(main())
