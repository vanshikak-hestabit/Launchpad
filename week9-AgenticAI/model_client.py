from autogen_ext.models.ollama import OllamaChatCompletionClient


def create_model_client():
    return OllamaChatCompletionClient(
        model="llama3.1:latest",  
        model_info={
            "type": "ollama",
            "json_output": False,
            "vision": False,
            "function_calling": False
        },
        device="cuda",   
        max_new_tokens=512,
        temperature=0.7,
    )
