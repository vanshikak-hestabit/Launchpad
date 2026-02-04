# NEXUS AI - Autonomous Multi-Agent System 🤖

A production-ready autonomous multi-agent AI system that coordinates 9 specialized agents to solve complex tasks through intelligent collaboration.

## 📋 Overview

NEXUS AI is a sophisticated multi-agent system designed to tackle complex tasks by breaking them down and delegating to specialized AI agents. Each agent has a specific role and expertise, working together under the coordination of the Orchestrator agent.

## ✨ Features

### Core Capabilities
✅ **Multi-agent orchestration** - Intelligent task delegation and coordination  
✅ **Tool use** - Agents can use various tools to accomplish tasks  
✅ **Memory recall** - Each agent maintains memory of its actions  
✅ **Self-reflection** - Agents can reflect on their work and improve  
✅ **Self-improvement** - System learns from each execution  
✅ **Multi-step planning** - Complex tasks broken into manageable steps  
✅ **Role switching** - Dynamic agent selection based on task needs  
✅ **Logs + Tracing** - Comprehensive logging of all activities  
✅ **Failure recovery** - Graceful error handling and recovery  

## 🎯 System Agents

### 1. **Orchestrator** 🎭
- **Role**: Master coordinator and task delegator
- **Function**: Analyzes tasks, creates execution plans, coordinates all other agents
- **Key Capability**: Intelligent workflow management

### 2. **Planner** 📋
- **Role**: Strategic planner and task breakdown specialist
- **Function**: Creates detailed step-by-step plans for complex tasks
- **Key Capability**: Multi-step planning and resource estimation

### 3. **Researcher** 🔍
- **Role**: Information gathering and research specialist
- **Function**: Gathers relevant information and conducts research
- **Key Capability**: Knowledge synthesis and analysis

### 4. **Coder** 💻
- **Role**: Software development and code generation specialist
- **Function**: Writes clean, documented, production-ready code
- **Key Capability**: Multi-language code generation with best practices

### 5. **Analyst** 📊
- **Role**: Data analysis and business intelligence specialist
- **Function**: Analyzes data, identifies insights, creates strategies
- **Key Capability**: Data-driven decision making

### 6. **Critic** 🔎
- **Role**: Quality reviewer and constructive feedback provider
- **Function**: Reviews work, identifies issues, suggests improvements
- **Key Capability**: Quality assurance and constructive critique

### 7. **Optimizer** ⚡
- **Role**: Solution optimization and improvement specialist
- **Function**: Enhances solutions for better performance and efficiency
- **Key Capability**: Performance tuning and optimization strategies

### 8. **Validator** ✓
- **Role**: Quality validation and standards compliance checker
- **Function**: Validates solutions meet requirements and standards
- **Key Capability**: Comprehensive quality checking

### 9. **Reporter** 📝
- **Role**: Report generation and documentation specialist
- **Function**: Creates comprehensive final reports and documentation
- **Key Capability**: Professional report generation

## 📁 Project Structure

```
NEXUS_AI/
├── main.py                 # Main entry point
├── config.py              # System configuration
├── README.md              # This file
├── ARCHITECTURE.md        # Detailed architecture documentation
│
├── agents/                # All agent modules
│   ├── base_agent.py     # Base class for all agents
│   ├── orchestrator.py   # Orchestrator agent
│   ├── planner.py        # Planner agent
│   ├── researcher.py     # Researcher agent
│   ├── coder.py          # Coder agent
│   ├── analyst.py        # Analyst agent
│   ├── critic.py         # Critic agent
│   ├── optimizer.py      # Optimizer agent
│   ├── validator.py      # Validator agent
│   └── reporter.py       # Reporter agent
│
├── config/               # Configuration files
│   └── hosted.py        # Groq LLM client setup
│
└── logs/                # System logs (auto-created)
    ├── nexus_ai.log     # Main system log
    └── *_agent.log      # Individual agent logs
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Groq API key
- Required packages: `autogen_ext`, `python-dotenv`

### Installation

1. **Clone/Navigate to the NEXUS_AI directory**
```bash
cd NEXUS_AI
```

2. **Install dependencies**
```bash
pip install autogen-ext python-dotenv
```

3. **Set up environment variables**

Create a `.env` file in the NEXUS_AI directory:
```env
GROQ_API_KEY=your_groq_api_key_here
```

### Running NEXUS AI

**Simple execution:**
```bash
python main.py
```

**Example tasks built-in:**
1. Plan a startup in AI for healthcare
2. Generate backend architecture for scalable app
3. Analyze CSV & create business strategy
4. Design a RAG pipeline for 50k documents

## 📖 Usage Examples

### Example 1: Healthcare AI Startup Planning

```python
from main import NexusAI

