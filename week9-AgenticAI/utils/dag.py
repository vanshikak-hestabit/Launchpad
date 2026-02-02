from typing import Dict
from utils.models import TaskStatus, PlanModel

def init_task_status(plan: PlanModel) -> Dict[str, TaskStatus]:
    return {t.id: TaskStatus.PENDING for t in plan.tasks}

def get_ready_tasks(plan: PlanModel, task_status: Dict[str, TaskStatus]):
    return [
        t for t in plan.tasks
        if task_status[t.id] == TaskStatus.PENDING
        and all(task_status[dep] == TaskStatus.DONE for dep in t.deps)
    ]