# base_model.py
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

MODEL_NAME = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    dtype=torch.float16,
    device_map="auto"
)

def call_llm(prompt: str, max_tokens: int = 300, temperature: float = 0.3):
    inputs = tokenizer(prompt, return_tensors="pt", truncation=True, max_length=1800).to(model.device)

    outputs = model.generate(
        **inputs,
        max_new_tokens=max_tokens,
        temperature=temperature,
        do_sample=True,
        pad_token_id=tokenizer.eos_token_id,
    )

    text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return text[len(prompt):].strip()
