from PIL import Image
import pytesseract
from transformers import BlipProcessor, BlipForConditionalGeneration
import os

processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

def gen_cap(img_path):
    img = Image.open(img_path).convert('RGB')
    inputs = processor(images=img, return_tensors='pt')
    out = model.generate(**inputs)
    caption = processor.decode(out[0], skip_special_tokens=True)
    return caption

def load_img(folder):
    img_list = []
    files = os.listdir(folder)
    for file in files:
        if file.endswith(".png"):
            path = folder + "/" + file
            img_list.append(path)
    return img_list


def OCR(img_path):
    img = Image.open(img_path)
    txt = pytesseract.image_to_string(img)
    return txt

img_folder = "src/data/raw"
all_img_path = load_img(img_folder)

OCR_txt = []
for path in all_img_path:
    txt = OCR(path)
    OCR_txt.append(txt)

# captions = []
# for path in all_img_path:
#     cap = gen_cap(path)
#     captions.append(cap)


# for i, cap in enumerate(captions):
#     print(f"IMG {i+1}:  ")
#     print(cap)
#     print("-----")

