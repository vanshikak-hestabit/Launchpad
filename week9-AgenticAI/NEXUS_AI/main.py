"""
NEXUS AI - Autonomous Multi-Agent System
Main entry point for the system

This system coordinates multiple specialized AI agents to solve complex tasks:
- Orchestrator: Master coordinator
- Planner: Strategic planning
- Researcher: Information gathering
- Coder: Software development
- Analyst: Data analysis
- Critic: Quality review
- Optimizer: Performance improvement
- Validator: Quality assurance
- Reporter: Final documentation
"""

import sys
import json
import logging
from datetime import datetime
from pathlib import Path

# Add project root to Python path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

# Import configuration
import settings as config 

# Import the Groq client
from config.hosted import openai_client

# Import all agents
from agents.orchestrator import OrchestratorAgent
from agents.planner import PlannerAgent
from agents.researcher import ResearcherAgent
from agents.coder import CoderAgent
from agents.analyst import AnalystAgent
from agents.critic import CriticAgent
from agents.optimizer import OptimizerAgent
from agents.validator import ValidatorAgent
from agents.reporter import ReporterAgent

def setup_logging():
    """
    Setup logging for the entire system
    Logs go to both file and console
    """
    # Create logs directory if needed
    config.LOGS_DIR.mkdir(exist_ok=True)
    
    # Configure root logger
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(config.LOG_FILE),
            logging.StreamHandler()
        ]
    )
    
    logger = logging.getLogger("NEXUS_AI")
    logger.info("=" * 80)
    logger.info("NEXUS AI SYSTEM STARTED")
    logger.info("=" * 80)
    return logger

class NexusAI:
    """
    Main NEXUS AI System Class
    Initializes and manages all agents
    """
    
    def __init__(self):
        """Initialize the NEXUS AI system"""
        self.logger = setup_logging()
        self.client = openai_client
        
        self.logger.info("Initializing NEXUS AI agents...")
        
        # Initialize all specialized agents
        self.planner = PlannerAgent(self.client)
        self.researcher = ResearcherAgent(self.client)
        self.coder = CoderAgent(self.client)
        self.analyst = AnalystAgent(self.client)
        self.critic = CriticAgent(self.client)
        self.optimizer = OptimizerAgent(self.client)
        self.validator = ValidatorAgent(self.client)
        self.reporter = ReporterAgent(self.client)
        
        # Create dictionary of available agents
        self.agents = {
            "planner": self.planner,
            "researcher": self.researcher,
            "coder": self.coder,
            "analyst": self.analyst,
            "critic": self.critic,
            "optimizer": self.optimizer,
            "validator": self.validator,
            "reporter": self.reporter
        }
        
        # Initialize the orchestrator with all agents
        self.orchestrator = OrchestratorAgent(
            client=self.client,
            available_agents=self.agents
        )
        
        self.logger.info(f"✓ All {len(self.agents) + 1} agents initialized successfully")
    
    def run(self, task: str) -> dict:
        """
        Run NEXUS AI on a task
        
        Args:
            task: The task description
            
        Returns:
            Dictionary with complete results from all agents
        """
        self.logger.info(f"\n{'='*80}")
        self.logger.info(f"NEW TASK RECEIVED")
        self.logger.info(f"{'='*80}")
        self.logger.info(f"Task: {task}\n")
        
        start_time = datetime.now()
        
        try:
            # Execute through orchestrator
            result = self.orchestrator.execute(task)
            
            # Calculate execution time
            end_time = datetime.now()
            duration = (end_time - start_time).total_seconds()
            
            result["execution_time_seconds"] = duration
            result["start_time"] = start_time.isoformat()
            result["end_time"] = end_time.isoformat()
            
            self.logger.info(f"\n{'='*80}")
            self.logger.info(f"TASK COMPLETED SUCCESSFULLY")
            self.logger.info(f"Execution time: {duration:.2f} seconds")
            self.logger.info(f"{'='*80}\n")
            
            return result
            
        except Exception as e:
            self.logger.error(f"Task execution failed: {str(e)}")
            return {
                "status": "error",
                "error": str(e),
                "task": task
            }
    
    def save_results(self, result: dict, filename: str = None):
        """
        Save results to a JSON file
        
        Args:
            result: The result dictionary to save
            filename: Optional custom filename
        """
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"nexus_result_{timestamp}.json"
        
        filepath = config.LOGS_DIR / filename
        
        with open(filepath, 'w') as f:
            json.dump(result, f, indent=2, default=str)
        
        self.logger.info(f"Results saved to: {filepath}")
        return filepath

# ============================================
# EXAMPLE TASKS (for testing)
# ============================================
EXAMPLE_TASKS = {
    "1": "Plan a startup in AI for healthcare",
    "2": "Generate backend architecture for scalable app",
    "3": "Analyze CSV & create business strategy",
    "4": "Design a RAG pipeline for 50k documents"
}

# ============================================
# MAIN EXECUTION
# ============================================
def main():
    """Main function to run NEXUS AI"""
    
    # Initialize NEXUS AI
    nexus = NexusAI()
    
    print("\n" + "="*80)
    print("NEXUS AI - Autonomous Multi-Agent System")
    print("="*80)
    print("\nExample Tasks:")
    for key, task in EXAMPLE_TASKS.items():
        print(f"  {key}. {task}")
    print("  5. Custom task")
    print("  0. Exit")
    
    while True:
        print("\n" + "-"*80)
        choice = input("\nSelect a task (0-5): ").strip()
        
        if choice == "0":
            print("\nExiting NEXUS AI. Goodbye!")
            break
        
        elif choice in EXAMPLE_TASKS:
            task = EXAMPLE_TASKS[choice]
            print(f"\nExecuting: {task}")
            
            # Run the task
            result = nexus.run(task)
            
            # Save results
            nexus.save_results(result)
            
            # Show summary
            print("\n" + "="*80)
            print("EXECUTION SUMMARY")
            print("="*80)
            print(f"Status: {result.get('status', 'unknown')}")
            print(f"Steps executed: {result.get('steps_executed', 0)}")
            print(f"Time taken: {result.get('execution_time_seconds', 0):.2f} seconds")
            
            # Ask if user wants to see detailed report
            show_details = input("\nShow detailed report? (y/n): ").strip().lower()
            if show_details == 'y':
                print("\n" + json.dumps(result, indent=2, default=str))
        
        elif choice == "5":
            custom_task = input("\nEnter your custom task: ").strip()
            if custom_task:
                print(f"\nExecuting: {custom_task}")
                result = nexus.run(custom_task)
                nexus.save_results(result)
                
                print("\n" + "="*80)
                print("EXECUTION SUMMARY")
                print("="*80)
                print(f"Status: {result.get('status', 'unknown')}")
                print(f"Steps executed: {result.get('steps_executed', 0)}")
                print(f"Time taken: {result.get('execution_time_seconds', 0):.2f} seconds")
        
        else:
            print("Invalid choice. Please select 0-5.")
        
        # Ask if user wants to continue
        continue_choice = input("\nRun another task? (y/n): ").strip().lower()
        if continue_choice != 'y':
            print("\nExiting NEXUS AI. Goodbye!")
            break

if __name__ == "__main__":
    main()