from langchain_community.embeddings import HuggingFaceBgeEmbeddings
from langchain_qdrant import QdrantVectorStore
from src.pipelines.ingest import chunk_load
from langchain_qdrant import FastEmbedSparse, RetrievalMode
from src.vectorstore.qdrant_client import get_QD_client


def embedding_model():
  return HuggingFaceBgeEmbeddings(
    model_name="BAAI/bge-base-en-v1.5"

)
embedding = embedding_model()

client = get_QD_client()
def sparseModel():
   return FastEmbedSparse(model_name="Qdrant/bm25")

get_sparse_embedding=sparseModel()
chunks = chunk_load()

vector_store = QdrantVectorStore(
  client=client,
  collection_name="genai-learning",
  sparse_embedding=get_sparse_embedding,
  embedding=embedding,
  vector_name="dense",
  sparse_vector_name="sparse",
  retrieval_mode=RetrievalMode.HYBRID,

    
)

vector_store.add_documents(documents=chunks)

print("Embedding stored in Qdrant")