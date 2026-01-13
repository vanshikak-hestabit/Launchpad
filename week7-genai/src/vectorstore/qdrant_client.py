from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, SparseVectorParams, Distance

def get_QD_client():
    COLLECTION_NAME ="genai-learning"

    client = QdrantClient(
        host ="localhost",
        port = 6333
    )
     
    if not client.collection_exists(COLLECTION_NAME):
        client.delete_collection(COLLECTION_NAME)
        print("Old collection deleted")
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config={
                "dense":VectorParams(
                    size=512,
                    distance=Distance.COSINE
                ),
                "image_dense": VectorParams(size=512, distance=Distance.COSINE)
            },
            sparse_vectors_config={
                "sparse":SparseVectorParams()
            }
            
        )
        print("hybrid collection created!!")

    return client


def get_QD_client_for_pdf_rag():
    COLLECTION_NAME ="genai-hestabit"

    client = QdrantClient(
        host ="localhost",
        port = 6333
    )
     
    if not client.collection_exists(COLLECTION_NAME):
        client.delete_collection(COLLECTION_NAME)
        print("Old collection deleted")
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config={
                "dense":VectorParams(
                    size=768,
                    distance=Distance.COSINE
                ),
            },
            sparse_vectors_config={
                "sparse":SparseVectorParams()
            }
            
        )
        print("hybrid collection created!!")

    return client