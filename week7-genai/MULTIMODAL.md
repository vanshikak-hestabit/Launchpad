# MULTIMODAL-RAG (IMAGE + TEXT)

## What this task is
You are building a **Multimodal RAG system** that can understand **images and text together** and retrieve relevant results using a vector database.

The system supports:
- Text → Image retrieval
- Image → Image retrieval
- Image → Text answers

---

## High-Level Pipeline
1. Load images from disk
2. Extract text from images (OCR)
3. Generate captions for images (BLIP)
4. Convert images + text into vectors (CLIP)
5. Store vectors + metadata in Qdrant
6. Query using text or image

---

## Image Ingestion (image_ingest.py)
For every image:
- Load image from `src/data/raw`
- Extract visible text using **Tesseract OCR**
- Generate a caption using **BLIP**

---

## Embedding Generation (clip_embedder.py)
Uses **CLIP** to convert data into vectors:
- `image_dense` → image embedding
- `text_dense` → caption embedding

Both image and text live in the **same vector space**.

---

## Vector Storage (Qdrant)
Each image is stored as **one point**:

---

## Retrieval (image_search.py)
Query modes:
- Text → Image (text embedding → image vectors)
- Image → Image (image embedding → image vectors)
- Image → Text (image embedding → captions)

Steps:
1. Convert query to CLIP vector
2. Search nearest vectors in Qdrant
3. Return payload (path, caption, OCR)

---

## Conversation Layer (chat.py)

This file adds a chat interface on top of retrieval.

Flow:
- Take user input
- Run image/text retrieval
- Pass retrieved context to the LLM
- Enforce strict system rules (no hallucination)
- Print response
- Display retrieved images if needed

Purpose:
Converts retrieval results into natural language answers using an LLM.

## Why These Tools
- **Tesseract** → extract text from images
- **BLIP** → describe images in natural language
- **CLIP** → align image + text embeddings
- **Qdrant** → fast, scalable vector database

---

## Final Result
A production-style **Multimodal RAG system** that:
- Understands images
- Understands text
- Stores both together
- Retrieves across modalities

## How to run
- python3 -m src.embeddings.embedder [txt embeddings]
- python3 -m src.embeddings.clip_embedder [img embeddings]
- python3 -m src.retriever.chat [img-txt conversion]