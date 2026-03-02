from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os

from database import engine, Base
import models.player # <-- IMPORTANT pour que SQLAlchemy connaisse le modèle
# --- Créer la base si elle n'existe pas ---
Base.metadata.create_all(bind=engine)

# --- App FastAPI ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
app = FastAPI(
    title="My API",
    version="1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)
# pour la prod
#app = FastAPI(
#    docs_url=None,
#    redoc_url=None
#)
# --- CORS pour le frontend si besoin ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ 1️⃣ Inclure les routes API EN PREMIER
from routes.players import router as players_router
app.include_router(players_router)

# --- Serve SPA ---
app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static")

# ✅ 2️⃣ Catch-all SPA EN DERNIER
@app.get("/{full_path:path}", include_in_schema=False)
def serve_spa(full_path: str):

    # Vérifie si le fichier existe dans static
    file_path = os.path.join(BASE_DIR, "static", full_path)
    if os.path.isfile(file_path):
        return FileResponse(file_path)
    
    # Fallback vers index.html
    return FileResponse(os.path.join(BASE_DIR, "static", "index.html"))
