import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.core.database import engine, Base
from app.routers import music

# Init DB
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

# CORS (Allow Frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Static Media (For serving generated MP3s locally)
app.mount("/media", StaticFiles(directory=settings.MEDIA_DIR), name="media")

# Routes
app.include_router(music.router, prefix=settings.API_V1_STR)

@app.get("/")
def health_check():
    return {"status": "online", "system": "OnBeat API"}
