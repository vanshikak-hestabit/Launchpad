"""
Coder Agent
Writes code and develops software solutions
Creates clean, well-documented code
"""

from typing import Dict, Any
from agents.base_agent import BaseAgent

class CoderAgent(BaseAgent):
    """
    Coder writes and structures code solutions
    Follows best practices and coding standards
    """
    
    def __init__(self, client):
        """Initialize the Coder agent"""
        super().__init__(
            name="coder",
            role="Software development and code generation specialist",
            client=client
        )
        
        # Supported programming languages
        self.languages = ["python", "javascript", "java", "go", "sql"]
    
    def execute(self, task: str) -> Dict[str, Any]:
        """
        Generate code for the given task
        
        Args:
            task: The coding task
            
        Returns:
            Dictionary with code and documentation
        """
        self.logger.info(f"Coding task: {task[:100]}...")
        self.is_active = True
        
        try:
            # Generate code
            code_result = self._generate_code(task)
            
            # Store in memory
            self.add_to_memory("code_generated", f"Created {code_result['language']} code")
            
            return code_result
            
        except Exception as e:
            self.logger.error(f"Code generation failed: {str(e)}")
            return {
                "status": "error",
                "message": str(e)
            }
        finally:
            self.is_active = False
    
    def _generate_code(self, task: str) -> Dict[str, Any]:
        """
        Internal method to generate code
        
        Args:
            task: Coding task description
            
        Returns:
            Code result dictionary
        """
        task_lower = task.lower()
        
        # Determine what type of code to generate
        code_result = {
            "status": "success",
            "language": "python",  # Default to Python
            "code": "",
            "documentation": "",
            "files": []
        }
        
        # Backend Architecture Code
        if "backend" in task_lower and "architecture" in task_lower:
            code_result["code"] = '''"""
Scalable Backend Architecture
Multi-tier application with microservices pattern
"""

# ======================
# API GATEWAY
# ======================
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import asyncio

app = FastAPI(title="API Gateway")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======================
# SERVICE LAYER
# ======================
class BaseService:
    """Base class for all microservices"""
    
    def __init__(self, name: str):
        self.name = name
        self.is_healthy = True
    
    async def health_check(self):
        return {"service": self.name, "status": "healthy"}

class UserService(BaseService):
    """Handles user management"""
    
    def __init__(self):
        super().__init__("user-service")
        self.users = {}  # In production, use database
    
    async def create_user(self, user_data: dict):
        user_id = len(self.users) + 1
        self.users[user_id] = user_data
        return {"user_id": user_id, "data": user_data}
    
    async def get_user(self, user_id: int):
        return self.users.get(user_id)

class DataService(BaseService):
    """Handles data processing"""
    
    def __init__(self):
        super().__init__("data-service")
    
    async def process_data(self, data: dict):
        # Simulate data processing
        processed = {
            "status": "processed",
            "input": data,
            "timestamp": "2024-01-01T00:00:00Z"
        }
        return processed

# ======================
# DATABASE LAYER
# ======================
class DatabasePool:
    """Database connection pool manager"""
    
    def __init__(self, max_connections: int = 10):
        self.max_connections = max_connections
        self.connections = []
    
    async def get_connection(self):
        # Simulate connection retrieval
        return {"status": "connected"}
    
    async def release_connection(self, conn):
        # Release connection back to pool
        pass

# ======================
# CACHE LAYER
# ======================
class CacheManager:
    """Redis-like cache manager"""
    
    def __init__(self):
        self.cache = {}
    
    async def get(self, key: str):
        return self.cache.get(key)
    
    async def set(self, key: str, value, ttl: int = 300):
        self.cache[key] = value
        # In production, implement TTL

# ======================
# LOAD BALANCER
# ======================
class LoadBalancer:
    """Distributes requests across service instances"""
    
    def __init__(self):
        self.instances = []
        self.current = 0
    
    def add_instance(self, instance):
        self.instances.append(instance)
    
    def get_next_instance(self):
        """Round-robin load balancing"""
        if not self.instances:
            return None
        instance = self.instances[self.current]
        self.current = (self.current + 1) % len(self.instances)
        return instance

# ======================
# API ENDPOINTS
# ======================
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "api-gateway"}

@app.post("/users")
async def create_user(user_data: dict):
    user_service = UserService()
    result = await user_service.create_user(user_data)
    return result

@app.get("/users/{user_id}")
async def get_user(user_id: int):
    user_service = UserService()
    user = await user_service.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, message="User not found")
    return user

# ======================
# MAIN
# ======================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
'''
            code_result["documentation"] = "Scalable backend with FastAPI, microservices, caching, and load balancing"
            code_result["files"] = ["main.py", "services.py", "models.py"]
        
        # RAG Pipeline Code
        elif "rag" in task_lower and "pipeline" in task_lower:
            code_result["code"] = '''"""
RAG (Retrieval Augmented Generation) Pipeline
For processing and querying 50k+ documents
"""

import os
from typing import List, Dict
import numpy as np

# ======================
# DOCUMENT PROCESSOR
# ======================
class DocumentProcessor:
    """Processes documents into chunks for embedding"""
    
    def __init__(self, chunk_size: int = 512, overlap: int = 50):
        self.chunk_size = chunk_size
        self.overlap = overlap
    
    def chunk_text(self, text: str) -> List[str]:
        """Split text into overlapping chunks"""
        words = text.split()
        chunks = []
        
        for i in range(0, len(words), self.chunk_size - self.overlap):
            chunk = " ".join(words[i:i + self.chunk_size])
            chunks.append(chunk)
        
        return chunks
    
    def process_document(self, doc_id: str, text: str) -> List[Dict]:
        """Process a single document"""
        chunks = self.chunk_text(text)
        
        processed = []
        for idx, chunk in enumerate(chunks):
            processed.append({
                "doc_id": doc_id,
                "chunk_id": f"{doc_id}_chunk_{idx}",
                "text": chunk,
                "metadata": {
                    "chunk_index": idx,
                    "total_chunks": len(chunks)
                }
            })
        
        return processed

# ======================
# EMBEDDING MANAGER
# ======================
class EmbeddingManager:
    """Manages document embeddings"""
    
    def __init__(self, embedding_dim: int = 768):
        self.embedding_dim = embedding_dim
        # In production, use actual embedding model
    
    def embed_text(self, text: str) -> np.ndarray:
        """Generate embedding for text"""
        # Simulate embedding (in production, use real model)
        return np.random.rand(self.embedding_dim)
    
    def batch_embed(self, texts: List[str]) -> List[np.ndarray]:
        """Embed multiple texts efficiently"""
        return [self.embed_text(text) for text in texts]

# ======================
# VECTOR STORE
# ======================
class VectorStore:
    """Stores and retrieves vectors efficiently"""
    
    def __init__(self):
        self.vectors = []
        self.metadata = []
        self.index = {}  # chunk_id -> index
    
    def add_vectors(self, chunk_ids: List[str], vectors: List[np.ndarray], 
                    metadata: List[Dict]):
        """Add vectors to the store"""
        for chunk_id, vector, meta in zip(chunk_ids, vectors, metadata):
            idx = len(self.vectors)
            self.vectors.append(vector)
            self.metadata.append(meta)
            self.index[chunk_id] = idx
    
    def similarity_search(self, query_vector: np.ndarray, 
                         top_k: int = 5) -> List[Dict]:
        """Find most similar vectors"""
        if not self.vectors:
            return []
        
        # Calculate cosine similarity
        similarities = []
        for idx, vec in enumerate(self.vectors):
            sim = np.dot(query_vector, vec) / (
                np.linalg.norm(query_vector) * np.linalg.norm(vec)
            )
            similarities.append((idx, sim))
        
        # Sort by similarity
        similarities.sort(key=lambda x: x[1], reverse=True)
        
        # Return top-k results
        results = []
        for idx, score in similarities[:top_k]:
            results.append({
                "metadata": self.metadata[idx],
                "score": float(score)
            })
        
        return results

# ======================
# RAG PIPELINE
# ======================
class RAGPipeline:
    """Complete RAG pipeline"""
    
    def __init__(self):
        self.processor = DocumentProcessor()
        self.embedder = EmbeddingManager()
        self.vector_store = VectorStore()
    
    def index_documents(self, documents: Dict[str, str]):
        """Index multiple documents"""
        print(f"Indexing {len(documents)} documents...")
        
        all_chunks = []
        for doc_id, text in documents.items():
            chunks = self.processor.process_document(doc_id, text)
            all_chunks.extend(chunks)
        
        # Generate embeddings
        texts = [chunk["text"] for chunk in all_chunks]
        embeddings = self.embedder.batch_embed(texts)
        
        # Store in vector store
        chunk_ids = [chunk["chunk_id"] for chunk in all_chunks]
        metadata = [chunk["metadata"] for chunk in all_chunks]
        self.vector_store.add_vectors(chunk_ids, embeddings, metadata)
        
        print(f"Indexed {len(all_chunks)} chunks")
    
    def query(self, query_text: str, top_k: int = 5) -> List[Dict]:
        """Query the RAG system"""
        # Embed query
        query_vector = self.embedder.embed_text(query_text)
        
        # Retrieve similar chunks
        results = self.vector_store.similarity_search(query_vector, top_k)
        
        return results

# ======================
# USAGE EXAMPLE
# ======================
if __name__ == "__main__":
    # Initialize pipeline
    rag = RAGPipeline()
    
    # Index sample documents
    documents = {
        "doc1": "AI in healthcare improves diagnostics...",
        "doc2": "Scalable backend architecture requires...",
        # ... 50k more documents
    }
    
    rag.index_documents(documents)
    
    # Query
    results = rag.query("How does AI help in healthcare?")
    print(f"Found {len(results)} relevant chunks")
'''
            code_result["documentation"] = "Complete RAG pipeline with document processing, embeddings, and vector search"
            code_result["files"] = ["rag_pipeline.py", "embeddings.py", "vector_store.py"]
        
        # Default - Simple code example
        else:
            code_result["code"] = '''"""
General Code Template
Adaptable structure for various tasks
"""

class TaskExecutor:
    """Main class for executing tasks"""
    
    def __init__(self, config: dict):
        self.config = config
        self.results = []
    
    def execute(self, task_data):
        """Execute the main task"""
        print(f"Executing task: {task_data}")
        
        # Process task
        result = self._process(task_data)
        
        # Store result
        self.results.append(result)
        
        return result
    
    def _process(self, data):
        """Internal processing logic"""
        # Add your logic here
        return {"status": "completed", "data": data}

# Usage
if __name__ == "__main__":
    executor = TaskExecutor(config={})
    result = executor.execute("sample task")
    print(result)
'''
            code_result["documentation"] = "Flexible code template for general tasks"
            code_result["files"] = ["main.py"]
        
        self.logger.info(f"Code generated: {len(code_result['code'])} characters")
        
        return code_result