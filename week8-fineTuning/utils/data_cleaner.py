import json
import random
from transformers import AutoTokenizer
import matplotlib.pyplot as plt
import numpy as np

random.seed(42)

QA_TOPICS = [
    "diabetes", "hypertension", "asthma", "anemia",
    "heart disease", "stroke", "tuberculosis",
    "covid-19", "arthritis", "migraine"
]

SYMPTOMS = [
    "fatigue", "shortness of breath", "chest pain",
    "frequent urination", "weight loss",
    "persistent cough", "fever", "joint pain"
]

MEDICAL_TEXTS = [
    "The patient was diagnosed with {} and prescribed {}.",
    "Clinical notes indicate {} treated using {}.",
    "Diagnosis confirmed as {}. Medication initiated: {}."
]

MEDICATIONS = [
    "metformin", "amlodipine", "ibuprofen",
    "paracetamol", "amoxicillin",
    "insulin", "atorvastatin"
]

def generate_qa():
    topic = random.choice(QA_TOPICS)
    return {
        "instruction": f"What is {topic}?",
        "input": "",
        "output": f"{topic.capitalize()} is a medical condition that affects the body and requires clinical management."
    }

def generate_reasoning():
    s = random.sample(SYMPTOMS, 3)
    return {
        "instruction": "Based on the symptoms, identify the most likely condition.",
        "input": f"The patient reports {', '.join(s)}.",
        "output": "The symptoms suggest a possible metabolic or cardiovascular disorder."
    }

def generate_extraction():
    disease = random.choice(QA_TOPICS)
    med = random.choice(MEDICATIONS)
    text = random.choice(MEDICAL_TEXTS).format(disease, med)
    return {
        "instruction": "Extract the diagnosis and medication.",
        "input": text,
        "output": f"Diagnosis: {disease}; Medication: {med}"
    }

def generate_dataset():
    data = []
    for _ in range(334):
        data.append(generate_qa())
    for _ in range(333):
        data.append(generate_reasoning())
    for _ in range(333):
        data.append(generate_extraction())

    random.shuffle(data)
    return data

def save_split(data):
    train = data[:900]
    val = data[900:]

    with open("data/train.jsonl", "w") as f:
        for x in train:
            f.write(json.dumps(x) + "\n")

    with open("data/val.jsonl", "w") as f:
        for x in val:
            f.write(json.dumps(x) + "\n")

MODEL_NAME = "mistralai/Mistral-7B-Instruct-v0.2"

def token_length_analysis(file_path):
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

    lengths = []

    with open(file_path) as f:
        for line in f:
            item = json.loads(line)
            text = item["instruction"] + " " + item["input"] + " " + item["output"]
            tokens = tokenizer.encode(text)
            lengths.append(len(tokens))

    return lengths

def remove_outliers(data, lengths, max_len=512):
    cleaned = [
        item for item, l in zip(data, lengths) if l <= max_len
    ]
    return cleaned

def analyze_and_clean():
    with open("data/train.jsonl") as f:
        train_data = [json.loads(x) for x in f]

    lengths = []
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

    for item in train_data:
        text = item["instruction"] + " " + item["input"] + " " + item["output"]
        lengths.append(len(tokenizer.encode(text)))

    print("Token stats:")
    print(f"Min: {min(lengths)}")
    print(f"Max: {max(lengths)}")
    print(f"Mean: {np.mean(lengths):.2f}")

    plt.hist(lengths, bins=30)
    plt.title("Token Length Distribution")
    plt.xlabel("Tokens")
    plt.ylabel("Count")
    plt.savefig("data/tokenLendistribution.png")
    plt.close()

    cleaned = remove_outliers(train_data, lengths)

    with open("data/train.jsonl", "w") as f:
        for x in cleaned:
            f.write(json.dumps(x) + "\n")

    print(f"After cleaning: {len(cleaned)} samples")


if __name__ == "__main__":
    dataset = generate_dataset()
    save_split(dataset)
    print("Dataset generated: 900 train / 100 val")
    analyze_and_clean()
