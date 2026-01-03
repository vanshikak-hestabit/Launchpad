from PIL import Image
import torch
from transformers import CLIPProcessor, CLIPModel
from src.vectorstore.qdrant_client import get_QD_client 
from qdrant_client.models import PointStruct
from src.pipelines.image_ingest import load_img, OCR, gen_cap

client = get_QD_client()
COLLECTION_NAME = "genai-learning"

model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")


def generate_embeddings(image_path, caption):
    """
    Given an image path and caption:
    - Loads the image
    - Generates image + text embeddings using CLIP
    Returns: image_vector, text_vector (as numpy arrays)
    """
    # Load image
    image = Image.open(image_path).convert('RGB')

    # Prepare inputs for CLIP
    inputs = processor(text=[caption], images=image, return_tensors="pt", padding=True)

    # Generate embeddings
    with torch.no_grad():
        image_embeds = model.get_image_features(inputs['pixel_values'])
        text_embeds = model.get_text_features(inputs['input_ids'])

    # Convert to numpy
    return image_embeds[0].numpy(), text_embeds[0].numpy()

def embed_storeAll(folder):
    images = load_img(folder)
    ocr_texts = [OCR(p) for p in images]
    captions = [gen_cap(p) for p in images]
    for idx, img in enumerate(images, start=1):
        img_vec, txt_vec = generate_embeddings(img, captions[idx-1])
        point = PointStruct(
            id = idx,
            vector={
                "image_dense":img_vec,
                "text_dense": txt_vec.tolist()
                
            },
            payload={
                "image_path": img,
                "ocr_text": ocr_texts[idx-1],
                "caption": captions[idx-1],
                "image_vector": img_vec.tolist()
            }
        )
        client.upsert(collection_name=COLLECTION_NAME, points=[point])
 
    print(f"All {len(images)} embeddings stored in Qdrant!")

if __name__ == "__main__":
    embed_storeAll("src/data/raw")