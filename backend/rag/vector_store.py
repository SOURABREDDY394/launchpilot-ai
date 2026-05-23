from __future__ import annotations
import os

# Try to import Chroma, but fallback to a Mock if it fails
try:
    from langchain_chroma import Chroma
except ImportError:
    Chroma = None

from langchain_openai import OpenAIEmbeddings
from utils.settings import settings

class MockVectorStore:
    def __init__(self, *args, **kwargs):
        pass
    def add_documents(self, *args, **kwargs):
        print("MOCK: add_documents called (RAG dependency missing)")
        return []
    def similarity_search(self, *args, **kwargs):
        print("MOCK: similarity_search called (RAG dependency missing)")
        return []
    def get(self, *args, **kwargs):
        return {"metadatas": []}
    def delete(self, *args, **kwargs):
        pass

def get_vector_store(collection_name: str = "launchpilot-knowledge"):
    embeddings = OpenAIEmbeddings(
        api_key=settings.openrouter_api_key,
        model=settings.embedding_model,
        base_url=settings.openrouter_base_url,
    )
    
    if Chroma is None:
        return MockVectorStore()
        
    return Chroma(
        collection_name=collection_name,
        persist_directory=settings.chroma_persist_directory,
        embedding_function=embeddings,
    )
