from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = FastAPI(
    title="My API",
    version="1.0",
    docs_url="/docs",  # Swagger UI
    redoc_url="/redoc"
)

# --- CORS pour le frontend si besoin ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API example ---
items = [{"id": 1, "name": "Item 1"}, {"id": 2, "name": "Item 2"}]

@app.get("/api/items")
def get_items():
    return items

@app.post("/api/items")
def add_item(name: str):
    new_id = max([i["id"] for i in items], default=0) + 1
    item = {"id": new_id, "name": name}
    items.append(item)
    return item

# --- Serve SPA ---
app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static")

@app.get("/{full_path:path}")
def serve_spa(full_path: str):
    # Si c'est une route API, renvoyer 404
    if full_path.startswith("api/"):
        return {"error": "Not found"}
    
    # Vérifie si le fichier existe dans static
    file_path = os.path.join(BASE_DIR, "static", full_path)
    if os.path.isfile(file_path):
        return FileResponse(file_path)
    
    # Fallback vers index.html
    return FileResponse(os.path.join(BASE_DIR, "static", "index.html"))


# --- Import routes ---
from routes.players import router as players_router
app.include_router(players_router)