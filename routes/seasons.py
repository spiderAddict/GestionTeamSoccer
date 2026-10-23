from fastapi import APIRouter, Depends, HTTPException
from typing import List
from datetime import datetime, timezone
from database import get_db
from models import Season
from sqlalchemy.orm import Session
from pydantic import BaseModel
from routes.season_deps import get_current_season

router = APIRouter(
    prefix="/api/seasons",
    tags=["seasons"]
)

SEASON_NAME_MAX_LENGTH = 50

# --- Schémas Pydantic ---
class SeasonSchema(BaseModel):
    id: int
    name: str
    is_current: bool
    closed_at: datetime | None = None

class SeasonCreate(BaseModel):
    name: str

def to_schema(season: Season) -> SeasonSchema:
    return SeasonSchema(
        id=season.id,
        name=season.name,
        is_current=season.closed_at is None,
        closed_at=season.closed_at
    )

# --- Routes ---
@router.get("", response_model=List[SeasonSchema])
def get_seasons(db: Session = Depends(get_db)) -> List[SeasonSchema]:
    seasons: List[Season] = db.query(Season).order_by(Season.id.desc()).all()
    # La saison en cours d'abord, puis les saisons clôturées de la plus récente à la plus ancienne
    seasons.sort(key=lambda s: s.closed_at is not None)
    return [to_schema(s) for s in seasons]

@router.post("", response_model=SeasonSchema)
def create_season(season: SeasonCreate, db: Session = Depends(get_db)) -> SeasonSchema:
    name = season.name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="Le nom de la saison est obligatoire")
    if len(name) > SEASON_NAME_MAX_LENGTH:
        raise HTTPException(status_code=400, detail=f"Le nom de la saison ne doit pas dépasser {SEASON_NAME_MAX_LENGTH} caractères")
    if db.query(Season).filter(Season.name == name).first():
        raise HTTPException(status_code=409, detail="Une saison porte déjà ce nom")

    # Clôture de la saison en cours et création de la nouvelle dans la même transaction
    current_season = get_current_season(db)
    current_season.closed_at = datetime.now(timezone.utc)
    db_season = Season(name=name)
    db.add(db_season)
    db.commit()
    db.refresh(db_season)
    return to_schema(db_season)
