"""
Orchestrator Agent
The master coordinator that manages all other agents
Decides which agents to use and in what order
"""

from typing import Dict, Any, List
from agents.base_agent import BaseAgent

class OrchestratorAgent(BaseAgent):
    """
    Orchestrator coordinates all other agents
    It's the 'brain' that decides what needs to be done and who should do it
    """
    
    def __init__(self, client, available_agents: Dict[str, BaseAgent] = None):
        """
        Initialize the Orchestrator
        
        Args:
            client: The Groq LLM client
            available_agents: Dictionary of agent_name -> agent_instance
        """
        super().__init__(
            name="orchestrator",
            role="Master coordinator and task delegator",
            client=client
        )
        
        # Store references to all other agents
        self.available_agents = available_agents or {}
        
        # Current workflow being executed
        self.current_workflow: List[str] = []
        
        self.logger.info(f"Orchestrator ready with {len(self.available_agents)} agents")
    
    def add_agent(self, agent_name: str, agent: BaseAgent):
        """
        Add an agent to the orchestrator's team
        
        Args:
            agent_name: Name of the agent
            agent: The agent instance
        """
        self.available_agents[agent_name] = agent
        self.logger.info(f"Added agent: {agent_name}")
    
    def create_plan(self, task: str) -> List[Dict[str, str]]:
        """
        Create a step-by-step plan for completing a task
        Decides which agents should work on which parts
        
        Args:
            task: The main task to accomplish
            
        Returns:
            List of steps, each with agent and subtask
        """
        self.logger.info(f"Creating plan for task: {task[:100]}...")
        
        # Analyze the task and create a workflow
        plan = []
        
        # Step 1: Always start with planning
        plan.append({
            "agent": "planner",
            "subtask": f"Create detailed plan for: {task}",
            "step": 1
        })
        
        # Step 2: If task involves research, add researcher
        if any(word in task.lower() for word in ["research", "find", "analyze", "study"]):
            plan.append({
                "agent": "researcher",
                "subtask": "Research relevant information for the task",
                "step": 2
            })
        
        # Step 3: If task involves code, add coder
        if any(word in task.lower() for word in ["code", "program", "develop", "build", "backend", "architecture"]):
            plan.append({
                "agent": "coder",
                "subtask": "Develop code solution based on plan",
                "step": 3
            })
        
        # Step 4: If task involves data, add analyst
        if any(word in task.lower() for word in ["data", "csv", "analyze", "statistics", "business"]):
            plan.append({
                "agent": "analyst",
                "subtask": "Analyze data and provide insights",
                "step": 4
            })
        
        # Step 5: Add critic to review the work
        plan.append({
            "agent": "critic",
            "subtask": "Review all work done so far",
            "step": len(plan) + 1
        })
        
        # Step 6: Add optimizer to improve the solution
        plan.append({
            "agent": "optimizer",
            "subtask": "Optimize and improve the solution",
            "step": len(plan) + 1
        })
        
        # Step 7: Add validator to check quality
        plan.append({
            "agent": "validator",
            "subtask": "Validate final solution quality",
            "step": len(plan) + 1
        })
        
        # Step 8: Finally, create a report
        plan.append({
            "agent": "reporter",
            "subtask": "Generate comprehensive final report",
            "step": len(plan) + 1
        })
        
        self.logger.info(f"Plan created with {len(plan)} steps")
        return plan
    
    def execute(self, task: str) -> Dict[str, Any]:
        """
        Execute a task by coordinating multiple agents
        
        Args:
            task: The task to complete
            
        Returns:
            Final results from all agents
        """
        self.logger.info(f"=== ORCHESTRATOR STARTING TASK ===")
        self.logger.info(f"Task: {task}")
        
        # Mark as active
        self.is_active = True
        
        # Record the task
        self.add_to_memory("task_started", task)
        
        try:
            # Step 1: Create the execution plan
            plan = self.create_plan(task)
            self.current_workflow = [step["agent"] for step in plan]
            
            self.logger.info(f"Workflow: {' -> '.join(self.current_workflow)}")
            
            # Step 2: Execute each step in the plan
            results = []
            context = {"original_task": task}  # Shared context between agents
            
            for step in plan:
                agent_name = step["agent"]
                subtask = step["subtask"]
                step_num = step["step"]
                
                self.logger.info(f"\n--- Step {step_num}: {agent_name} ---")
                
                # Check if agent exists
                if agent_name not in self.available_agents:
                    self.logger.warning(f"Agent {agent_name} not available, skipping")
                    continue
                
                # Get the agent
                agent = self.available_agents[agent_name]
                
                # Execute the agent's task
                try:
                    # Add context to subtask
                    full_task = f"{subtask}\n\nContext: {context}"
                    
                    result = agent.execute(full_task)
                    
                    # Store result
                    results.append({
                        "step": step_num,
                        "agent": agent_name,
                        "result": result
                    })
                    
                    # Update shared context
                    context[f"{agent_name}_output"] = result
                    
                    self.logger.info(f"Step {step_num} completed successfully")
                    
                except Exception as e:
                    self.logger.error(f"Step {step_num} failed: {str(e)}")
                    results.append({
                        "step": step_num,
                        "agent": agent_name,
                        "result": {"status": "error", "message": str(e)}
                    })
            
            # Step 3: Compile final output
            final_result = {
                "status": "completed",
                "task": task,
                "workflow": self.current_workflow,
                "steps_executed": len(results),
                "results": results,
                "context": context
            }
            
            self.add_to_memory("task_completed", f"Executed {len(results)} steps")
            self.logger.info(f"=== TASK COMPLETED ===")
            
            return final_result
            
        except Exception as e:
            self.logger.error(f"Orchestration failed: {str(e)}")
            self.add_to_memory("task_failed", str(e))
            return {
                "status": "failed",
                "task": task,
                "error": str(e)
            }
        finally:
            self.is_active = False