# Initialize system
nexus = NexusAI()

# Run task
result = nexus.run("Plan a startup in AI for healthcare")

# Save results
nexus.save_results(result)
```

**Output includes:**
- Business plan and strategy
- Market analysis
- Technical requirements
- Regulatory considerations
- Financial projections
- Implementation roadmap

### Example 2: Backend Architecture Design

```python
result = nexus.run("Generate backend architecture for scalable app")
```

**Output includes:**
- Complete architecture design
- Production-ready code
- Scalability strategies
- Security implementation
- Deployment guidelines

### Example 3: Custom Task

```python
result = nexus.run("Create a machine learning pipeline for customer churn prediction")
```

## 🔧 Configuration

Edit `config.py` to customize:

- **MAX_RETRIES**: Number of retry attempts (default: 3)
- **MAX_STEPS**: Maximum steps per agent (default: 10)
- **TEMPERATURE**: LLM creativity level (default: 0.7)
- **MAX_TOKENS**: Response length limit (default: 2000)
- **ENABLE_LOGGING**: Turn logging on/off (default: True)

## 📊 Monitoring & Logs

### Log Files

All activities are logged to:
- `logs/nexus_ai.log` - Main system log
- `logs/orchestrator_agent.log` - Orchestrator activities
- `logs/planner_agent.log` - Planning activities
- `logs/*_agent.log` - Individual agent logs

### Results Files

Execution results are automatically saved as JSON:
- `logs/nexus_result_YYYYMMDD_HHMMSS.json`

## 🎨 How It Works

1. **Task Reception**: User provides a task to NEXUS AI
2. **Orchestration**: Orchestrator analyzes and creates execution plan
3. **Agent Coordination**: Orchestrator delegates subtasks to specialized agents
4. **Sequential Execution**: Agents execute in planned sequence
5. **Context Sharing**: Each agent builds on previous agents' work
6. **Quality Control**: Critic and Validator ensure quality
7. **Optimization**: Optimizer improves the solution
8. **Reporting**: Reporter creates comprehensive documentation
9. **Delivery**: Final results returned to user

## 🛡️ Error Handling

NEXUS AI includes robust error handling:
- Try-catch blocks in all agents
- Graceful degradation on agent failure
- Comprehensive error logging
- Retry mechanisms for transient failures
- Clear error messages for debugging

## 🔄 Memory & Learning

Each agent maintains:
- **Task Memory**: What tasks it has completed
- **Result Memory**: Outcomes of its actions
- **Reflection Memory**: Self-analysis of performance
- **Error Memory**: Issues encountered and resolutions

## 🎯 Use Cases

NEXUS AI excels at:

1. **Strategic Planning** - Business plans, project roadmaps
2. **Software Development** - Architecture design, code generation
3. **Data Analysis** - Business intelligence, insights extraction
4. **Research Tasks** - Information gathering, synthesis
5. **Quality Assurance** - Code review, validation
6. **Documentation** - Comprehensive reports, technical docs

## 📈 Performance

Typical execution times:
- Simple tasks: 10-30 seconds
- Medium complexity: 30-90 seconds
- Complex multi-step tasks: 2-5 minutes

## 🤝 Contributing

To extend NEXUS AI:

1. Create new agent inheriting from `BaseAgent`
2. Implement the `execute()` method
3. Add agent to `main.py` initialization
4. Update configuration if needed

## 📄 License

This project is provided as-is for educational and development purposes.

## 🙏 Acknowledgments

- Built with Groq's fast LLM inference
- Uses AutoGen framework components
- Designed for production workflows

## 📞 Support

For issues or questions:
- Check logs in `logs/` directory
- Review `ARCHITECTURE.md` for detailed design
- Ensure `.env` file is properly configured
- Verify all dependencies are installed

## 🚦 Status

✅ **Production Ready** - All core features implemented and tested

---

**NEXUS AI** - Where Multiple Minds Create Better Solutions 🧠✨