# NEXUS AI - Quick Start Guide 

### Step 1: Install Dependencies

```bash
cd NEXUS_AI
pip install -r requirements.txt
```

### Step 2: Run NEXUS AI

```bash
python main.py
```

##  Try Example Tasks

When you run `main.py`, you'll see a menu:

```
NEXUS AI - Autonomous Multi-Agent System
==========================================

Example Tasks:
  1. Plan a startup in AI for healthcare
  2. Generate backend architecture for scalable app
  3. Analyze CSV & create business strategy
  4. Design a RAG pipeline for 50k documents
  5. Custom task
  0. Exit
```

##  What Happens Behind the Scenes

1. **Orchestrator** analyzes your task
2. **Planner** creates a step-by-step plan
3. **Researcher** gathers relevant information
4. **Coder** generates code (if needed)
5. **Analyst** analyzes data and creates insights
6. **Critic** reviews all the work
7. **Optimizer** suggests improvements
8. **Validator** checks quality
9. **Reporter** creates final comprehensive report

##  Check the Logs

All activities are logged to:
```
logs/
├── nexus_ai.log           # Main system log
```

##  Tips for Best Results

### Good Task Examples:
"Create a business plan for an AI-powered healthcare startup"
"Design a scalable backend architecture for a social media app"
"Analyze customer data and suggest marketing strategies"
"Build a RAG system for document question-answering"

### Example Output Structure:

```json
{
  "status": "completed",
  "task": "Your original task",
  "workflow": ["planner", "researcher", "coder", ...],
  "steps_executed": 9,
  "results": [
    {
      "step": 1,
      "agent": "planner",
      "result": {...}
    },
    ...
  ],
}
```

##  Configuration Options

Edit `config.py` to customize:
```python
MAX_RETRIES_PER_AGENT = 3
MAX_PLAN_RETRIES = 3
```

##  You're Ready!

That's it! You now know how to:
- Install and configure NEXUS AI
- Run example tasks
- Create custom tasks
- Check logs and results
- Troubleshoot common issues

**Enjoy using NEXUS AI!** 
---
Check the full README.md or ARCHITECTURE.md for detailed information.