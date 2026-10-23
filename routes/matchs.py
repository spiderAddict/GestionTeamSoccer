from fastapi import APIRouter, Depends, HTTPException
from typing import List
from database import get_db
from models import Match, Season
from models import Player
from sqlalchemy.orm import Session
from pydantic import BaseModel
from routes.season_deps import get_current_season, get_selected_season, ensure_season_open

router = APIRouter(
    prefix="/api/matchs",
    tags=["matchs"]
)

# --- Schéma Pydantic pour requêtes/réponses ---
class MatchSchema(BaseModel):
    id: str
    season_id: int
    date: str
    result: str | None = None
    versus_team: str | None = None
    players: List[str]

    model_config = {
        "from_attributes": True
    }

# --- Schéma pour création / édition ---
class MatchCreate(BaseModel):
    date: str
    result: str | None = None
    versus_team: str | None = None
    players: List[str]

# --- CRUD --- 
@router.get("", response_model=List[MatchSchema])
def get_matchs(season: Season = Depends(get_selected_season), db: Session = Depends(get_db)) -> List[Match]:
    return db.query(Match).filter(Match.season_id == season.id).all()

@router.post("", response_model=MatchSchema)
def create_match(match: MatchCreate, current_season: Season = Depends(get_current_season), db: Session = Depends(get_db)) -> Match:

    if not (3 <= len(match.players) <= 8):
        raise HTTPException(status_code=400, detail="Il faut sélectionner entre 3 et 8 joueurs")
    
    # Vérifier que les joueurs existent
    db_players: List[Player] = db.query(Player).filter(Player.id.in_(match.players)).all()
    if len(db_players) != len(match.players):
        raise HTTPException(status_code=400, detail="Certains joueurs n'existent pas")

    db_match = Match(
        season_id=current_season.id,
        date=match.date,
        result=match.result,
        versus_team=match.versus_team,
        players=match.players
    )
    db.add(db_match)
    db.commit()
    db.refresh(db_match)
    return db_match

@router.get("/{match_id}", response_model=MatchSchema)
def get_match(match_id: str, db: Session = Depends(get_db)) -> Match:
    db_match: Match | None = db.query(Match).filter(Match.id == match_id).first()
    if not db_match:
        raise HTTPException(status_code=404, detail="Match not found")
    return db_match

@router.put("/{match_id}", response_model=MatchSchema)
def update_match(match_id: str, match: MatchCreate, db: Session = Depends(get_db)) -> Match:
    db_match: Match | None = db.query(Match).filter(Match.id == match_id).first()
    if not db_match:
        raise HTTPException(status_code=404, detail="Match not found")
    ensure_season_open(db.get(Season, db_match.season_id))

    if not (3 <= len(match.players) <= 8):
        raise HTTPException(status_code=400, detail="Il faut sélectionner entre 3 et 8 joueurs")
    
    db_players: List[Player] = db.query(Player).filter(Player.id.in_(match.players)).all()
    if len(db_players) != len(match.players):
        raise HTTPException(status_code=400, detail="Certains joueurs n'existent pas")

    db_match.date = match.date
    db_match.result = match.result
    db_match.versus_team = match.versus_team
    db_match.players = match.players

    db.commit()
    db.refresh(db_match)
    return db_match

@router.delete("/{match_id}")
def delete_match(match_id: str, db: Session = Depends(get_db)) -> dict[str, str]:
    db_match: Match | None = db.query(Match).filter(Match.id == match_id).first()
    if not db_match:
        raise HTTPException(status_code=404, detail="Match not found")
    ensure_season_open(db.get(Season, db_match.season_id))
    db.delete(db_match)
    db.commit()
    return {"status": "deleted"}