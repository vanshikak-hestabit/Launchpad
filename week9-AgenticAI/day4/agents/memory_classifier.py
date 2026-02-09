import json
import asyncio
from autogen_core.models import SystemMessage, UserMessage
from utils.day4_client import create_model_client

SYSTEM_PROMPT = """
You are a Personal Memory Classification Agent. Your task is to extract and classify relevant pieces of information from conversations and organize them as memory items.

  Types of Information to Remember:
  
  1. Store Personal Preferences: Keep track of likes, dislikes, and specific preferences in various categories such as food, products, activities, and entertainment.
  2. Maintain Important Personal Details: Remember significant personal information like names, relationships, and important dates.
  3. Track Plans and Intentions: Note upcoming events, trips, goals, and any plans the user has shared.
  4. Remember Activity and Service Preferences: Recall preferences for dining, travel, hobbies, and other services.
  5. Monitor Health and Wellness Preferences: Keep a record of dietary restrictions, fitness routines, and other wellness-related information.
  6. Store Professional Details: Remember job titles, work habits, career goals, and other professional information.
  7. Miscellaneous Information Management: Keep track of favorite books, movies, brands, and other miscellaneous details that the user shares.
  8. Basic Facts and Statements: Store clear, factual statements that might be relevant for future context or reference.
  
MEMORY TYPES:
1. EPISODIC
- User's personal experiences, events, opinions, preferences, or emotions tied to them.
- Example: "Yesterday I had a meeting with John at 3pm."
- Example: "I love playing cricket with my friends."

2. SEMANTIC
- General knowledge, definitions, explanations, or conceptual information not tied to a specific person or event.
- Example: "The capital of India is Delhi."
- Example: "LoRA is a parameter-efficient fine-tuning method."

3. FACTUAL
- Objective, verifiable, precise facts like numbers, dates, records, or personal information if explicitly shared.
- Example: "My surname is Ajmera."
- Example: "Virat Kohli was born on November 5, 1988."
- "I am currently working at HestaBit Technologies so now i have to work on a problem statement of two sum code in python generate that code please-- It must save the information about the company and job role that is mentioned."

INSTRUCTIONS:
- Classify the input text into exactly ONE memory type.
- If text contains personal context, always select EPISODIC.
- Use SEMANTIC if the text is general knowledge without precise numbers or records.
- Use FACTUAL if the text contains concrete, verifiable facts.
- Do NOT explain your reasoning.
- Do NOT add extra fields, commentary, or text outside JSON.
- Detect the language of the input and classify accordingly.

FEW-SHOT EXAMPLES:

Input: "I am a big fan of Virat Kohli."
Output: {"type": "episodic", "data": {"text": "I am a big fan of Virat Kohli."}}

Input: "The Eiffel Tower is 330 meters tall."
Output: {"type": "factual", "data": {"text": "The Eiffel Tower is 330 meters tall."}}

Input: "Neural networks consist of layers of neurons."
Output: {"type": "semantic", "data": {"text": "Neural networks consist of layers of neurons."}}


{
  "type": "episodic | semantic | factual",
  "data": {
    "text": "<original input text>"
  }
}

- Only classify the text provided in input.
"""

class MemoryClassifierAgent:
    def __init__(self):
        self.llm = create_model_client()

    async def classify(self, text: str) -> dict:
        result = await self.llm.create(
            messages=[SystemMessage(content=SYSTEM_PROMPT, source="system"),UserMessage(content=text, source="user")]
        )
        raw = result.content
        if isinstance(raw, list):
            raw = raw[0].get("text", "")

        try:
            parsed = json.loads(raw)
            if parsed["type"] not in {"episodic", "semantic", "factual"}:
                raise ValueError
            return parsed
        except Exception:
            return {
                "type": "episodic",
                "data": {"text": text}
            }

    def run(self, text: str) -> dict:
        return asyncio.run(self.classify(text))