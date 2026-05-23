from __future__ import annotations

import os
import shutil
import uuid
from datetime import datetime
from tempfile import NamedTemporaryFile
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, File, HTTPException, UploadFile
from langchain_community.document_loaders import (
    CSVLoader,
    Docx2txtLoader,
    PyPDFLoader,
    TextLoader,
)
from langchain_community.tools import DuckDuckGoSearchRun
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_text_splitters import RecursiveCharacterTextSplitter
from pydantic import BaseModel

from rag.vector_store import get_vector_store
from utils.llm import get_chat_llm
from utils.supabase_client import get_supabase_client

router = APIRouter(prefix="/rag", tags=["RAG Pipeline"])

class ChatRequest(BaseModel):
    question: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    answer: str
    sources: List[str]
    session_id: str

class DocumentInfo(BaseModel):
    id: str
    name: str
    type: str
    uploaded_at: str

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    suffix = os.path.splitext(file.filename)[1].lower()
    if suffix not in [".pdf", ".docx", ".txt", ".csv"]:
        raise HTTPException(status_code=400, detail="Unsupported file format")

    with NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    try:
        if suffix == ".pdf":
            loader = PyPDFLoader(tmp_path)
        elif suffix == ".docx":
            loader = Docx2txtLoader(tmp_path)
        elif suffix == ".csv":
            loader = CSVLoader(tmp_path)
        else:
            loader = TextLoader(tmp_path)

        documents = loader.load()
        
        # Add metadata
        doc_id = str(uuid.uuid4())
        for doc in documents:
            doc.metadata["source"] = file.filename
            doc.metadata["doc_id"] = doc_id
            doc.metadata["uploaded_at"] = datetime.now().isoformat()

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        chunks = text_splitter.split_documents(documents)

        vector_store = get_vector_store()
        vector_store.add_documents(chunks)

        return {"message": "File processed successfully", "doc_id": doc_id, "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    session_id = request.session_id or str(uuid.uuid4())
    vector_store = get_vector_store()
    
    # 1. Search for context
    docs = vector_store.similarity_search(request.question, k=5)
    
    context = ""
    sources = []
    if docs:
        context = "\n\n".join([doc.page_content for doc in docs])
        sources = list(set([doc.metadata.get("source", "Unknown") for doc in docs]))

    # 2. Decision: Use RAG or Fallback
    llm = get_chat_llm(temperature=0.3)
    
    if context:
        prompt = f"""
You are LaunchPilot AI, a helpful assistant. Use the provided context to answer the user's question.
If the context doesn't contain the answer, say you don't know based on the documents but will try to answer from general knowledge if possible, or use your tools.

Context:
{context}

Question: {request.question}
"""
    else:
        # Fallback to DuckDuckGo
        search = DuckDuckGoSearchRun()
        search_results = search.run(request.question)
        prompt = f"""
No specific documents were found in the knowledge base. I searched the web for you.
Search Results:
{search_results}

Question: {request.question}
"""
        sources = ["Web Search (DuckDuckGo)"]

    messages = [
        SystemMessage(content="You are a senior startup consultant assistant."),
        HumanMessage(content=prompt)
    ]
    
    response = await llm.ainvoke(messages)
    answer = response.content

    # 3. Store in Supabase
    supabase = get_supabase_client()
    if supabase:
        try:
            supabase.table("rag_chat_history").insert({
                "session_id": session_id,
                "user_id": "local-workspace",
                "question": request.question,
                "answer": answer,
                "sources": sources,
                "created_at": datetime.now().isoformat()
            }).execute()
        except Exception as e:
            print(f"Error saving chat history: {e}")

    return ChatResponse(answer=answer, sources=sources, session_id=session_id)

@router.get("/documents", response_model=List[DocumentInfo])
async def list_documents():
    vector_store = get_vector_store()
    # Chroma doesn't have a direct 'list unique sources' method that's efficient
    # We'll get all metadata and deduplicate by source/doc_id
    try:
        results = vector_store.get()
        metadatas = results.get("metadatas", [])
        
        unique_docs = {}
        for meta in metadatas:
            d_id = meta.get("doc_id")
            if d_id and d_id not in unique_docs:
                unique_docs[d_id] = DocumentInfo(
                    id=d_id,
                    name=meta.get("source", "Unknown"),
                    type=os.path.splitext(meta.get("source", ""))[1][1:] or "file",
                    uploaded_at=meta.get("uploaded_at", "")
                )
        return list(unique_docs.values())
    except Exception as e:
        return []

@router.delete("/documents/{id}")
async def delete_document(id: str):
    vector_store = get_vector_store()
    try:
        # Delete by metadata filter
        vector_store.delete(where={"doc_id": id})
        return {"message": "Document deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting document: {str(e)}")
