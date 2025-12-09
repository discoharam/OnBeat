from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

# -- Request Payloads --
class GenerateRequest(BaseModel):
    prompt: str
    genre: Optional[str] = "Lo-Fi"
    duration: int = 30

# -- Response Models --
class BeatResponse(BaseModel):
    id: int
    title: str
    artist: str
    bpm: Optional[int]
    key_signature: Optional[str] = Field(None, alias='keySignature')
    tags: Optional[List[str]]
    file_url: Optional[str]

    class Config:
        from_attributes = True
        populate_by_name = True

class SongResponse(BaseModel):
    id: int
    title: str
    prompt: Optional[str]
    status: str
    progress: int
    file_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
