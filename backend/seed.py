import sys
import os

# Add path for imports
sys.path.append(os.getcwd())

from app.core.database import SessionLocal, engine, Base
from app.models.song import Song

# Re-create database
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

db = SessionLocal()

SEED_BEATS = [
  {"id": 1, "title": "Midnight Tokyo", "artist": "Lofi Gods", "bpm": 85, "key_signature": "Cm", "tags": ["Chill", "Night"], "file_url": "/media/sample.mp3", "genre": "Lo-Fi"},
  {"id": 2, "title": "Drill Season", "artist": "Metro 808", "bpm": 140, "key_signature": "Fm", "tags": ["Dark", "Hard"], "file_url": "/media/sample.mp3", "genre": "Drill"},
  {"id": 3, "title": "Golden Hour", "artist": "Sunset Vibes", "bpm": 110, "key_signature": "E", "tags": ["Summer", "Happy"], "file_url": "/media/sample.mp3", "genre": "Pop"},
  {"id": 4, "title": "Cyberpunk City", "artist": "Synthwave X", "bpm": 128, "key_signature": "Am", "tags": ["Retro", "Synth"], "file_url": "/media/sample.mp3", "genre": "Synthwave"},
  {"id": 5, "title": "Deep Ocean", "artist": "Ambient Flow", "bpm": 60, "key_signature": "G#m", "tags": ["Atmospheric"], "file_url": "/media/sample.mp3", "genre": "Ambient"},
  {"id": 6, "title": "Club Banger", "artist": "Pop Charts", "bpm": 124, "key_signature": "Bm", "tags": ["Party", "Dance"], "file_url": "/media/sample.mp3", "genre": "House"},
  {"id": 7, "title": "Soulful Keys", "artist": "Jazz Cats", "bpm": 90, "key_signature": "C#m", "tags": ["Smooth", "Piano"], "file_url": "/media/sample.mp3", "genre": "Soul"},
  {"id": 8, "title": "Dark Knight", "artist": "Orchestra", "bpm": 70, "key_signature": "Dm", "tags": ["Epic", "Orchestral"], "file_url": "/media/sample.mp3", "genre": "Cinematic"},
]

try:
    print("Seeding database with royalty-free beats...")
    for beat_data in SEED_BEATS:
        beat = Song(**beat_data, status="completed")
        db.add(beat)
    db.commit()
    print("✅ Seeding complete!")
except Exception as e:
    print(f"❌ Error seeding database: {e}")
finally:
    db.close()
