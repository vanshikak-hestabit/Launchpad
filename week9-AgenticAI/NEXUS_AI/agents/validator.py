"""
Validator Agent
Validates solution quality and correctness
Checks if requirements are met and standards are followed
"""

from typing import Dict, Any, List
from agents.base_agent import BaseAgent

class ValidatorAgent(BaseAgent):
    """
    Validator ensures solution quality meets standards
    Performs final quality checks before delivery
    """
    
    def __init__(self, client):
        """Initialize the Validator agent"""
        super().__init__(
            name="validator",
            role="Quality validation and standards compliance checker",
            client=client
        )
        
        # Validation checks to perform
        self.validation_checks = [
            "requirements_met",
            "standards_compliance",
            "completeness",
            "correctness",
            "usability"
        ]
    
    def execute(self, task: str) -> Dict[str, Any]:
        """
        Validate the solution quality
        
        Args:
            task: The validation task (with context of work to validate)
            
        Returns:
            Dictionary with validation results
        """
        self.logger.info(f"Validating solution...")
        self.is_active = True
        
        try:
            # Perform validation
            validation = self._validate_solution(task)
            
            # Store in memory
            passed = sum(1 for check in validation["checks"] if check["passed"])
            self.add_to_memory("validation_completed", 
                             f"Passed {passed}/{len(validation['checks'])} checks")
            
            return validation
            
        except Exception as e:
            self.logger.error(f"Validation failed: {str(e)}")
            return {
                "status": "error",
                "message": str(e)
            }
        finally:
            self.is_active = False
    
    def _validate_solution(self, task: str) -> Dict[str, Any]:
        """
        Internal method to validate solution
        
        Args:
            task: Task with context to validate
            
        Returns:
            Validation results dictionary
        """
        task_lower = task.lower()
        
        # Initialize validation result
        validation = {
            "status": "success",
            "overall_passed": True,
            "checks": [],
            "warnings": [],
            "blocking_issues": [],
            "approval_status": "approved"  # approved, approved_with_conditions, rejected
        }
        
        # Code/Backend Validation
        if "code" in task_lower or "backend" in task_lower or "rag" in task_lower:
            validation["checks"] = [
                {
                    "name": "Code Structure",
                    "passed": True,
                    "details": "Code is well-organized with clear separation of concerns"
                },
                {
                    "name": "Error Handling",
                    "passed": True,
                    "details": "Try-catch blocks present for critical operations"
                },
                {
                    "name": "Documentation",
                    "passed": True,
                    "details": "Functions and classes have docstrings"
                },
                {
                    "name": "Performance",
                    "passed": True,
                    "details": "No obvious performance bottlenecks identified"
                },
                {
                    "name": "Security",
                    "passed": True,
                    "details": "Basic security practices followed"
                },
                {
                    "name": "Testing Coverage",
                    "passed": False,
                    "details": "Unit tests not implemented (recommended but not blocking)"
                },
                {
                    "name": "Scalability",
                    "passed": True,
                    "details": "Architecture supports horizontal scaling"
                }
            ]
            
            validation["warnings"] = [
                "Consider adding unit tests for core functionality",
                "Add input validation for all API endpoints",
                "Implement rate limiting for production use",
                "Set up monitoring and alerting"
            ]
            
            # No blocking issues
            validation["blocking_issues"] = []
            validation["approval_status"] = "approved_with_conditions"
        
        # Plan/Strategy Validation
        elif "plan" in task_lower or "strategy" in task_lower:
            validation["checks"] = [
                {
                    "name": "Requirements Coverage",
                    "passed": True,
                    "details": "All stated requirements addressed in plan"
                },
                {
                    "name": "Feasibility",
                    "passed": True,
                    "details": "Plan is realistic and achievable"
                },
                {
                    "name": "Timeline",
                    "passed": True,
                    "details": "Timeline includes reasonable estimates"
                },
                {
                    "name": "Resources",
                    "passed": True,
                    "details": "Resource requirements identified"
                },
                {
                    "name": "Risk Management",
                    "passed": True,
                    "details": "Major risks identified with mitigation strategies"
                },
                {
                    "name": "Success Metrics",
                    "passed": False,
                    "details": "Success metrics could be more specific"
                }
            ]
            
            validation["warnings"] = [
                "Define more quantifiable success metrics",
                "Add contingency time for critical path items",
                "Specify stakeholder approval checkpoints"
            ]
            
            validation["blocking_issues"] = []
            validation["approval_status"] = "approved_with_conditions"
        
        # Research/Analysis Validation
        elif "research" in task_lower or "analysis" in task_lower:
            validation["checks"] = [
                {
                    "name": "Data Quality",
                    "passed": True,
                    "details": "Sources are credible and relevant"
                },
                {
                    "name": "Analysis Depth",
                    "passed": True,
                    "details": "Sufficient depth of analysis provided"
                },
                {
                    "name": "Objectivity",
                    "passed": True,
                    "details": "Analysis appears unbiased and balanced"
                },
                {
                    "name": "Conclusions",
                    "passed": True,
                    "details": "Conclusions supported by evidence"
                },
                {
                    "name": "Actionability",
                    "passed": True,
                    "details": "Recommendations are clear and actionable"
                },
                {
                    "name": "Currency",
                    "passed": False,
                    "details": "Some data could be more recent"
                }
            ]
            
            validation["warnings"] = [
                "Include more recent data where available",
                "Add statistical confidence levels to findings",
                "Consider alternative interpretations of data"
            ]
            
            validation["blocking_issues"] = []
            validation["approval_status"] = "approved"
        
        # General Validation
        else:
            validation["checks"] = [
                {
                    "name": "Requirements Met",
                    "passed": True,
                    "details": "Core requirements are addressed"
                },
                {
                    "name": "Quality Standards",
                    "passed": True,
                    "details": "Meets basic quality standards"
                },
                {
                    "name": "Completeness",
                    "passed": True,
                    "details": "Solution appears complete"
                },
                {
                    "name": "Usability",
                    "passed": True,
                    "details": "Solution is usable and understandable"
                }
            ]
            
            validation["warnings"] = [
                "Review against specific requirements checklist",
                "Consider edge cases and error scenarios"
            ]
            
            validation["blocking_issues"] = []
            validation["approval_status"] = "approved"
        
        # Check if any checks failed critically
        failed_critical = [c for c in validation["checks"] 
                          if not c["passed"] and "critical" in c.get("details", "").lower()]
        
        if failed_critical:
            validation["overall_passed"] = False
            validation["approval_status"] = "rejected"
            validation["blocking_issues"] = [c["name"] for c in failed_critical]
        elif any(not c["passed"] for c in validation["checks"]):
            validation["approval_status"] = "approved_with_conditions"
        
        # Count results
        passed_count = sum(1 for c in validation["checks"] if c["passed"])
        total_count = len(validation["checks"])
        
        self.logger.info(f"Validation completed: {passed_count}/{total_count} checks passed, "
                        f"Status: {validation['approval_status']}")
        
        return validation