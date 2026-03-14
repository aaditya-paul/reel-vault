from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Optional
import os

from database import get_db
import models
from routers.items import get_current_user_id

# In production this should be a singleton client from a services module
import openai

router = APIRouter(prefix="/api/search", tags=["Search"])

# Dummy API Key check for MVP
openai.api_key = os.getenv("OPENAI_API_KEY", "mock-key")

class SearchQuery(BaseModel):
    query: str
    limit: Optional[int] = 20

def get_embedding(text: str) -> List[float]:
    """Get embedding from OpenAI API. Fallback to mock for testing if no key."""
    if openai.api_key == "mock-key" or not openai.api_key:
        # Return random/mock vector measuring 1536 dim
        return [0.0] * 1536
        
    try:
        response = openai.embeddings.create(
            input=text,
            model="text-embedding-3-small"
        )
        return response.data[0].embedding
    except Exception as e:
        print(f"Embedding error: {e}")
        return [0.0] * 1536

@router.post("")
def search_vault(search: SearchQuery, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    """Search the user's vault using semantic similarity (pgvector)."""
    if not search.query.strip():
        # Fallback to recent items if empty query
        items = db.query(models.SavedItem).filter(models.SavedItem.user_id == user_id).order_by(models.SavedItem.created_at.desc()).limit(search.limit).all()
    else:
        # 1. Convert text query to embedding
        query_vector = get_embedding(search.query)
        
        # 2. Perform Cosine Similarity Search using pgvector
        # Operator <=> is cosine distance
        items = db.query(models.SavedItem).filter(
            models.SavedItem.user_id == user_id,
            models.SavedItem.embedding_vector.is_not(None)
        ).order_by(
            models.SavedItem.embedding_vector.cosine_distance(query_vector)
        ).limit(search.limit).all()
        
    # Exclude embeddings from payload to save bandwidth
    for item in items:
        item.embedding_vector = None
        
    return items
