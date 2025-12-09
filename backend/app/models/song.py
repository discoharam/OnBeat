from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.sql import func
from app.core.database import Base

class Song(Base):
    __tablename__ = "songs"

    # Core Fields
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, default="Untitled Track")
    artist = Column(String, default="OnBeat User")
    
    # AI Generation Fields
    prompt = Column(Text, nullable=True)
    genre = Column(String, nullable=True)
    duration = Column(Integer, default=30)
    
    # Status & Progress
    status = Column(String, default="draft", index=True) # pending, processing, completed, failed, draft
    progress = Column(Integer, default=0)
    
    # Files & Metadata (For Discover Page)
    file_url = Column(String, nullable=True)
    cover_url = Column(String, nullable=True)
    bpm = Column(Integer, nullable=True)
    key_signature = Column(String, nullable=True)
    tags = Column(JSON, nullable=True) # e.g. ["Chill", "Night"]

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
