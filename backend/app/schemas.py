from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Input
class GenerateRequest(BaseModel):
    prompt: str
    genre: Optional[str] = "Lo-Fi"
    duration: int = 30

# Output
class SongResponse(BaseModel):
    id: int
    title: str
    prompt: str
    status: str
    progress: int
    file_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
