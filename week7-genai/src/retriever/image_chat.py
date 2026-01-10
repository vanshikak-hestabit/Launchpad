from src.retriever.chat import query_image
from PIL import Image

if __name__ == "__main__":
    
    mode = input("Enter mode (image_to_text / image_to_image / text_to_image): ")
    user_query = input("Enter your question or prompt: ")
    image_name = None
    if mode in ["image_to_text", "image_to_image"]:
        image_name = input("Enter image filename (from src/data/raw): ")

    answer, images = query_image(user_query=user_query, image_name=image_name, mode=mode)
    print("\nLLM Answer:\n", answer)
    if images:
        print("\nRetrieved Images:")
        for img_path in images:
            print(img_path)
            img = Image.open(img_path)
            img.show()
