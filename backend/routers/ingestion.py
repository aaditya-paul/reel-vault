from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, UploadFile, File
from pydantic import BaseModel
from sqlalchemy.orm import Session
import os
import json
import zipfile
import tempfile
import shutil
from typing import Optional

from database import get_db
import models
from models import SavedItem, ImportTask
from routers.search import get_embedding
from dependencies import get_current_user

router = APIRouter(prefix="/api/ingestion", tags=["Ingestion"])

class SaveUrlRequest(BaseModel):
    url: str

def process_url_task(item_id: int, url: str):
    """Background task to fetch, enrich, and embed a URL."""
    # In a real app, this runs in Celery. For this MVP we will simulate processing.
    # 1. Fetch DOM or download video stream
    # 2. Extract transcript/OCR
    # 3. Call Gemini 1.5 Flash to get tags and description
    # 4. Generate Text Embedding 
    # 5. Save to database
    pass

@router.post("/save-url")
def save_url(
    req: SaveUrlRequest, 
    background_tasks: BackgroundTasks, 
    db: Session = Depends(get_db), 
    user_id: int = Depends(get_current_user)
):
    """Mode A: Start Fresh - Saves a single URL and queues background processing."""
    # 1. Check for duplicates
    existing = db.query(models.SavedItem).filter(
        models.SavedItem.user_id == user_id, 
        models.SavedItem.url == req.url
    ).first()
    
    if existing:
        return {"message": "URL already in vault", "item_id": existing.id}
        
    # 2. Create pending item
    new_item = models.SavedItem(
        user_id=user_id,
        url=req.url,
        source="manual_url",
        status="PENDING" # Assumes adding a status field or using description as placeholder
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    
    # 3. Queue task
    background_tasks.add_task(process_url_task, new_item.id, req.url)
    
    return {"message": "Processing started", "item_id": new_item.id}

@router.post("/upload-file")
async def upload_file(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = BackgroundTasks(),
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    """Mode A: Start Fresh - Handles direct media file uploads."""
    # Create temp file
    fd, temp_path = tempfile.mkstemp(suffix=f"_{file.filename}")
    with os.fdopen(fd, "wb") as buffer:
        buffer.write(await file.read())
        
    new_item = models.SavedItem(
        user_id=user_id,
        source="manual_upload",
        status="PENDING",
        media_type=file.content_type
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    
    # Normally pass temp_path to background worker to extract vision/audio then upload to S3
    background_tasks.add_task(process_url_task, new_item.id, temp_path)
    
    return {"message": "File uploaded and processing started", "item_id": new_item.id}

@router.post("/import-instagram")
async def import_instagram(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = BackgroundTasks(),
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    """Mode B: Import Instagram - Handles ZIP uploads and queues extraction."""
    if not file.filename.endswith('.zip'):
        raise HTTPException(status_code=400, detail="Must be a ZIP file")
        
    # Create import task record
    import_task = models.ImportTask(user_id=user_id, status="PROCESSING")
    db.add(import_task)
    db.commit()
    db.refresh(import_task)
    
    fd, temp_zip_path = tempfile.mkstemp(suffix=".zip")
    with os.fdopen(fd, "wb") as buffer:
        buffer.write(await file.read())
        
    def process_zip_bg(task_id: int, zip_path: str, user_id: int):
        # Dedicated DB session for thread
        db_bg = next(get_db())
        task_record = db_bg.query(models.ImportTask).filter(models.ImportTask.id == task_id).first()
        try:
            with tempfile.TemporaryDirectory() as extract_dir:
                with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                    zip_ref.extractall(extract_dir)
                    
                # Look for saved_posts.json anywhere in the zip
                json_path = None
                for root, dirs, files in os.walk(extract_dir):
                    for name in files:
                        if name == 'saved_posts.json':
                            json_path = os.path.join(root, name)
                            break
                    if json_path: break
                
                if not json_path:
                    task_record.status = "FAILED"
                    db_bg.commit()
                    return
                
                with open(json_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    
                # Instagram format usually: {"saved_saved_media": [{"string_list_data": [{"href": "url"}]}]}
                urls = []
                for entry in data.get("saved_saved_media", []):
                    for item in entry.get("string_list_data", []):
                        if "href" in item:
                            urls.append(item["href"])
                            
                task_record.total_items = len(urls)
                
                # Check duplicates and queue
                for url in urls:
                    exists = db_bg.query(models.SavedItem).filter(models.SavedItem.user_id == user_id, models.SavedItem.url == url).first()
                    if exists:
                        task_record.duplicate_items += 1
                        continue
                        
                    new_item = models.SavedItem(user_id=user_id, url=url, source="instagram_import", status="PENDING")
                    db_bg.add(new_item)
                    db_bg.commit()
                    db_bg.refresh(new_item)
                    # Enqueue single item processes (would normally send to Celery)
                    # For MVP we simulate kicking off the task
                    task_record.processed_items += 1
                    
                task_record.status = "COMPLETED"
                db_bg.commit()
        except Exception as e:
            print("Import failed:", e)
            task_record.status = "FAILED"
            db_bg.commit()
        finally:
            os.remove(zip_path)
            db_bg.close()

    background_tasks.add_task(process_zip_bg, import_task.id, temp_zip_path, user_id)
    return {"message": "Import started", "task_id": import_task.id}
