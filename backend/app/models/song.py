from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from app.core.database import Base

class Song(Base):
    __tablename__ = "songs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, default="Untitled Track")
    prompt = Column(Text)
    genre = Column(String, nullable=True)
    duration = Column(Integer, default=30)
    
    # Status: pending, processing, completed, failed
    status = Column(String, default="pending", index=True)
    progress = Column(Integer, default=0)
    
    # URLs
    file_url = Column(String, nullable=True)
    cover_url = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
