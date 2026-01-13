
from src.vectorstore.qdrant_client import get_QD_client
from qdrant_client.models import Filter
from PIL import Image
from transformers import CLIPProcessor, CLIPModel
import torch

# Load Qdrant client
client = get_QD_client()
COLLECTION_NAME = "genai-learning"

# Load CLIP
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")


# Generate CLIP embedding for text or image
def get_text_embedding(text):
    inputs = processor(text=[text], images=None, return_tensors="pt", padding=True)
    with torch.no_grad():
        return model.get_text_features(inputs['input_ids'])[0].numpy()



def get_image_embedding(image_path):
    image = Image.open(image_path).convert('RGB')
    inputs = processor(text=["dummy"], images=image, return_tensors="pt", padding=True)
    with torch.no_grad():
        return model.get_image_features(inputs['pixel_values'])[0].numpy()

# Query Qdrant
def search_by_vector(vector, top_k=3):
    results = client.query_points(
        collection_name=COLLECTION_NAME,
        query=vector.tolist(),
        using="image_dense",
        with_payload=True,
        limit=top_k
    )
    return results.points



#  img-txt conversion functions

def text_to_image(query_text, top_k=1):
    vec = get_text_embedding(query_text)
    # results = search_by_vector(vec, top_k)
    results = client.query_points(
        collection_name=COLLECTION_NAME,
        query=vec.tolist(),
        using="image_dense",        
        with_payload=True,
        limit=top_k
    )
    return results.points


def image_to_image(query_image_path, top_k=1):
    vec = get_image_embedding(query_image_path)
    results = search_by_vector(vec, top_k)

    print(f"Top results for IMAGE → IMAGE:")
    return results


def image_to_text(query_image_path, top_k=1):
    vec = get_image_embedding(query_image_path)
    results = search_by_vector(vec, top_k)
    
    caption = ""
    ocr_text = ""

    if results:
        payload = results[0].payload
        caption = payload.get("caption", "")
        ocr_text = payload.get("ocr_text", "")

    return caption, ocr_text, query_image_path
