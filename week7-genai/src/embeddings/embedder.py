from langchain_community.embeddings import HuggingFaceBgeEmbeddings
from langchain_qdrant import QdrantVectorStore
from src.pipelines.ingest import chunk_load

def embedding_model():
  return HuggingFaceBgeEmbeddings(
    model_name = "sentence-transformers/all-MiniLM-L6-v2"

)
embedding = embedding_model()

chunks = chunk_load()

vector_store = QdrantVectorStore.from_documents(
    documents=chunks,
    embedding=embedding,
    url="http://localhost:6333",
    collection_name="day1-RAG"
)

print("Embedding stored in Qdrant")