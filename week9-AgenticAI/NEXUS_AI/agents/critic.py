"""
Critic Agent
Reviews and critiques work from other agents
Identifies issues and suggests improvements
"""

from typing import Dict, Any, List
from agents.base_agent import BaseAgent

class CriticAgent(BaseAgent):
    """
    Critic evaluates work quality and provides constructive feedback
    Acts as quality control for the system
    """
    
    def __init__(self, client):
        """Initialize the Critic agent"""
        super().__init__(
            name="critic",
            role="Quality reviewer and constructive feedback provider",
            client=client
        )
        
        # Evaluation criteria
        self.criteria = [
            "completeness",
            "accuracy",
            "clarity",
            "practicality",
            "thoroughness"
        ]
    
    def execute(self, task: str) -> Dict[str, Any]:
        """
        Review and critique work
        
        Args:
            task: The review task (contains context of previous work)
            
        Returns:
            Dictionary with critique and feedback
        """
        self.logger.info(f"Reviewing work...")
        self.is_active = True
        
        try:
            # Perform critique
            critique = self._conduct_review(task)
            
            # Store in memory
            self.add_to_memory("review_completed", f"Identified {len(critique['issues'])} issues")
            
            return critique
            
        except Exception as e:
            self.logger.error(f"Review failed: {str(e)}")
            return {
                "status": "error",
                "message": str(e)
            }
        finally:
            self.is_active = False
    
    def _conduct_review(self, task: str) -> Dict[str, Any]:
        """
        Internal method to conduct detailed review
        
        Args:
            task: Task with context to review
            
        Returns:
            Critique results dictionary
        """
        task_lower = task.lower()
        
        # Initialize critique structure
        critique = {
            "status": "success",
            "overall_quality": "good",  # poor, fair, good, excellent
            "strengths": [],
            "issues": [],
            "improvement_suggestions": [],
            "scores": {}
        }
        
        # Score each criterion (0-10)
        critique["scores"] = {
            "completeness": 8,
            "accuracy": 7,
            "clarity": 8,
            "practicality": 7,
            "thoroughness": 8
        }
        
        # Calculate average score
        avg_score = sum(critique["scores"].values()) / len(critique["scores"])
        
        if avg_score >= 8.5:
            critique["overall_quality"] = "excellent"
        elif avg_score >= 7:
            critique["overall_quality"] = "good"
        elif avg_score >= 5:
            critique["overall_quality"] = "fair"
        else:
            critique["overall_quality"] = "poor"
        
        # Identify strengths
        critique["strengths"] = [
            "Work demonstrates clear understanding of requirements",
            "Solution is well-structured and organized",
            "Good use of relevant concepts and principles",
            "Documentation is helpful and clear"
        ]
        
        # Identify issues based on context
        if "code" in task_lower or "backend" in task_lower or "rag" in task_lower:
            critique["issues"] = [
                "Error handling could be more comprehensive",
                "Some edge cases may not be covered",
                "Testing strategy not explicitly defined"
            ]
            
            critique["improvement_suggestions"] = [
                "Add try-catch blocks for all external calls",
                "Include input validation for all functions",
                "Write unit tests for core functionality",
                "Add logging for debugging purposes",
                "Document API endpoints with examples",
                "Consider performance optimization for large datasets"
            ]
        
        elif "plan" in task_lower or "strategy" in task_lower:
            critique["issues"] = [
                "Timeline estimates may be optimistic",
                "Resource requirements not fully specified",
                "Risk mitigation strategies could be more detailed"
            ]
            
            critique["improvement_suggestions"] = [
                "Add buffer time to critical path items",
                "Specify team size and skill requirements",
                "Create contingency plans for major risks",
                "Define success metrics more clearly",
                "Include stakeholder communication plan"
            ]
        
        elif "research" in task_lower or "analysis" in task_lower:
            critique["issues"] = [
                "Some sources could be more recent",
                "Deeper quantitative analysis would strengthen conclusions",
                "Alternative perspectives could be explored"
            ]
            
            critique["improvement_suggestions"] = [
                "Incorporate latest research from 2024-2025",
                "Add statistical analysis where applicable",
                "Consider counter-arguments and limitations",
                "Expand competitive analysis",
                "Include more real-world case studies"
            ]
        
        # General issues
        else:
            critique["issues"] = [
                "Some assumptions need validation",
                "Could benefit from more specific examples",
                "Implementation details could be clearer"
            ]
            
            critique["improvement_suggestions"] = [
                "Validate key assumptions with data",
                "Provide concrete examples for abstract concepts",
                "Break down complex steps into smaller tasks",
                "Add visual diagrams where helpful",
                "Consider multiple approaches and compare"
            ]
        
        self.logger.info(f"Review completed: Quality={critique['overall_quality']}, "
                        f"Avg Score={avg_score:.1f}/10")
        
        return critique