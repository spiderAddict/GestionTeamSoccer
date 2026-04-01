from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os

# migration auto au démarrage
from contextlib import asynccontextmanager
from alembic import command
from alembic.config import Config
alembic_cfg = Config("alembic.ini")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Avant le démarrage
    try:
        command.upgrade(alembic_cfg, "head")
        print("Migrations Alembic appliquées ✅")
    except Exception as e:
        print("Erreur migrations Alembic:", e)
    yield
    # Après la fermeture (shutdown)
    print("Application arrêtée")

# --- App FastAPI ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
app = FastAPI(
    title="My API",
    version="1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan
)
# pour la prod
#app = FastAPI(
#    docs_url=None,
#    redoc_url=None
#)


# --- LOGS pour le debug si besoin
import logging
import sys

# Config logger
logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)
logger = logging.getLogger("uvicorn.error")

# Middleware pour loguer toutes les requêtes et exceptions
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.debug(f"Request: {request.method} {request.url}")
    try:
        response = await call_next(request)
    except Exception as e:
        logger.exception(f"Exception on {request.method} {request.url}: {e}")
        raise
    logger.debug(f"Response status: {response.status_code}")
    return response

# --- CORS pour le frontend si besoin ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ 1️⃣ Inclure les routes API EN PREMIER
from routes import players_router, matchs_router, payments_router, version_router
app.include_router(players_router)
app.include_router(matchs_router)
app.include_router(payments_router)
app.include_router(version_router)

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
