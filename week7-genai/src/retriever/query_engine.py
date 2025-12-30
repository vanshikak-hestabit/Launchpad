from dotenv import load_dotenv
from langchain_community.embeddings import HuggingFaceBgeEmbeddings
from langchain_qdrant import QdrantVectorStore
from openai import OpenAI
import os
from src.embeddings.embedder import embedding_model
load_dotenv()


client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=os.environ.get("OPEN_API_KEY")   
)

embedding = embedding_model()

vector_db = QdrantVectorStore.from_existing_collection(
    embedding=embedding,
    url="http://localhost:6333",
    collection_name="day1-RAG"
)

user_query = input("Ask something: ")

# relevant chunks from vector DB
search_result = vector_db.similarity_search(query=user_query)

context = "\n\n\n".join([f"Page Content: {result.page_content}\n" 
    f"Page Number: {result.metadata['page_label']}\n"
    f"File Location: {result.metadata['source']}"
    for result in search_result])

SYSTEM_PROMPT = f"""
    You are a helpful AI assistant who answers user query based on the available context 
    retrieved from a PDF file along with page_contents and page number.

    You should only answer the user based on the following context and 
    navigate the user to open the right number to know more.

    Context:
    {context}

"""

response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_query},
    ]
)

print(f"{response.choices[0].message.content}")