from enum import Enum
from typing import List
from pydantic import BaseModel, Field


class TaskModel(BaseModel):
    id: str = Field(..., pattern=r"task_\d+")
    description: str
    deps: List[str]

class PlanModel(BaseModel):
    tasks: List[TaskModel]

class ValidationResult(BaseModel):
    verdict: str  
    reason: str

class TaskStatus(str, Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    DONE = "DONE"