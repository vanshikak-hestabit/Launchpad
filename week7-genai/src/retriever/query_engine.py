from dotenv import load_dotenv
from openai import OpenAI
import os
from src.retriever.hybrid_retriever import hybridRetriever
from src.retriever.reranker import reRanker
from src.embeddings.embedder import vector_store
load_dotenv()

retriever = hybridRetriever(vector_store)
ReRanker = reRanker()

user_query = input("Ask Something: ")

search_result = retriever.retrieve(user_query,5)
reranked_chunks = ReRanker.rerank(user_query, search_result)

client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=os.environ.get("OPEN_API_KEY")   
)

context = "\n\n\n".join([f"Page Content: {result.page_content}\n" 
    f"Page Number: {result.metadata['page_label']}\n"
    f"File Location: {result.metadata['source']}"
    for result in reranked_chunks])

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