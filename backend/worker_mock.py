import time
import random
import sys
import os

# Add path for imports
sys.path.append(os.getcwd())

from app.core.database import SessionLocal
from app.models.song import Song

def run_worker():
    print("🤖 AI Worker: Online & Polling...")
    
    while True:
        db = SessionLocal()
        try:
            # 1. Fetch oldest pending job
            job = db.query(Song).filter(Song.status == "pending").first()
            
            if job:
                print(f"⚡ Processing Job #{job.id}: {job.prompt}")
                
                # 2. Update to Processing
                job.status = "processing"
                db.commit()
                
                # 3. Simulate GPU Work (Progress updates)
                for i in range(0, 101, 20):
                    time.sleep(1) # Fake GPU lag
                    job.progress = i
                    db.commit()
                    print(f"   ↳ {i}% complete...")

                # 4. Finish
                # In real app: DiffRhythm2 generates .wav here
                # For now: We assign a public URL or local static file
                
                job.file_url = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
                job.status = "completed"
                job.progress = 100
                db.commit()
                print(f"✅ Job #{job.id} Finished!")
                
            else:
                time.sleep(2) # Idle wait
                
        except Exception as e:
            print(f"❌ Worker Error: {e}")
            if job:
                job.status = "failed"
                db.commit()
        finally:
            db.close()

if __name__ == "__main__":
    run_worker()
