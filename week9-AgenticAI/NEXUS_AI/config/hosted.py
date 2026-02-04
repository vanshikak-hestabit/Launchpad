import os
from dotenv import load_dotenv
from autogen_ext.models.openai import OpenAIChatCompletionClient

# Load environment variables from .env file
load_dotenv()

# Create the Groq client that all agents will use
# This connects to Groq's API using the llama-3.1-8b-instant model
openai_client = OpenAIChatCompletionClient(
    model="llama-3.1-8b-instant",  # Fast and efficient Llama model
    base_url="https://api.groq.com/openai/v1",  # Groq API endpoint
    api_key=os.getenv("GROQ_API_KEY"),  # Your API key from .env file
    model_info={
        "vision": True,  # Can process images
        "function_calling": True,  # Can use tools/functions
        "json_output": True,  # Can output structured JSON
        "family": "llama-3.3",  # Model family
        "structured_output": True,  # Supports structured responses
    }
)