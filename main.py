import logging
import sys
import os
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, Response
from contextlib import asynccontextmanager
from alembic import command
from alembic.config import Config
from fastapi.staticfiles import StaticFiles
from typing import Callable, Awaitable

# --- Configuration ---
PORT = int(os.getenv("PORT", 5000))
APP_ENV = os.environ.get("APP_ENV", "dev")  # dev ou prod
LOG_LEVEL = os.getenv("LOG_LEVEL",  "info" if APP_ENV == "prod" else "debug")
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# --- Logger basique ---
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(levelname)s - %(name)s - %(message)s",
    stream=sys.stdout,
    force=True,
)
logger = logging.getLogger("app")
if not logger.hasHandlers():
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(logging.Formatter("%(asctime)s - %(levelname)s - %(name)s - %(message)s"))
    logger.addHandler(handler)
logger.setLevel(logging.DEBUG if LOG_LEVEL == "debug" else logging.INFO)
logger.propagate = False

# --- Alembic ---
alembic_cfg = Config(os.path.join(BASE_DIR, "alembic.ini"))

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Démarrage de l'application ⏳")
    logger.info(f"{'🚀' if APP_ENV == 'prod' else '🐛'} Environnement : {APP_ENV}")
    logger.info(f"📃 Log level : {LOG_LEVEL}")

    # Exécution des migrations avant que le serveur ne démarre
    try:
        command.upgrade(alembic_cfg, "head")
        logger.info("Migrations Alembic appliquées ✅")
    except Exception:
        logger.exception("Erreur lors des migrations Alembic")
        raise

    yield
    logger.info("Application arrêtée 🛑")

# --- FastAPI App ---
app = FastAPI(
    title="My API",
    version="1.0",
    docs_url=None if APP_ENV=="prod" else "/api/docs",
    redoc_url=None if APP_ENV=="prod" else "/api/redoc",
    openapi_url=None if APP_ENV=="prod" else "/api/openapi.json",
    lifespan=lifespan,
)

# --- CORS pour le frontend si besoin ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
) 

# --- Middleware de logs des requêtes ---
@app.middleware("http")
async def log_requests(request: Request, call_next: Callable[[Request], Awaitable[Response]]) -> Response:
    logger.debug(f"Request: {request.method} {request.url}")
    try:
        body = await request.body()
        if body:
            logger.debug(f"Request body: {body}")
        response: Response = await call_next(request)
        logger.debug(f"Response status: {response.status_code}")
        return response
    except Exception as e:
        logger.exception(f"Exception sur {request.method} {request.url}: {e}")
        raise

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

    logger.debug(f"full_path: {full_path}")

    # Ne pas servir l'application SPA pour les routes API inexistantes
    if full_path.startswith("api/"):
        raise HTTPException(status_code=404, detail="API route not found")

    # Vérifie si le fichier existe dans static
    file_path = os.path.join(BASE_DIR, "static", full_path)
    if os.path.isfile(file_path):
        return FileResponse(file_path)
    
    # Fallback vers index.html
    return FileResponse(os.path.join(BASE_DIR, "static", "index.html"))

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=5000,
        log_level=LOG_LEVEL,
        #access_log=True
    )