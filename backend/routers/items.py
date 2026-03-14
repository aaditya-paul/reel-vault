from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models

router = APIRouter(prefix="/api/vault", tags=["Vault Management"])

# Mock User ID for MVP (Would be extracted from JWT auth normally)
MOCK_USER_ID = 1

def get_current_user_id() -> int:
    return MOCK_USER_ID

@router.get("/items")
def get_items(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    """Fetch all saved items for the current user, ordered by newest first."""
    items = db.query(models.SavedItem).filter(models.SavedItem.user_id == user_id).order_by(models.SavedItem.created_at.desc()).all()
    # Exclude embedding vector from response to save bandwidth
    for item in items:
        item.embedding_vector = None 
    return items

@router.get("/item/{item_id}")
def get_item(item_id: int, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    """Fetch a specific item's details."""
    item = db.query(models.SavedItem).filter(models.SavedItem.id == item_id, models.SavedItem.user_id == user_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    item.embedding_vector = None
    return item

@router.delete("/item/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    """Delete a specific item."""
    item = db.query(models.SavedItem).filter(models.SavedItem.id == item_id, models.SavedItem.user_id == user_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    db.delete(item)
    db.commit()
    return {"message": "Item deleted successfully"}

@router.delete("/vault")
def delete_vault(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    """Completely wipe all items from the user's vault."""
    db.query(models.SavedItem).filter(models.SavedItem.user_id == user_id).delete()
    db.query(models.ImportTask).filter(models.ImportTask.user_id == user_id).delete()
    db.commit()
    return {"message": "Vault successfully wiped. All data deleted."}
