import json
from autogen_agentchat.agents import AssistantAgent
from pydantic import ValidationError
from utils.models import ValidationResult
from utils.agent_runner import run_agent

def create_validator_agent(model_client):
    return AssistantAgent(
        name="Validator",
        system_message="""
You are a validation agent.
Check correctness, completeness, and quality.
Return JSON:
{
  "verdict": "PASS" or "FAIL",
  "reason": "short explanation"
}
""",
        model_client=model_client
    )


async def validate_answer(validator_agent, answer) -> ValidationResult:
    prompt = f"""
Validate this answer.

ANSWER:
{answer}

Return only JSON.
"""
    reply = await run_agent(validator_agent, prompt)
    json_str = reply.strip()

    if json_str.startswith("```"):
        json_str = json_str.strip("`").strip()
        if json_str.lower().startswith("json"):
            json_str = json_str[4:].strip()

    try:
        data = json.loads(json_str)
        return ValidationResult(**data)
    except (json.JSONDecodeError, ValidationError) as e:
        raise ValueError(f"Invalid validator output:\n{e}\n\nRaw:\n{reply}")