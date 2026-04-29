from __future__ import annotations

from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings

from utils.settings import settings


def get_vector_store(collection_name: str = "launchpilot-knowledge") -> Chroma:
    embeddings = OpenAIEmbeddings(
        api_key=settings.openrouter_api_key,
        model=settings.embedding_model,
        base_url=settings.openrouter_base_url,
    )
    return Chroma(
        collection_name=collection_name,
        persist_directory=settings.chroma_persist_directory,
        embedding_function=embeddings,
    )
