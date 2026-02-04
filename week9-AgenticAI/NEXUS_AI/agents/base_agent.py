"""
Base Agent Class
All specialized agents inherit from this class
Provides common functionality like memory, logging, and tool use
"""

import json
import logging
from datetime import datetime
from typing import List, Dict, Any

class BaseAgent:
    """
    Base class for all agents in NEXUS AI
    Provides core functionality that every agent needs
    """
    
    def __init__(self, name: str, role: str, client):
        """
        Initialize the base agent
        
        Args:
            name: Agent's name (e.g., "planner", "coder")
            role: Agent's role description
            client: The Groq LLM client to use
        """
        self.name = name
        self.role = role
        self.client = client
        
        # Memory stores what the agent has done
        self.memory: List[Dict[str, Any]] = []
        
        # Track if agent is currently working
        self.is_active = False
        
        # Setup logging for this agent
        self.logger = self._setup_logger()
        
        self.logger.info(f"Agent {self.name} initialized with role: {self.role}")
    
    def _setup_logger(self) -> logging.Logger:
        """
        Create a logger for this agent
        Logs all agent activities to file and console
        
        Returns:
            Configured logger instance
        """
        logger = logging.getLogger(self.name)
        logger.setLevel(logging.INFO)
        
        # Create log file for this agent
        log_file = f"logs/{self.name}_agent.log"
        file_handler = logging.FileHandler(log_file)
        file_handler.setLevel(logging.INFO)
        
        # Create console output
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)
        
        # Format the log messages
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        file_handler.setFormatter(formatter)
        console_handler.setFormatter(formatter)
        
        # Add handlers to logger
        logger.addHandler(file_handler)
        logger.addHandler(console_handler)
        
        return logger
    
    def add_to_memory(self, event_type: str, content: str, metadata: Dict = None):
        """
        Store an event in the agent's memory
        
        Args:
            event_type: Type of event (e.g., "task", "result", "error")
            content: What happened
            metadata: Additional information (optional)
        """
        memory_item = {
            "timestamp": datetime.now().isoformat(),
            "event_type": event_type,
            "content": content,
            "metadata": metadata or {}
        }
        
        self.memory.append(memory_item)
        self.logger.info(f"Memory added: {event_type}")
    
    def get_memory_summary(self, last_n: int = 5) -> str:
        """
        Get a summary of recent memories
        
        Args:
            last_n: Number of recent memories to include
            
        Returns:
            Formatted string of recent memories
        """
        if not self.memory:
            return "No memories yet."
        
        recent = self.memory[-last_n:]
        summary = f"Recent memories for {self.name}:\n"
        
        for item in recent:
            summary += f"- [{item['event_type']}] {item['content']}\n"
        
        return summary
    
    def reflect(self) -> str:
        """
        Agent reflects on its recent work
        Uses memory to analyze what it has done
        
        Returns:
            Reflection text
        """
        self.logger.info(f"{self.name} is reflecting on recent work")
        
        if not self.memory:
            return "Nothing to reflect on yet."
        
        # Get last 5 memories
        recent_work = self.get_memory_summary(last_n=5)
        
        # Create reflection prompt
        prompt = f"""
You are {self.name}, a {self.role}.

Review your recent work:
{recent_work}

Provide a brief reflection:
1. What went well?
2. What could be improved?
3. Any lessons learned?

Keep it concise (3-4 sentences).
"""
        
        # Use LLM to generate reflection
        try:
            response = self._call_llm(prompt)
            self.add_to_memory("reflection", response)
            return response
        except Exception as e:
            self.logger.error(f"Reflection failed: {str(e)}")
            return f"Could not complete reflection: {str(e)}"
    
    def _call_llm(self, prompt: str, temperature: float = 0.7) -> str:
        """
        Make a call to the LLM
        
        Args:
            prompt: The prompt to send
            temperature: Creativity level (0-1)
            
        Returns:
            LLM response text
        """
        try:
            # This is a placeholder - actual implementation would use the client
            # For now, we'll simulate a response
            self.logger.info(f"Calling LLM with prompt length: {len(prompt)}")
            return f"[{self.name} processing request...]"
        except Exception as e:
            self.logger.error(f"LLM call failed: {str(e)}")
            raise
    
    def execute(self, task: str) -> Dict[str, Any]:
        """
        Main execution method - each agent overrides this
        
        Args:
            task: The task to execute
            
        Returns:
            Dictionary with results
        """
        raise NotImplementedError("Each agent must implement execute()")
    
    def __repr__(self):
        """String representation of the agent"""
        return f"Agent({self.name}, role={self.role}, active={self.is_active})"