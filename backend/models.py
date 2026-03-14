from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from pgvector.sqlalchemy import Vector
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    items = relationship("SavedItem", back_populates="owner", cascade="all, delete-orphan")

class SavedItem(Base):
    __tablename__ = "saved_items"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    url = Column(String)
    platform = Column(String)
    media_type = Column(String)
    creator = Column(String)
    caption = Column(Text)
    description = Column(Text)
    tags = Column(String) # Comma-separated
    category = Column(String)
    language = Column(String)
    thumbnail_url = Column(String)
    embedding_vector = Column(Vector(1536))
    source = Column(String)
    source_collection = Column(String)
    timestamp = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    owner = relationship("User", back_populates="items")

class ImportTask(Base):
    __tablename__ = "import_tasks"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    total_items = Column(Integer, default=0)
    processed_items = Column(Integer, default=0)
    failed_items = Column(Integer, default=0)
    duplicate_items = Column(Integer, default=0)
    status = Column(String, default="PENDING")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
