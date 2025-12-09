from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.song import Song
from app.schemas import GenerateRequest, SongResponse

router = APIRouter(prefix="/music", tags=["music"])

# 1. Start Generation Job
@router.post("/generate", response_model=SongResponse)
def create_generation_job(req: GenerateRequest, db: Session = Depends(get_db)):
    # Create DB Entry marked as 'pending'
    new_song = Song(
        prompt=req.prompt,
        genre=req.genre,
        duration=req.duration,
        status="pending",
        title=f"{req.genre} - AI Gen"
    )
    db.add(new_song)
    db.commit()
    db.refresh(new_song)
    return new_song

# 2. Check Job Status (Polling)
@router.get("/status/{song_id}", response_model=SongResponse)
def get_song_status(song_id: int, db: Session = Depends(get_db)):
    song = db.query(Song).filter(Song.id == song_id).first()
    if not song:
        raise HTTPException(status_code=404, detail="Job not found")
    return song

# 3. Get User History
@router.get("/history", response_model=List[SongResponse])
def get_history(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return db.query(Song).order_by(Song.created_at.desc()).offset(skip).limit(limit).all()
