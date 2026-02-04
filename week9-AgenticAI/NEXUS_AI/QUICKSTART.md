# NEXUS AI - Quick Start Guide 🚀

Get up and running with NEXUS AI in 5 minutes!

## ⚡ Quick Setup

### Step 1: Install Dependencies

```bash
cd NEXUS_AI
pip install -r requirements.txt
```

### Step 2: Set Up API Key

1. Get a free Groq API key from: https://console.groq.com/
2. Create a `.env` file in the NEXUS_AI directory
3. Add your API key:

```env
GROQ_API_KEY=your_actual_api_key_here
```

### Step 3: Run NEXUS AI

```bash
python main.py
```

## 🎯 Try Example Tasks

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

**Just select a number and press Enter!**

## 📝 Example Session

```
Select a task (0-5): 1

Executing: Plan a startup in AI for healthcare

[System runs through all 9 agents...]

EXECUTION SUMMARY
==========================================
Status: completed
Steps executed: 9
Time taken: 45.32 seconds

Show detailed report? (y/n): y

[Detailed JSON report displayed]
```

## 🔍 What Happens Behind the Scenes

1. **Orchestrator** analyzes your task
2. **Planner** creates a step-by-step plan
3. **Researcher** gathers relevant information
4. **Coder** generates code (if needed)
5. **Analyst** analyzes data and creates insights
6. **Critic** reviews all the work
7. **Optimizer** suggests improvements
8. **Validator** checks quality
9. **Reporter** creates final comprehensive report

## 📊 Check the Logs

All activities are logged to:
```
logs/
├── nexus_ai.log           # Main system log
├── orchestrator_agent.log # Orchestrator activities
├── planner_agent.log      # And all other agents...
└── nexus_result_*.json    # Results saved as JSON
```

## 💡 Tips for Best Results

### Good Task Examples:
✅ "Create a business plan for an AI-powered healthcare startup"
✅ "Design a scalable backend architecture for a social media app"
✅ "Analyze customer data and suggest marketing strategies"
✅ "Build a RAG system for document question-answering"

### Tasks to Avoid:
❌ "Hello" (too vague)
❌ "Help" (no specific task)
❌ Simple questions that don't need multiple agents

## 🎨 Custom Tasks

Select option 5 and enter your own task:

```
Select a task (0-5): 5

Enter your custom task: Create a machine learning pipeline for 
predicting customer churn with 95% accuracy

Executing: Create a machine learning pipeline for predicting 
customer churn with 95% accuracy

[System processes your custom task...]
```

## 🐛 Troubleshooting

### Error: "No module named 'autogen_ext'"
**Solution**: Run `pip install autogen-ext`

### Error: "GROQ_API_KEY not found"
**Solution**: 
1. Make sure `.env` file exists in NEXUS_AI directory
2. Check that it contains: `GROQ_API_KEY=your_key`
3. Make sure no spaces around the `=`

### Error: "Invalid API key"
**Solution**: Get a new API key from https://console.groq.com/

### No output / System hangs
**Solution**: 
1. Check your internet connection
2. Check logs in `logs/nexus_ai.log`
3. Make sure Groq API is accessible

## 📖 Next Steps

Once you're comfortable with basic usage:

1. **Read ARCHITECTURE.md** - Understand how the system works
2. **Customize agents** - Modify agent behavior in `agents/` folder
3. **Adjust configuration** - Edit `config.py` for your needs
4. **Add new agents** - Create specialized agents for your use case

## 🎓 Understanding the Output

Each task generates:

1. **Console Output**: Real-time progress
2. **Log Files**: Detailed execution logs
3. **JSON Result**: Complete results with all agent outputs
4. **Final Report**: Professional summary of all work

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
  "execution_time_seconds": 45.32
}
```

## ⚙️ Configuration Options

Edit `config.py` to customize:

```python
# How many times to retry on failure
MAX_RETRIES = 3

# Maximum steps an agent can take
MAX_STEPS = 10

# LLM creativity (0 = deterministic, 1 = creative)
TEMPERATURE = 0.7

# Maximum response length
MAX_TOKENS = 2000
```

## 🚀 You're Ready!

That's it! You now know how to:
- ✅ Install and configure NEXUS AI
- ✅ Run example tasks
- ✅ Create custom tasks
- ✅ Check logs and results
- ✅ Troubleshoot common issues

**Enjoy using NEXUS AI!** 🎉

---

Need help? Check the full README.md or ARCHITECTURE.md for detailed information.