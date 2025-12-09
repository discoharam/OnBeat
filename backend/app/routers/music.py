from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional  # <--- Added Optional here
from app.core.database import get_db
from app.models.song import Song
from app.schemas import GenerateRequest, SongResponse, BeatResponse

router = APIRouter(prefix="/music", tags=["music"])

# -- AI Generation Endpoints --

@router.post("/generate", response_model=SongResponse, summary="Create AI generation job")
def create_generation_job(req: GenerateRequest, db: Session = Depends(get_db)):
    new_song = Song(
        prompt=req.prompt,
        genre=req.genre,
        duration=req.duration,
        status="pending",
        title=f"{req.genre} AI Gen"
    )
    db.add(new_song)
    db.commit()
    db.refresh(new_song)
    return new_song

@router.get("/status/{song_id}", response_model=SongResponse, summary="Get job status")
def get_song_status(song_id: int, db: Session = Depends(get_db)):
    song = db.query(Song).filter(Song.id == song_id).first()
    if not song:
        raise HTTPException(status_code=404, detail="Job not found")
    return song

@router.get("/history", response_model=List[SongResponse], summary="Get user's AI gen history")
def get_history(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return db.query(Song).filter(Song.prompt != None).order_by(Song.created_at.desc()).offset(skip).limit(limit).all()

# -- Discover/Beats Endpoints --

@router.get("/beats", response_model=List[BeatResponse], summary="Get royalty-free beats")
def get_beats(
    genre: Optional[str] = Query(None), 
    limit: int = 20, 
    db: Session = Depends(get_db)
):
    query = db.query(Song).filter(Song.status == "completed", Song.prompt == None) # Filter for pre-made beats
    if genre and genre.lower() != 'trending':
        query = query.filter(Song.genre == genre)
    
    return query.order_by(Song.created_at.desc()).limit(limit).all()
