from dotenv import load_dotenv
from openai import OpenAI
load_dotenv()
from PIL import Image
import os
from src.retriever.image_search import text_to_image, image_to_image, image_to_text

user_query = input("Ask Something: ")

client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=os.environ.get("OPEN_API_KEY")   
)

# results = text_to_image(user_query)
results = image_to_image("src/data/raw/gi8.png")
# caption, ocr_text, image_path = image_to_text("src/data/raw/gi5.png")


### -----image to image-------
SYSTEM_PROMPT = f"""
You are a helpful AI assistant who retrives the similar images strictly based on
the provided context retrieved from images.

Rules:
- Use ONLY the given context
- Mention the relevant page number(s)
- If the answer is not in the context, say you don’t know
"""


### -----text to image-------
# SYSTEM_PROMPT = f"""
# You are a helpful AI assistant who retrieves the image strictly based on
# the provided context retrieved from images.

# Rules:
# - Use ONLY the given context
# - Mention the relevant page number(s)
# - If the answer is not in the context, say you don’t know
# """


#### -----image to text-------
# SYSTEM_PROMPT = f"""
# You are a helpful AI assistant who explains Explain the image
#  in simple words using ONLY the information below.

# Caption:
# {caption}

# Text found in image:
# {ocr_text}

# Rules:
# - Simple explanation
# - 2–4 lines
# - No outside knowledge
# """

response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_query},
    ]
)

### for image->img and txt->img
print(f"{response.choices[0].message.content}")
for item in results:
    img = Image.open(item.payload["image_path"])
    img.show()
   

### for img -> txt
# print(response.choices[0].message.content)