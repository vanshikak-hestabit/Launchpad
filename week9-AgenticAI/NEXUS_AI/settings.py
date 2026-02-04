"""
NEXUS AI Configuration File
Contains all settings and parameters for the multi-agent system
"""

import os
from pathlib import Path

# ============================================
# PROJECT PATHS
# ============================================
# Get the base directory of the project
BASE_DIR = Path(__file__).parent
LOGS_DIR = BASE_DIR / "logs"
AGENTS_DIR = BASE_DIR / "agents"

# Create logs directory if it doesn't exist
LOGS_DIR.mkdir(exist_ok=True)

# ============================================
# AGENT SETTINGS
# ============================================
# Maximum number of retries if an agent fails
MAX_RETRIES = 3

# Maximum number of steps an agent can take
MAX_STEPS = 10

# Temperature for LLM responses (0 = deterministic, 1 = creative)
TEMPERATURE = 0.7

# Maximum tokens in a response
MAX_TOKENS = 2000

# ============================================
# LOGGING SETTINGS
# ============================================
# Enable detailed logging
ENABLE_LOGGING = True

# Log file name
LOG_FILE = LOGS_DIR / "nexus_ai.log"

# ============================================
# AGENT NAMES
# ============================================
# All available agents in the system
AGENT_NAMES = [
    "orchestrator",  # Main coordinator
    "planner",       # Creates plans
    "researcher",    # Gathers information
    "coder",         # Writes code
    "analyst",       # Analyzes data
    "critic",        # Reviews work
    "optimizer",     # Improves solutions
    "validator",     # Checks quality
    "reporter"       # Creates reports
]

# ============================================
# MEMORY SETTINGS
# ============================================
# Maximum items to keep in memory
MAX_MEMORY_ITEMS = 100

# Enable memory recall
ENABLE_MEMORY = True

# ============================================
# TOOL SETTINGS
# ============================================
# Available tools for agents
AVAILABLE_TOOLS = [
    "file_operations",  # Read/write files
    "web_search",       # Search the web
    "code_execution",   # Run code
    "data_analysis"     # Analyze data
]