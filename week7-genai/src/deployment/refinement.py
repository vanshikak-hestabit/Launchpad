from dotenv import load_dotenv
from typing import Optional
from openai import OpenAI
import os

load_dotenv()

client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=os.environ.get("OPEN_API_KEY")
)

def refine_answer(question: str, answer: str, context: Optional[str] = None) -> str:
   
    system_prompt = (
        "You are an expert assistant. "
        "Your task is to refine answers to be accurate, concise, and free of hallucinations."
    )

    user_prompt = f"Question: {question}\nAnswer: {answer}"
    if context:
        user_prompt += f"\nContext: {context}"
    user_prompt += "\nPlease provide the refined answer."

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
    )

    return response.choices[0].message.content
