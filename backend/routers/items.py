from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import SavedItem, User
from dependencies import get_current_user

router = APIRouter(prefix="/api/vault", tags=["Vault Items"])

@router.get("/items")
def get_vault_items(db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):
    """Fetch all saved items for the current user."""
    items = db.query(SavedItem).filter(SavedItem.user_id == user_id).order_by(SavedItem.timestamp.desc()).all()
    # Exclude embedding vector from response to save bandwidth
    for item in items:
        item.embedding_vector = None 
    return items

@router.get("/item/{item_id}")
def get_item(item_id: int, db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):
    """Fetch a specific item by ID."""
    item = db.query(SavedItem).filter(SavedItem.id == item_id, SavedItem.user_id == user_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    item.embedding_vector = None
    return item

@router.delete("/item/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):
    """Delete a specific item."""
    item = db.query(SavedItem).filter(SavedItem.id == item_id, SavedItem.user_id == user_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    db.delete(item)
    db.commit()
    return {"message": "Item deleted successfully"}

@router.delete("")
def delete_vault(db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):
    """Wipe the entire user vault (privacy compliance)."""
    db.query(SavedItem).filter(SavedItem.user_id == user_id).delete()
    db.query(models.ImportTask).filter(models.ImportTask.user_id == user_id).delete()
    db.commit()
    return {"message": "Vault successfully wiped. All data deleted."}
