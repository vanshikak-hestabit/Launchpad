"""
NEXUS AI - Test Script
Quick test to verify all agents are working correctly
"""

import sys
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

def test_imports():
    """Test that all modules can be imported"""
    print("Testing imports...")
    
    try:
        import NEXUS_AI.config as config
        print("✓ config imported")
        
        from config.hosted import openai_client
        print("✓ openai_client imported")
        
        from agents.base_agent import BaseAgent
        print("✓ BaseAgent imported")
        
        from agents.orchestrator import OrchestratorAgent
        print("✓ OrchestratorAgent imported")
        
        from agents.planner import PlannerAgent
        print("✓ PlannerAgent imported")
        
        from agents.researcher import ResearcherAgent
        print("✓ ResearcherAgent imported")
        
        from agents.coder import CoderAgent
        print("✓ CoderAgent imported")
        
        from agents.analyst import AnalystAgent
        print("✓ AnalystAgent imported")
        
        from agents.critic import CriticAgent
        print("✓ CriticAgent imported")
        
        from agents.optimizer import OptimizerAgent
        print("✓ OptimizerAgent imported")
        
        from agents.validator import ValidatorAgent
        print("✓ ValidatorAgent imported")
        
        from agents.reporter import ReporterAgent
        print("✓ ReporterAgent imported")
        
        print("\n✅ All imports successful!\n")
        return True
        
    except Exception as e:
        print(f"\n❌ Import failed: {e}\n")
        return False

def test_agent_initialization():
    """Test that all agents can be initialized"""
    print("Testing agent initialization...")
    
    try:
        from config.hosted import openai_client
        from agents.planner import PlannerAgent
        from agents.researcher import ResearcherAgent
        from agents.coder import CoderAgent
        from agents.analyst import AnalystAgent
        from agents.critic import CriticAgent
        from agents.optimizer import OptimizerAgent
        from agents.validator import ValidatorAgent
        from agents.reporter import ReporterAgent
        from agents.orchestrator import OrchestratorAgent
        
        # Initialize each agent
        planner = PlannerAgent(openai_client)
        print("✓ Planner initialized")
        
        researcher = ResearcherAgent(openai_client)
        print("✓ Researcher initialized")
        
        coder = CoderAgent(openai_client)
        print("✓ Coder initialized")
        
        analyst = AnalystAgent(openai_client)
        print("✓ Analyst initialized")
        
        critic = CriticAgent(openai_client)
        print("✓ Critic initialized")
        
        optimizer = OptimizerAgent(openai_client)
        print("✓ Optimizer initialized")
        
        validator = ValidatorAgent(openai_client)
        print("✓ Validator initialized")
        
        reporter = ReporterAgent(openai_client)
        print("✓ Reporter initialized")
        
        # Initialize orchestrator with all agents
        agents = {
            "planner": planner,
            "researcher": researcher,
            "coder": coder,
            "analyst": analyst,
            "critic": critic,
            "optimizer": optimizer,
            "validator": validator,
            "reporter": reporter
        }
        
        orchestrator = OrchestratorAgent(openai_client, agents)
        print("✓ Orchestrator initialized with all agents")
        
        print(f"\n✅ All {len(agents) + 1} agents initialized successfully!\n")
        return True
        
    except Exception as e:
        print(f"\n❌ Initialization failed: {e}\n")
        return False

def test_directory_structure():
    """Test that all required directories exist"""
    print("Testing directory structure...")
    
    required_dirs = [
        "agents",
        "config",
        "logs"
    ]
    
    all_exist = True
    for dir_name in required_dirs:
        dir_path = Path(dir_name)
        if dir_path.exists():
            print(f"✓ {dir_name}/ exists")
        else:
            print(f"❌ {dir_name}/ missing")
            all_exist = False
    
    if all_exist:
        print("\n✅ All directories present!\n")
    else:
        print("\n⚠️ Some directories missing\n")
    
    return all_exist

def test_required_files():
    """Test that all required files exist"""
    print("Testing required files...")
    
    required_files = [
        "main.py",
        "config.py",
        "README.md",
        "ARCHITECTURE.md",
        "QUICKSTART.md",
        "requirements.txt",
        ".env.example",
        "agents/__init__.py",
        "agents/base_agent.py",
        "agents/orchestrator.py",
        "agents/planner.py",
        "agents/researcher.py",
        "agents/coder.py",
        "agents/analyst.py",
        "agents/critic.py",
        "agents/optimizer.py",
        "agents/validator.py",
        "agents/reporter.py",
        "config/__init__.py",
        "config/hosted.py"
    ]
    
    all_exist = True
    for file_name in required_files:
        file_path = Path(file_name)
        if file_path.exists():
            print(f"✓ {file_name}")
        else:
            print(f"❌ {file_name} missing")
            all_exist = False
    
    if all_exist:
        print("\n✅ All required files present!\n")
    else:
        print("\n⚠️ Some files missing\n")
    
    return all_exist

def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("NEXUS AI - System Test")
    print("="*60 + "\n")
    
    results = []
    
    # Test 1: Directory Structure
    results.append(("Directory Structure", test_directory_structure()))
    
    # Test 2: Required Files
    results.append(("Required Files", test_required_files()))
    
    # Test 3: Imports
    results.append(("Module Imports", test_imports()))
    
    # Test 4: Agent Initialization
    results.append(("Agent Initialization", test_agent_initialization()))
    
    # Summary
    print("="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    for test_name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{test_name:.<40} {status}")
    
    all_passed = all(result[1] for result in results)
    
    print("="*60)
    if all_passed:
        print("\n🎉 ALL TESTS PASSED! NEXUS AI is ready to use!")
        print("\nNext steps:")
        print("1. Create a .env file with your GROQ_API_KEY")
        print("2. Run: python main.py")
        print("3. Select a task and enjoy!\n")
    else:
        print("\n⚠️ SOME TESTS FAILED")
        print("Please check the errors above and fix them.\n")
    
    return all_passed

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)