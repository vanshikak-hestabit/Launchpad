"""
Planner Agent
Creates detailed step-by-step plans for tasks
Breaks down complex problems into manageable steps
"""

from typing import Dict, Any
from agents.base_agent import BaseAgent

class PlannerAgent(BaseAgent):
    """
    Planner creates structured plans for task execution
    It thinks ahead and organizes work logically
    """
    
    def __init__(self, client):
        """Initialize the Planner agent"""
        super().__init__(
            name="planner",
            role="Strategic planner and task breakdown specialist",
            client=client
        )
    
    def execute(self, task: str) -> Dict[str, Any]:
        """
        Create a detailed plan for the given task
        
        Args:
            task: The task to plan
            
        Returns:
            Dictionary with the plan details
        """
        self.logger.info(f"Planning task: {task[:100]}...")
        self.is_active = True
        
        try:
            # Analyze the task
            plan_result = self._create_detailed_plan(task)
            
            # Store in memory
            self.add_to_memory("plan_created", f"Created plan with {len(plan_result['steps'])} steps")
            
            return plan_result
            
        except Exception as e:
            self.logger.error(f"Planning failed: {str(e)}")
            return {
                "status": "error",
                "message": str(e)
            }
        finally:
            self.is_active = False
    
    def _create_detailed_plan(self, task: str) -> Dict[str, Any]:
        """
        Internal method to create a detailed plan
        
        Args:
            task: Task description
            
        Returns:
            Structured plan dictionary
        """
        # Extract key information from task
        task_lower = task.lower()
        
        # Initialize plan structure
        plan = {
            "status": "success",
            "task": task,
            "steps": [],
            "estimated_complexity": "medium",
            "required_agents": []
        }
        
        # Determine complexity
        if len(task.split()) > 50 or any(word in task_lower for word in ["complex", "advanced", "comprehensive"]):
            plan["estimated_complexity"] = "high"
        elif len(task.split()) < 20:
            plan["estimated_complexity"] = "low"
        
        # Create steps based on task type
        
        # Step 1: Understand requirements
        plan["steps"].append({
            "step_number": 1,
            "action": "Understand Requirements",
            "description": "Analyze and clarify what needs to be accomplished",
            "agent_needed": "planner"
        })
        
        # Step 2: Research if needed
        if any(word in task_lower for word in ["research", "find", "learn", "discover"]):
            plan["steps"].append({
                "step_number": len(plan["steps"]) + 1,
                "action": "Research Information",
                "description": "Gather necessary information and resources",
                "agent_needed": "researcher"
            })
            plan["required_agents"].append("researcher")
        
        # Step 3: Design/Architecture if needed
        if any(word in task_lower for word in ["design", "architecture", "structure", "build", "backend"]):
            plan["steps"].append({
                "step_number": len(plan["steps"]) + 1,
                "action": "Design Solution",
                "description": "Create architecture and design specifications",
                "agent_needed": "planner"
            })
        
        # Step 4: Implementation
        if any(word in task_lower for word in ["code", "develop", "build", "create", "implement"]):
            plan["steps"].append({
                "step_number": len(plan["steps"]) + 1,
                "action": "Implement Solution",
                "description": "Build the actual solution/code",
                "agent_needed": "coder"
            })
            plan["required_agents"].append("coder")
        
        # Step 5: Data Analysis if needed
        if any(word in task_lower for word in ["analyze", "data", "csv", "statistics", "metrics"]):
            plan["steps"].append({
                "step_number": len(plan["steps"]) + 1,
                "action": "Analyze Data",
                "description": "Process and analyze relevant data",
                "agent_needed": "analyst"
            })
            plan["required_agents"].append("analyst")
        
        # Step 6: Review
        plan["steps"].append({
            "step_number": len(plan["steps"]) + 1,
            "action": "Review Work",
            "description": "Critically review all completed work",
            "agent_needed": "critic"
        })
        plan["required_agents"].append("critic")
        
        # Step 7: Optimize
        plan["steps"].append({
            "step_number": len(plan["steps"]) + 1,
            "action": "Optimize Solution",
            "description": "Improve and refine the solution",
            "agent_needed": "optimizer"
        })
        plan["required_agents"].append("optimizer")
        
        # Step 8: Validate
        plan["steps"].append({
            "step_number": len(plan["steps"]) + 1,
            "action": "Validate Quality",
            "description": "Ensure solution meets quality standards",
            "agent_needed": "validator"
        })
        plan["required_agents"].append("validator")
        
        # Step 9: Document
        plan["steps"].append({
            "step_number": len(plan["steps"]) + 1,
            "action": "Create Report",
            "description": "Generate final documentation and report",
            "agent_needed": "reporter"
        })
        plan["required_agents"].append("reporter")
        
        # Remove duplicates from required agents
        plan["required_agents"] = list(set(plan["required_agents"]))
        
        self.logger.info(f"Plan created: {len(plan['steps'])} steps, complexity: {plan['estimated_complexity']}")
        
        return plan